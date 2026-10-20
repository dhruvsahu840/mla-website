"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Search,
  Users,
  Eye,
  X,
  Phone,
  Mail,
  CalendarDays,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  UserRound,
  ClipboardList,
  MapPin,
  BriefcaseBusiness,
  User,
} from "lucide-react";
import AdminShell from "@/components/admin/AdminShell";
import { apiGet } from "@/lib/api";

type Citizen = {
  id: string;
  name: string;
  email?: string | null;
  phone?: string | null;
  subject?: string | null;
  message?: string | null;
  gender?: string | null;
  age?: number | null;
  address?: string | null;
  village?: string | null;
  tehsil?: string | null;
  district?: string | null;
  occupation?: string | null;
  createdAt: string;
};

type ApiResult = {
  success: boolean;
  data: Citizen[] | null;
  meta?: {
    total?: number;
    page?: number;
    pageSize?: number;
  } | null;
};

type CitizenDetails = {
  name: string;
  phone: string;
  gender: string;
  age: string;
  occupation: string;
  village: string;
  tehsil: string;
  district: string;
  address: string;
  extraMessage: string;
};

const PAGE_SIZE = 20;

function formatDate(value?: string) {
  if (!value) return "—";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleString("hi-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * Reads citizen details from the existing Hindi contact-form message.
 * Also supports details stored in separate database columns.
 */
function getCitizenDetails(citizen: Citizen): CitizenDetails {
  const lines = (citizen.message || "")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  const fields: Record<string, string> = {};
  const remainingLines: string[] = [];
  let readingAddress = false;
  const addressLines: string[] = [];

  const patterns: Record<string, RegExp> = {
    firstName: /^(?:पहला नाम|प्रथम नाम|first name)\s*:\s*(.*)$/i,
    lastName: /^(?:आख़िरी नाम|आखिरी नाम|अंतिम नाम|last name)\s*:\s*(.*)$/i,
    phone: /^(?:फ़ोन नंबर|फोन नंबर|मोबाइल नंबर|संपर्क नंबर|phone number|mobile number)\s*:\s*(.*)$/i,
    gender: /^(?:लिंग|gender)\s*:\s*(.*)$/i,
    age: /^(?:आयु|उम्र|age)\s*:\s*(.*)$/i,
    occupation: /^(?:व्यवसाय|पेशा|occupation)\s*:\s*(.*)$/i,
    village: /^(?:गाँव|गांव|ग्राम|गाँव\s*\/\s*क्षेत्र|क्षेत्र|village|area)\s*:\s*(.*)$/i,
    tehsil: /^(?:तहसील|tehsil)\s*:\s*(.*)$/i,
    district: /^(?:ज़िला|जिला|ज़िले|district)\s*:\s*(.*)$/i,
    address: /^(?:पूरा पता|पता|पूर्ण पता|full address|address)\s*:\s*(.*)$/i,
  };

  const isFieldLine = (line: string) =>
    Object.values(patterns).some((pattern) => pattern.test(line));

  for (const line of lines) {
    let matched = false;

    for (const [key, pattern] of Object.entries(patterns)) {
      const match = line.match(pattern);

      if (match) {
        fields[key] = match[1].trim();
        readingAddress = key === "address";

        if (key === "address" && match[1].trim()) {
          addressLines.push(match[1].trim());
        }

        matched = true;
        break;
      }
    }

    if (matched) continue;

    // Address values can span multiple lines until the next labelled field.
    if (readingAddress && !isFieldLine(line)) {
      addressLines.push(line);
      continue;
    }

    readingAddress = false;
    remainingLines.push(line);
  }

  const firstName = fields.firstName || "";
  const lastName = fields.lastName || "";
  const messageName = [firstName, lastName].filter(Boolean).join(" ");

  const separateAddress = citizen.address?.trim() || "";
  const parsedAddress = addressLines.join(", ").trim();

  // Avoid repeating the same address if the form contains duplicate lines.
  const uniqueAddress = [...new Set(
    (separateAddress || parsedAddress)
      .split(",")
      .map((part) => part.trim())
      .filter(Boolean)
  )].join(", ");

  return {
    name: messageName || citizen.name || "नाम उपलब्ध नहीं",
    phone: citizen.phone?.trim() || fields.phone || "",
    gender: citizen.gender?.trim() || fields.gender || "",
    age:
      citizen.age !== undefined && citizen.age !== null
        ? String(citizen.age)
        : fields.age || "",
    occupation: citizen.occupation?.trim() || fields.occupation || "",
    village: citizen.village?.trim() || fields.village || "",
    tehsil: citizen.tehsil?.trim() || fields.tehsil || "",
    district: citizen.district?.trim() || fields.district || "",
    address: uniqueAddress,
    extraMessage: remainingLines.join("\n").trim(),
  };
}

function Detail({
  label,
  value,
  icon,
}: {
  label: string;
  value?: string | number | null;
  icon?: React.ReactNode;
}) {
  if (
    value === undefined ||
    value === null ||
    !String(value).trim()
  ) {
    return null;
  }

  return (
    <div className="min-w-0 rounded-xl border border-slate-200 bg-white p-4">
      <div className="mb-2 flex items-center gap-2 text-xs font-medium text-slate-500">
        {icon}
        {label}
      </div>
      <p className="break-words text-sm font-semibold text-slate-800">
        {String(value)}
      </p>
    </div>
  );
}

export default function CitizensPage() {
  const [citizens, setCitizens] = useState<Citizen[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [selected, setSelected] = useState<Citizen | null>(null);

  const loadCitizens = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = (await apiGet<ApiResult>(
        `/api/contact/admin/all?page=${page}&pageSize=${PAGE_SIZE}`
      )) as ApiResult;

      if (!response?.success) {
        throw new Error("नागरिकों की सूची लोड नहीं हो सकी।");
      }

      setCitizens(response.data ?? []);
      setTotal(response.meta?.total ?? response.data?.length ?? 0);
    } catch {
      setError("सूची लोड नहीं हो सकी। कृपया दोबारा कोशिश करें।");
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    void loadCitizens();
  }, [loadCitizens]);

  useEffect(() => {
    if (!selected) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setSelected(null);
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selected]);

  const filtered = citizens.filter((citizen) => {
    const query = search.trim().toLowerCase();
    if (!query) return true;

    const details = getCitizenDetails(citizen);

    return [
      citizen.name,
      citizen.phone,
      citizen.email,
      details.name,
      details.phone,
      details.village,
      details.tehsil,
      details.district,
    ].some((value) => value?.toLowerCase().includes(query));
  });

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <AdminShell title="नागरिक सूची">
      <div className="min-h-screen bg-slate-50/80 px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl space-y-6">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-emerald-700">
                <Users size={17} />
                नागरिक प्रबंधन
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                नागरिकों की सूची
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                संपर्क फ़ॉर्म से प्राप्त नागरिकों की जानकारी देखें।
              </p>
            </div>

            <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
              <div className="rounded-lg bg-emerald-50 p-2 text-emerald-700">
                <Users size={20} />
              </div>
              <div>
                <p className="text-xs text-slate-500">कुल नागरिक</p>
                <p className="text-xl font-bold text-slate-900">
                  {total.toLocaleString("hi-IN")}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="font-semibold text-slate-900">
                  सभी नागरिक
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  पूरी जानकारी देखने के लिए किसी नागरिक पर क्लिक करें।
                </p>
              </div>

              <div className="relative w-full sm:max-w-sm">
                <Search
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="नाम, मोबाइल, ईमेल या गाँव खोजें..."
                  aria-label="नागरिक खोजें"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
                />
              </div>
            </div>

            {error && (
              <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
                <button
                  onClick={() => void loadCitizens()}
                  className="ml-2 font-semibold underline"
                >
                  फिर कोशिश करें
                </button>
              </div>
            )}

            <div className="mt-5 overflow-x-auto">
              <table className="w-full min-w-[580px] text-left">
                <thead>
                  <tr className="border-y border-slate-100 bg-slate-50/80 text-xs text-slate-500">
                    <th className="px-4 py-3 font-semibold">नागरिक का नाम</th>
                    <th className="px-4 py-3 font-semibold">मोबाइल नंबर</th>
                    <th className="px-4 py-3 font-semibold">पंजीकरण तारीख</th>
                    <th className="px-4 py-3 text-right font-semibold">विवरण</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {loading ? (
                    <tr>
                      <td colSpan={4} className="px-4 py-14 text-center text-sm text-slate-500">
                        नागरिकों की सूची लोड हो रही है...
                      </td>
                    </tr>
                  ) : filtered.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-4 py-14 text-center">
                        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                          <ClipboardList size={23} />
                        </div>
                        <p className="font-semibold text-slate-800">
                          {search ? "कोई नागरिक नहीं मिला" : "अभी कोई जानकारी उपलब्ध नहीं है"}
                        </p>
                        <p className="mt-1 text-sm text-slate-500">
                          {search
                            ? "किसी दूसरे नाम, नंबर या गाँव से खोजें।"
                            : "संपर्क फ़ॉर्म की जानकारी यहाँ दिखाई देगी।"}
                        </p>
                      </td>
                    </tr>
                  ) : (
                    filtered.map((citizen) => {
                      const details = getCitizenDetails(citizen);

                      return (
                        <tr
                          key={citizen.id}
                          onClick={() => setSelected(citizen)}
                          onKeyDown={(event) => {
                            if (event.key === "Enter" || event.key === " ") {
                              event.preventDefault();
                              setSelected(citizen);
                            }
                          }}
                          tabIndex={0}
                          role="button"
                          aria-label={`${details.name} की जानकारी देखें`}
                          className="cursor-pointer transition hover:bg-emerald-50/40 focus:bg-emerald-50/40 focus:outline-none"
                        >
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-3">
                              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-50 font-bold text-emerald-700">
                                {details.name.trim().charAt(0) || "न"}
                              </div>
                              <div className="min-w-0">
                                <p className="truncate font-semibold text-slate-900">
                                  {details.name}
                                </p>
                                {citizen.email && (
                                  <p className="mt-0.5 max-w-[240px] truncate text-xs text-slate-500">
                                    {citizen.email}
                                  </p>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-4 text-sm text-slate-700">
                            {details.phone || "—"}
                          </td>
                          <td className="px-4 py-4 text-sm text-slate-600">
                            {formatDate(citizen.createdAt)}
                          </td>
                          <td className="px-4 py-4 text-right">
                            <button
                              type="button"
                              onClick={(event) => {
                                event.stopPropagation();
                                setSelected(citizen);
                              }}
                              className="inline-flex items-center gap-2 rounded-lg border border-emerald-200 bg-white px-3 py-2 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-50"
                            >
                              <Eye size={16} />
                              देखें
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            <div className="mt-4 flex flex-col gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-slate-500">
                कुल {total.toLocaleString("hi-IN")} में से{" "}
                <span className="font-semibold text-slate-700">
                  {total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1}
                  {"–"}
                  {Math.min(page * PAGE_SIZE, total)}
                </span>{" "}
                दिखाए जा रहे हैं
              </p>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setPage((current) => Math.max(1, current - 1))}
                  disabled={page <= 1 || loading}
                  className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ChevronLeft size={16} />
                  पिछला
                </button>
                <span className="px-2 text-sm text-slate-600">
                  {page} / {totalPages}
                </span>
                <button
                  type="button"
                  onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
                  disabled={page >= totalPages || loading}
                  className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  अगला
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {selected && (() => {
        const details = getCitizenDetails(selected);

        return (
          <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/60 p-3 backdrop-blur-sm sm:p-6"
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) setSelected(null);
            }}
          >
            <section
              role="dialog"
              aria-modal="true"
              aria-labelledby="citizen-modal-title"
              className="flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
            >
              <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-5 py-5 sm:px-7">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
                    <UserRound size={25} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-emerald-700">
                      नागरिक का विवरण
                    </p>
                    <h2
                      id="citizen-modal-title"
                      className="mt-1 break-words text-xl font-bold text-slate-900"
                    >
                      {details.name}
                    </h2>
                    <p className="mt-1 text-xs text-slate-500">
                      पंजीकरण: {formatDate(selected.createdAt)}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSelected(null)}
                  aria-label="विवरण बंद करें"
                  className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
                >
                  <X size={21} />
                </button>
              </div>

              <div className="overflow-y-auto px-5 py-5 sm:px-7 sm:py-6">
                <h3 className="mb-3 text-sm font-bold text-slate-900">
                  व्यक्तिगत जानकारी
                </h3>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <Detail label="पूरा नाम" value={details.name} icon={<User size={15} />} />
                  <Detail label="मोबाइल नंबर" value={details.phone} icon={<Phone size={15} />} />
                  <Detail label="ईमेल" value={selected.email} icon={<Mail size={15} />} />
                  <Detail label="लिंग" value={details.gender} />
                  <Detail label="उम्र" value={details.age} />
                  <Detail label="व्यवसाय" value={details.occupation} icon={<BriefcaseBusiness size={15} />} />
                </div>

                {(details.village || details.tehsil || details.district || details.address) && (
                  <>
                    <h3 className="mb-3 mt-6 text-sm font-bold text-slate-900">
                      पता और क्षेत्र
                    </h3>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <Detail label="गाँव / क्षेत्र" value={details.village} icon={<MapPin size={15} />} />
                      <Detail label="तहसील" value={details.tehsil} />
                      <Detail label="जिला" value={details.district} />
                      <div className="sm:col-span-2">
                        <Detail label="पूरा पता" value={details.address} />
                      </div>
                    </div>
                  </>
                )}

                {(selected.subject || details.extraMessage) && (
                  <>
                    <h3 className="mb-3 mt-6 text-sm font-bold text-slate-900">
                      संपर्क संदेश
                    </h3>
                    <div className="space-y-3">
                      <Detail
                        label="विषय"
                        value={selected.subject}
                        icon={<MessageSquare size={15} />}
                      />
                      {details.extraMessage && (
                        <div className="rounded-xl border border-slate-200 bg-white p-4">
                          <p className="mb-2 text-xs font-medium text-slate-500">
                            संदेश
                          </p>
                          <p className="whitespace-pre-wrap break-words text-sm leading-6 text-slate-700">
                            {details.extraMessage}
                          </p>
                        </div>
                      )}
                    </div>
                  </>
                )}

                <div className="mt-6 flex items-center gap-2 text-xs text-slate-500">
                  <CalendarDays size={15} />
                  दर्ज करने की तारीख: {formatDate(selected.createdAt)}
                </div>
              </div>

              <div className="flex justify-end border-t border-slate-100 bg-slate-50 px-5 py-4 sm:px-7">
                <button
                  type="button"
                  onClick={() => setSelected(null)}
                  className="rounded-xl bg-emerald-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-800"
                >
                  बंद करें
                </button>
              </div>
            </section>
          </div>
        );
      })()}
    </AdminShell>
  );
}
