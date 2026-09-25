"use client";

import { useState, FormEvent } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import { apiPost } from "@/lib/api";

type Status = "idle" | "submitting" | "success" | "error";

export default function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    const form = new FormData(e.currentTarget);
    const payload = {
      name: String(form.get("name") || ""),
      email: String(form.get("email") || ""),
      phone: String(form.get("phone") || ""),
      subject: String(form.get("subject") || ""),
      message: String(form.get("message") || ""),
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
      <div className="bg-primary-light border border-primary/20 rounded-2xl p-8 text-center">
        <CheckCircle2 className="mx-auto text-primary" size={40} />
        <h2 className="font-display text-lg font-bold text-ink mt-3">आपका संदेश भेज दिया गया है</h2>
        <p className="text-muted text-sm mt-1">हम शीघ्र ही आपसे संपर्क करेंगे।</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-line rounded-2xl p-6 md:p-8 space-y-5">
      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="c-name" className="block text-sm font-semibold text-ink mb-1.5">नाम *</label>
          <input id="c-name" name="name" required minLength={2} className="w-full rounded-lg border border-line px-4 py-2.5 text-sm focus:border-primary" />
        </div>
        <div>
          <label htmlFor="c-phone" className="block text-sm font-semibold text-ink mb-1.5">फोन (वैकल्पिक)</label>
          <input id="c-phone" name="phone" className="w-full rounded-lg border border-line px-4 py-2.5 text-sm focus:border-primary" />
        </div>
      </div>
      <div>
        <label htmlFor="c-email" className="block text-sm font-semibold text-ink mb-1.5">ईमेल (वैकल्पिक)</label>
        <input id="c-email" name="email" type="email" className="w-full rounded-lg border border-line px-4 py-2.5 text-sm focus:border-primary" />
      </div>
      <div>
        <label htmlFor="c-subject" className="block text-sm font-semibold text-ink mb-1.5">विषय</label>
        <input id="c-subject" name="subject" className="w-full rounded-lg border border-line px-4 py-2.5 text-sm focus:border-primary" />
      </div>
      <div>
        <label htmlFor="c-message" className="block text-sm font-semibold text-ink mb-1.5">संदेश *</label>
        <textarea id="c-message" name="message" required minLength={10} rows={5} className="w-full rounded-lg border border-line px-4 py-2.5 text-sm focus:border-primary" />
      </div>

      {status === "error" && (
        <p role="alert" className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-4 py-2.5">{errorMsg}</p>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="w-full sm:w-auto flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark disabled:opacity-60 text-white font-semibold px-8 py-3 rounded-full"
      >
        {status === "submitting" && <Loader2 className="animate-spin" size={18} />}
        संदेश भेजें
      </button>
    </form>
  );
}
