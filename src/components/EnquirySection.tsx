import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useData } from '../context/DataContext';
import { Phone, Mail, CheckCircle2, Sparkles, Send } from 'lucide-react';
import { WhatsAppIcon } from './WhatsAppIcon';

const TARGET_EMAIL = 'thegridbycastillo@gmail.com';

export const EnquirySection: React.FC = () => {
  const { siteConfig, spaces, addEnquiry } = useData();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    spaceType: spaces[0]?.name || 'Hot desk / co-working space',
    seatsNeeded: '1 seat',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);

  // Generate mailto link with customer details pre-filled to thegridbycastillo@gmail.com
  const emailSubject = `Workspace Enquiry: ${formData.spaceType} (${formData.seatsNeeded}) - ${formData.name || 'New Client'}`;
  const emailBody = [
    `Hello Team THE GRID,`,
    ``,
    `I would like to enquire about workspace availability at THE GRID Coworking (Hilite Business Park, Calicut).`,
    ``,
    `Here are my details:`,
    `• Full Name: ${formData.name || 'Not provided'}`,
    `• Phone / WhatsApp: ${formData.phone || 'Not provided'}`,
    formData.email ? `• My Email: ${formData.email}` : null,
    `• Workspace Required: ${formData.spaceType}`,
    `• Number of Seats: ${formData.seatsNeeded}`,
    formData.message ? `• Additional Notes: ${formData.message}` : null,
    ``,
    `Please reply with pricing, move-in availability, and walkthrough schedule.`,
    ``,
    `Best regards,`,
    formData.name || 'A prospective member',
  ]
    .filter(Boolean)
    .join('\n');

  const customerMailtoUrl = `mailto:${TARGET_EMAIL}?subject=${encodeURIComponent(
    emailSubject
  )}&body=${encodeURIComponent(emailBody)}`;

  const whatsappDirectUrl = `https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(
    `Hi, I'm ${formData.name || 'interested'} and looking for ${formData.spaceType} (${formData.seatsNeeded}) at THE GRID Calicut.`
  )}`;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phone.trim()) return;

    // 1. Record lead in the local CMS Admin Portal
    addEnquiry({
      name: formData.name.trim(),
      phone: formData.phone.trim(),
      email: formData.email.trim(),
      spaceType: formData.spaceType,
      seatsNeeded: formData.seatsNeeded,
      message: formData.message.trim(),
    });

    // 2. Automatically launch the customer's personal email client (Gmail, Apple Mail, Outlook)
    window.location.href = customerMailtoUrl;

    // 3. Display confirmation screen
    setSubmitted(true);
  };

  return (
    <section id="enquiry" className="py-20 sm:py-28 lg:py-32 bg-[#F6F5FA] relative">
      <div className="w-full px-6 sm:px-10 lg:px-16 xl:px-24">
        
        <div className="max-w-3xl mx-auto">
          
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="text-center mb-10"
          >
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EFF0A3] border border-[#DFE094] text-[11px] font-bold uppercase tracking-wider text-[#212121] mb-3">
              <Sparkles className="w-3 h-3 text-[#212121]" />
              Direct Booking & Same-Day Confirmation
            </div>
            
            <h2 className="font-['Oxygen'] text-3xl sm:text-5xl font-bold uppercase tracking-tight text-[#212121] mb-3">
              YOUR DESK IS READY IN CALICUT.
            </h2>
            
            <p className="text-zinc-600 text-sm max-w-lg mx-auto">
              Tell us how many seats you need and for how long — we'll confirm availability the same day.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.5, delay: 0.1, ease: 'easeOut' }}
            className="bg-white rounded-2xl border border-[#D8DFE9] p-8 sm:p-10 shadow-xs"
          >
            {submitted ? (
              <div className="text-center py-8 space-y-4">
                <div className="w-14 h-14 rounded-full bg-[#CFDECA]/50 border border-[#CFDECA] flex items-center justify-center mx-auto text-[#212121]">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h3 className="font-['Oxygen'] text-2xl uppercase text-[#212121] font-bold">
                  Enquiry Received
                </h3>
                <p className="text-xs sm:text-sm text-zinc-600 max-w-md mx-auto">
                  Thank you, <span className="font-bold text-[#212121]">{formData.name}</span>! Our floor team at Hilite Business Park will confirm availability and get in touch with you shortly.
                </p>
                <div className="pt-4 flex flex-wrap justify-center gap-3">
                  <a
                    href={whatsappDirectUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#CFDECA] text-[#212121] font-bold text-xs shadow-xs hover:bg-[#b8cbb3]"
                  >
                    <WhatsAppIcon className="w-4 h-4" />
                    <span>Chat on WhatsApp</span>
                  </a>
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({
                        name: '',
                        phone: '',
                        email: '',
                        spaceType: spaces[0]?.name || 'Hot desk',
                        seatsNeeded: '1 seat',
                        message: '',
                      });
                    }}
                    className="px-5 py-2.5 rounded-full bg-[#F6F5FA] border border-[#D8DFE9] text-xs font-semibold text-[#212121] hover:bg-white cursor-pointer"
                  >
                    Submit Another Request
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Name */}
                  <div>
                    <label className="block text-[11px] font-bold uppercase text-zinc-500 tracking-wider mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rahul Nair"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-[#F6F5FA] focus:bg-white border border-[#D8DFE9] focus:border-[#212121] rounded-xl px-4 py-3 text-xs text-[#212121] outline-none transition-all"
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-[11px] font-bold uppercase text-zinc-500 tracking-wider mb-2">
                      Phone / WhatsApp Number *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98765 43210"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full bg-[#F6F5FA] focus:bg-white border border-[#D8DFE9] focus:border-[#212121] rounded-xl px-4 py-3 text-xs text-[#212121] outline-none transition-all"
                    />
                  </div>

                  {/* Customer Email */}
                  <div>
                    <label className="block text-[11px] font-bold uppercase text-zinc-500 tracking-wider mb-2">
                      Your Email (Optional)
                    </label>
                    <input
                      type="email"
                      placeholder="you@company.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-[#F6F5FA] focus:bg-white border border-[#D8DFE9] focus:border-[#212121] rounded-xl px-4 py-3 text-xs text-[#212121] outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Space Selection */}
                  <div>
                    <label className="block text-[11px] font-bold uppercase text-zinc-500 tracking-wider mb-2">
                      Workspace Requirement
                    </label>
                    <select
                      value={formData.spaceType}
                      onChange={(e) => setFormData({ ...formData, spaceType: e.target.value })}
                      className="w-full bg-[#F6F5FA] focus:bg-white border border-[#D8DFE9] focus:border-[#212121] rounded-xl px-4 py-3 text-xs text-[#212121] outline-none transition-all"
                    >
                      {spaces.map((sp) => (
                        <option key={sp.id} value={sp.name}>
                          {sp.name} ({sp.price})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Capacity */}
                  <div>
                    <label className="block text-[11px] font-bold uppercase text-zinc-500 tracking-wider mb-2">
                      Number of Seats
                    </label>
                    <select
                      value={formData.seatsNeeded}
                      onChange={(e) => setFormData({ ...formData, seatsNeeded: e.target.value })}
                      className="w-full bg-[#F6F5FA] focus:bg-white border border-[#D8DFE9] focus:border-[#212121] rounded-xl px-4 py-3 text-xs text-[#212121] outline-none transition-all"
                    >
                      <option value="1 seat">1 seat (Solo / Freelancer)</option>
                      <option value="2-4 seats">2 to 4 seats (Small Team)</option>
                      <option value="5-10 seats">5 to 10 seats (Private Cabin)</option>
                      <option value="10-24 seats">10 to 24 seats (Managed Office)</option>
                      <option value="Virtual Office Only">Virtual Office Only (₹999/mo)</option>
                    </select>
                  </div>
                </div>

                {/* Optional Message */}
                <div>
                  <label className="block text-[11px] font-bold uppercase text-zinc-500 tracking-wider mb-2">
                    Additional Notes (Optional)
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Preferred move-in date, timing, team specifications..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full bg-[#F6F5FA] focus:bg-white border border-[#D8DFE9] focus:border-[#212121] rounded-xl px-4 py-3 text-xs text-[#212121] outline-none transition-all resize-none"
                  />
                </div>

                {/* Form CTA Buttons */}
                <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="w-full sm:flex-1 flex items-center justify-center gap-2 py-3.5 px-6 rounded-full bg-[#212121] hover:bg-[#333333] text-white text-xs font-bold transition-colors shadow-xs cursor-pointer"
                  >
                    <Mail className="w-3.5 h-3.5 text-[#EFF0A3]" />
                    <span>Send by Email</span>
                  </motion.button>

                  <motion.a
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    href={whatsappDirectUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto flex items-center justify-center gap-2 py-3.5 px-6 rounded-full bg-[#CFDECA] hover:bg-[#b8cbb3] text-[#212121] text-xs font-bold transition-colors shadow-xs"
                  >
                    <WhatsAppIcon className="w-3.5 h-3.5 text-[#212121]" />
                    <span>Instant WhatsApp</span>
                  </motion.a>
                </div>
              </form>
            )}
          </motion.div>

          {/* Quick Telephone Callout in Honeydew #CFDECA */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: 0.2 }}
            className="mt-6 p-4 rounded-xl bg-[#CFDECA]/30 border border-[#CFDECA] flex items-center justify-between"
          >
            <div className="flex items-center gap-2.5">
              <Phone className="w-4 h-4 text-[#212121]" />
              <span className="text-xs text-[#212121] font-semibold">
                Prefer to speak directly to the floor manager?
              </span>
            </div>
            <a
              href={`tel:${siteConfig.phone}`}
              className="text-xs font-extrabold text-[#212121] hover:underline"
            >
              {siteConfig.phoneFormatted}
            </a>
          </motion.div>

        </div>

      </div>
    </section>
  );
};
