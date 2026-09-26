import { useState } from "react";
import api from "../api/axios.js";
import toast from "react-hot-toast";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error("Please fill in Name, Email and Message");
      return;
    }

    setLoading(true);
    try {
      await api.post("/contact", form);
      toast.success("Your message has been sent to our team! We will email you back shortly. 📬", {
        duration: 4000,
      });
      setForm({ name: "", email: "", phone: "", message: "" });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50/70 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Page Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-extrabold uppercase tracking-wider text-brand-600">
            We're Here For You
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-display">
            Contact & Support
          </h1>
          <p className="text-slate-500 text-sm">
            Have questions about your organic vegetable delivery or need bulk farm orders? Drop us a message or chat with us on WhatsApp.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Contact Details & Info Card */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-gradient-to-br from-brand-900 to-emerald-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
              <h2 className="text-xl font-extrabold font-display">Store Information</h2>

              <div className="space-y-4 text-xs sm:text-sm text-brand-100">
                <div className="flex items-start gap-3">
                  <span className="text-xl mt-0.5">📍</span>
                  <div>
                    <strong className="text-white block">Main Organic Hub & Farm:</strong>
                    <span>12 Fresh Farm Road, Green Agro Valley, Chennai, Tamil Nadu - 600001</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="text-xl mt-0.5">📞</span>
                  <div>
                    <strong className="text-white block">Helpline / WhatsApp:</strong>
                    <span>+91 98765 43210</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="text-xl mt-0.5">✉️</span>
                  <div>
                    <strong className="text-white block">Email Support:</strong>
                    <span>nanthakumar2006geetha02@gmail.com</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="text-xl mt-0.5">⏰</span>
                  <div>
                    <strong className="text-white block">Operating Hours:</strong>
                    <span>6:00 AM – 10:00 PM (Everyday including weekends)</span>
                  </div>
                </div>
              </div>

              {/* WhatsApp Chat Button */}
              <a
                href="https://wa.me/919876543210"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-sm rounded-2xl flex items-center justify-center gap-2 shadow-lg transition-transform hover:scale-[1.02] active:scale-95"
              >
                <span>💬 Chat on WhatsApp</span>
              </a>
            </div>

            {/* Quality Promise Card */}
            <div className="bg-white rounded-3xl p-6 shadow-card border border-slate-100 space-y-3">
              <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                <span>🌱</span> 100% Quality Replacement Promise
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                If you ever receive vegetables or fruits that are not up to your standard of freshness, let us know within 2 hours for instant refund or free replacement.
              </p>
            </div>
          </div>

          {/* Contact Message Form */}
          <div className="lg:col-span-7">
            <form
              onSubmit={handleSubmit}
              className="bg-white rounded-3xl p-6 sm:p-10 shadow-card border border-slate-100 space-y-5"
            >
              <div>
                <h2 className="text-xl font-extrabold text-slate-900 font-display">
                  Send Us a Message
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  We usually respond within 15-30 minutes during store hours.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    placeholder="e.g. Rahul Sharma"
                    value={form.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm font-medium"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      placeholder="e.g. rahul@gmail.com"
                      value={form.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Phone Number (Optional)
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      placeholder="e.g. 9876543210"
                      value={form.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Your Message / Inquiry *
                  </label>
                  <textarea
                    name="message"
                    rows={5}
                    placeholder="Write your question, feedback, or delivery inquiry here..."
                    value={form.message}
                    onChange={handleChange}
                    required
                    className="w-full p-4 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm font-medium"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-gradient-to-r from-brand-600 to-emerald-600 hover:from-brand-700 hover:to-emerald-700 text-white font-extrabold text-sm rounded-2xl shadow-glow transition-all disabled:opacity-50"
              >
                {loading ? "Sending your message..." : "Send Message to Store 🚀"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
