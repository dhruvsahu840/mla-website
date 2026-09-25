"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { CheckCircle2, Loader2 } from "lucide-react";
import { apiPost } from "@/lib/api";

const categories = [
  { value: "road", label: "सड़क" },
  { value: "water", label: "पानी" },
  { value: "electricity", label: "बिजली" },
  { value: "sanitation", label: "स्वच्छता" },
  { value: "healthcare", label: "स्वास्थ्य" },
  { value: "education", label: "शिक्षा" },
  { value: "public_safety", label: "सार्वजनिक सुरक्षा" },
  { value: "other", label: "अन्य" },
];

type Status = "idle" | "submitting" | "success" | "error";

export default function GrievanceForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [referenceNumber, setReferenceNumber] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setErrorMsg("");

    const form = new FormData(e.currentTarget);
    const payload = {
      name: String(form.get("name") || ""),
      phone: String(form.get("phone") || ""),
      email: String(form.get("email") || ""),
      category: String(form.get("category") || ""),
      subject: String(form.get("subject") || ""),
      description: String(form.get("description") || ""),
      location: String(form.get("location") || ""),
    };

    try {
      const res = await apiPost<{ referenceNumber: string }>("/api/grievances", payload);
      if (res.success && res.data) {
        setReferenceNumber(res.data.referenceNumber);
        setStatus("success");
      } else {
        setErrorMsg(res.message || "कुछ गलत हो गया, कृपया पुनः प्रयास करें।");
        setStatus("error");
      }
    } catch {
      setErrorMsg("सर्वर से संपर्क नहीं हो सका। कृपया बाद में पुनः प्रयास करें।");
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="bg-primary-light border border-primary/20 rounded-2xl p-8 text-center">
        <CheckCircle2 className="mx-auto text-primary" size={44} />
        <h2 className="font-display text-xl font-bold text-ink mt-4">आपकी शिकायत सफलतापूर्वक दर्ज हो गई है</h2>
        <p className="text-muted mt-2">अपना संदर्भ क्रमांक सुरक्षित रखें ताकि आप स्थिति ट्रैक कर सकें।</p>
        <p className="mt-4 inline-block bg-white border border-primary/30 rounded-lg px-5 py-2.5 font-mono font-bold text-primary text-lg">
          {referenceNumber}
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link href="/grievance/track" className="bg-primary text-white font-semibold px-5 py-2.5 rounded-full text-sm hover:bg-primary-dark">
            स्थिति ट्रैक करें
          </Link>
          <button
            onClick={() => setStatus("idle")}
            className="border border-line text-ink font-semibold px-5 py-2.5 rounded-full text-sm hover:border-primary"
          >
            नई शिकायत दर्ज करें
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-line rounded-2xl p-6 md:p-8 space-y-5">
      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="name" className="block text-sm font-semibold text-ink mb-1.5">पूरा नाम *</label>
          <input id="name" name="name" required minLength={2} className="w-full rounded-lg border border-line px-4 py-2.5 text-sm focus:border-primary" />
        </div>
        <div>
          <label htmlFor="phone" className="block text-sm font-semibold text-ink mb-1.5">मोबाइल नंबर *</label>
          <input id="phone" name="phone" required pattern="[6-9][0-9]{9}" maxLength={10} placeholder="10 अंकों का नंबर" className="w-full rounded-lg border border-line px-4 py-2.5 text-sm focus:border-primary" />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="email" className="block text-sm font-semibold text-ink mb-1.5">ईमेल (वैकल्पिक)</label>
          <input id="email" name="email" type="email" className="w-full rounded-lg border border-line px-4 py-2.5 text-sm focus:border-primary" />
        </div>
        <div>
          <label htmlFor="category" className="block text-sm font-semibold text-ink mb-1.5">श्रेणी *</label>
          <select id="category" name="category" required className="w-full rounded-lg border border-line px-4 py-2.5 text-sm focus:border-primary bg-white">
            <option value="">चुनें</option>
            {categories.map((c) => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="location" className="block text-sm font-semibold text-ink mb-1.5">स्थान (वैकल्पिक)</label>
        <input id="location" name="location" placeholder="वार्ड / गांव / मोहल्ला" className="w-full rounded-lg border border-line px-4 py-2.5 text-sm focus:border-primary" />
      </div>

      <div>
        <label htmlFor="subject" className="block text-sm font-semibold text-ink mb-1.5">विषय *</label>
        <input id="subject" name="subject" required minLength={5} maxLength={150} className="w-full rounded-lg border border-line px-4 py-2.5 text-sm focus:border-primary" />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-semibold text-ink mb-1.5">विस्तृत विवरण *</label>
        <textarea id="description" name="description" required minLength={10} maxLength={3000} rows={5} className="w-full rounded-lg border border-line px-4 py-2.5 text-sm focus:border-primary" />
      </div>

      {status === "error" && (
        <p role="alert" className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-4 py-2.5">
          {errorMsg}
        </p>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="w-full sm:w-auto flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark disabled:opacity-60 text-white font-semibold px-8 py-3 rounded-full transition-colors"
      >
        {status === "submitting" && <Loader2 className="animate-spin" size={18} />}
        शिकायत दर्ज करें
      </button>

      <p className="text-xs text-muted">
        आपकी व्यक्तिगत जानकारी केवल शिकायत के समाधान हेतु उपयोग की जाएगी और सार्वजनिक रूप से प्रकाशित नहीं की जाएगी।
      </p>
    </form>
  );
}
