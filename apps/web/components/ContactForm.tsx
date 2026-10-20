"use client";

import { useState, FormEvent } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import { apiPost } from "@/lib/api";

type Status = "idle" | "submitting" | "success" | "error";

const inputClass =
  "w-full rounded-lg border border-line bg-white px-4 py-3 text-sm text-ink focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary";

const labelClass =
  "mb-1.5 block text-sm font-semibold text-ink";

export default function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setErrorMsg("");

    const form = new FormData(e.currentTarget);

    const firstName = String(form.get("firstName") || "").trim();
    const lastName = String(form.get("lastName") || "").trim();
    const phone = String(form.get("phone") || "").trim();
    const gender = String(form.get("gender") || "");
    const age = String(form.get("age") || "");
    const address = String(form.get("address") || "").trim();
    const village = String(form.get("village") || "").trim();
    const tehsil = String(form.get("tehsil") || "").trim();
    const district = String(form.get("district") || "").trim();

    // Keep the existing backend payload structure.
    const payload = {
      name: `${firstName} ${lastName}`.trim(),
      email: "",
      phone,
      subject: "संपर्क फॉर्म",
      message: [
        `पहला नाम: ${firstName}`,
        `आख़िरी नाम: ${lastName}`,
        `फ़ोन नंबर: ${phone}`,
        `लिंग: ${gender}`,
        `आयु: ${age}`,
        `पता: ${address}`,
        `गाँव: ${village}`,
        `तहसील: ${tehsil}`,
        `ज़िला: ${district}`,
      ].join("\n"),
    };

    try {
      const res = await apiPost("/api/contact", payload);

      if (res.success) {
        setStatus("success");
      } else {
        setErrorMsg(res.message || "कुछ गलत हो गया।");
        setStatus("error");
      }
    } catch {
      setErrorMsg("सर्वर से संपर्क नहीं हो सका।");
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-2xl border border-primary/20 bg-primary-light p-8 text-center">
        <CheckCircle2 className="mx-auto text-primary" size={40} />
        <h2 className="mt-3 font-display text-lg font-bold text-ink">
          आपकी जानकारी भेज दी गई है
        </h2>
        <p className="mt-1 text-sm text-muted">
          कार्यालय की टीम शीघ्र ही आपसे संपर्क करेगी।
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 rounded-2xl border border-line bg-white p-6 md:p-8"
    >
      <div>
        <h2 className="font-display text-xl font-bold text-ink">
          अपनी जानकारी भरें
        </h2>
        <p className="mt-1 text-sm text-muted">
          कृपया नीचे दी गई जानकारी सही-सही भरें।
        </p>
      </div>

      {/* First and last name */}
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="c-firstName" className={labelClass}>
            पहला नाम *
          </label>
          <input
            id="c-firstName"
            name="firstName"
            required
            minLength={2}
            maxLength={50}
            autoComplete="given-name"
            placeholder="अपना पहला नाम लिखें"
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="c-lastName" className={labelClass}>
            आख़िरी नाम *
          </label>
          <input
            id="c-lastName"
            name="lastName"
            required
            minLength={2}
            maxLength={50}
            autoComplete="family-name"
            placeholder="अपना आख़िरी नाम लिखें"
            className={inputClass}
          />
        </div>
      </div>

      {/* Phone and gender */}
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="c-phone" className={labelClass}>
            फ़ोन नंबर *
          </label>
          <input
            id="c-phone"
            name="phone"
            type="tel"
            required
            inputMode="numeric"
            autoComplete="tel"
            pattern="[6-9][0-9]{9}"
            maxLength={10}
            title="10 अंकों का सही मोबाइल नंबर लिखें"
            placeholder="10 अंकों का मोबाइल नंबर"
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="c-gender" className={labelClass}>
            लिंग *
          </label>
          <select
            id="c-gender"
            name="gender"
            required
            defaultValue=""
            className={inputClass}
          >
            <option value="" disabled>
              लिंग चुनें
            </option>
            <option value="पुरुष">पुरुष</option>
            <option value="महिला">महिला</option>                   
          </select>
        </div>
      </div>

      {/* Age */}
      <div>
        <label htmlFor="c-age" className={labelClass}>
          आयु *
        </label>
        <input
          id="c-age"
          name="age"
          type="number"
          required
          min={1}
          max={120}
          inputMode="numeric"
          placeholder="अपनी आयु लिखें"
          className={inputClass}
        />
      </div>

      {/* Address */}
      <div>
        <label htmlFor="c-address" className={labelClass}>
          पूरा पता *
        </label>
        <textarea
          id="c-address"
          name="address"
          required
          minLength={5}
          maxLength={300}
          rows={3}
          autoComplete="street-address"
          placeholder="मोहल्ला, वार्ड या घर का पता लिखें"
          className={inputClass}
        />
      </div>

      {/* Village, tehsil, district */}
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="c-village" className={labelClass}>
            गाँव *
          </label>
          <input
            id="c-village"
            name="village"
            required
            maxLength={100}
            autoComplete="address-level4"
            placeholder="गाँव का नाम"
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="c-tehsil" className={labelClass}>
            तहसील *
          </label>
          <input
            id="c-tehsil"
            name="tehsil"
            required
            maxLength={100}
            placeholder="तहसील का नाम"
            className={inputClass}
          />
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="c-district" className={labelClass}>
            ज़िला *
          </label>
          <input
            id="c-district"
            name="district"
            required
            maxLength={100}
            autoComplete="address-level2"
            placeholder="ज़िले का नाम"
            className={inputClass}
          />
        </div>
      </div>

      {status === "error" && (
        <p
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {errorMsg}
        </p>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="flex w-full items-center justify-center gap-2 rounded-full bg-primary px-8 py-3 font-semibold text-white transition-colors hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
      >
        {status === "submitting" && (
          <Loader2 className="animate-spin" size={18} />
        )}
        {status === "submitting" ? "भेजा जा रहा है..." : "जानकारी भेजें"}
      </button>
    </form>
  );
}