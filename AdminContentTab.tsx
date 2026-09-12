import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { DEFAULT_SITE_CONFIG } from '../../data/defaultContent';
import { Save, Check, RotateCcw, Bell, ArrowUpRight } from 'lucide-react';

export const AdminContentTab: React.FC = () => {
  const { siteConfig, updateSiteConfig, resetToDefaults, showToast } = useData();
  const [formData, setFormData] = useState({
    ...siteConfig,
    promoPopup: siteConfig.promoPopup || DEFAULT_SITE_CONFIG.promoPopup,
  });
  const [newPoint, setNewPoint] = useState('');
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const handleChange = (key: keyof typeof formData, value: any) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handlePromoChange = (key: keyof typeof formData.promoPopup, value: any) => {
    setFormData((prev) => ({
      ...prev,
      promoPopup: {
        ...prev.promoPopup,
        [key]: value,
      },
    }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSiteConfig(formData);
    showToast('Saved all site settings and floor update pop-up');
  };

  const handleReset = () => {
    resetToDefaults();
    setShowResetConfirm(false);
    setFormData(DEFAULT_SITE_CONFIG);
  };

  const handleAddBenefit = () => {
    if (!newPoint.trim()) return;
    setFormData((prev) => ({
      ...prev,
      whyCoworkingPoints: [...prev.whyCoworkingPoints, newPoint.trim()],
      whyCoworkingDescriptions: [
        ...(prev.whyCoworkingDescriptions || []),
        '',
      ],
    }));
    setNewPoint('');
  };

  const handleRemoveBenefit = (idx: number) => {
    setFormData((prev) => ({
      ...prev,
      whyCoworkingPoints: prev.whyCoworkingPoints.filter((_, i) => i !== idx),
      whyCoworkingDescriptions: (prev.whyCoworkingDescriptions || []).filter((_, i) => i !== idx),
    }));
  };

  return (
    <form onSubmit={handleSave} className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#D8DFE9]">
        <div>
          <h3 className="text-lg font-bold text-[#212121] font-['Oxygen'] uppercase tracking-wide">
            Site Copy, Pop-up & Contact Info
          </h3>
          <p className="text-xs text-zinc-500">
            Edit headlines, promo pop-ups, phone numbers, WhatsApp templates, and floor notices dynamically.
          </p>
        </div>

        <button
          type="submit"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#212121] hover:bg-[#333333] text-white text-xs font-bold transition-all shadow-xs cursor-pointer active:scale-95"
        >
          <Save className="w-4 h-4 text-[#EFF0A3]" />
          <span>Save All Settings</span>
        </button>
      </div>

      {/* Floor Update Notification Pop-up (Floater) */}
      <div className="p-6 rounded-2xl bg-[#F6F5FA] border border-[#D8DFE9] space-y-5 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#D8DFE9]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#212121] flex items-center justify-center text-[#EFF0A3] shadow-xs">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-['Oxygen'] font-bold text-sm text-[#212121] uppercase tracking-wider flex items-center gap-2">
                <span>Floor Update Notification Pop-up</span>
                <span
                  className={`text-[10px] px-2.5 py-0.5 rounded-full font-sans font-bold uppercase tracking-wider ${
                    formData.promoPopup?.enabled
                      ? 'bg-[#CFDECA] text-[#212121] border border-[#b8cbb3]'
                      : 'bg-zinc-200 text-zinc-600 border border-zinc-300'
                  }`}
                >
                  {formData.promoPopup?.enabled ? 'Active on site' : 'Hidden / Off'}
                </span>
              </h4>
              <p className="text-xs text-zinc-500">
                Floating card at bottom-right corner for immediate availability, move-in deals, or walk-ins.
              </p>
            </div>
          </div>

          <label className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-[#D8DFE9] text-xs font-bold text-[#212121] cursor-pointer shadow-2xs hover:bg-zinc-50 transition-colors">
            <input
              type="checkbox"
              checked={formData.promoPopup?.enabled ?? true}
              onChange={(e) => handlePromoChange('enabled', e.target.checked)}
              className="w-4 h-4 rounded accent-[#212121]"
            />
            <span>Enable Pop-up</span>
          </label>
        </div>

        {/* Live Mini Preview & Form Fields Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Form Fields (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-zinc-500 uppercase mb-1">
                  Tag / Category Eyebrow
                </label>
                <input
                  type="text"
                  value={formData.promoPopup?.tag ?? ''}
                  onChange={(e) => handlePromoChange('tag', e.target.value)}
                  placeholder="e.g. FLOOR UPDATE · HILITE PHASE 2"
                  className="w-full bg-white border border-[#D8DFE9] rounded-xl px-3 py-2 text-xs text-[#212121] focus:outline-none focus:border-[#212121]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-zinc-500 uppercase mb-1">
                  Floor / Location Label
                </label>
                <input
                  type="text"
                  value={formData.promoPopup?.floorLocation ?? ''}
                  onChange={(e) => handlePromoChange('floorLocation', e.target.value)}
                  placeholder="e.g. 1st Floor"
                  className="w-full bg-white border border-[#D8DFE9] rounded-xl px-3 py-2 text-xs text-[#212121] focus:outline-none focus:border-[#212121]"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-zinc-500 uppercase mb-1">
                Pop-up Headline / Title *
              </label>
              <input
                type="text"
                value={formData.promoPopup?.headline ?? ''}
                onChange={(e) => handlePromoChange('headline', e.target.value)}
                placeholder="e.g. 4-SEATER CABIN JUST OPENED"
                className="w-full bg-white border border-[#D8DFE9] rounded-xl px-3 py-2 text-xs text-[#212121] font-bold focus:outline-none focus:border-[#212121]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-zinc-500 uppercase mb-1">
                Description / Body Message
              </label>
              <textarea
                rows={2}
                value={formData.promoPopup?.description ?? ''}
                onChange={(e) => handlePromoChange('description', e.target.value)}
                placeholder="e.g. Immediate move-in available on 1st Floor. Plug-and-play with dedicated AC & fiber WiFi."
                className="w-full bg-white border border-[#D8DFE9] rounded-xl px-3 py-2 text-xs text-[#212121] focus:outline-none focus:border-[#212121]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-zinc-500 uppercase mb-1">
                  CTA Action Link Text
                </label>
                <input
                  type="text"
                  value={formData.promoPopup?.ctaText ?? ''}
                  onChange={(e) => handlePromoChange('ctaText', e.target.value)}
                  placeholder="e.g. Ask for floor walkthrough"
                  className="w-full bg-white border border-[#D8DFE9] rounded-xl px-3 py-2 text-xs text-[#212121] focus:outline-none focus:border-[#212121]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-zinc-500 uppercase mb-1">
                  Pre-filled WhatsApp Message
                </label>
                <input
                  type="text"
                  value={formData.promoPopup?.whatsappMessage ?? ''}
                  onChange={(e) => handlePromoChange('whatsappMessage', e.target.value)}
                  placeholder="e.g. Hi, I saw the 4-seater cabin update..."
                  className="w-full bg-white border border-[#D8DFE9] rounded-xl px-3 py-2 text-xs text-[#212121] focus:outline-none focus:border-[#212121]"
                />
              </div>
            </div>
          </div>

          {/* Right Live Preview Box (5 cols) */}
          <div className="lg:col-span-5 bg-white p-4 sm:p-5 rounded-2xl border border-[#D8DFE9] shadow-xs">
            <div className="flex items-center justify-between mb-3 text-xs text-zinc-500 font-bold uppercase tracking-wider">
              <span>Live Visual Preview</span>
              <span className="text-[10px] text-zinc-400 font-normal">Auto-updates</span>
            </div>

            {/* Render preview card mimicking actual component */}
            <div className="bg-[#212121] text-white p-4 rounded-2xl border border-zinc-700 shadow-xl relative flex flex-col justify-between">
              <div className="absolute top-3 right-3 p-1 text-zinc-500">
                <span className="text-[10px] font-bold">✕</span>
              </div>

              <div>
                {formData.promoPopup?.tag && (
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#CFDECA] animate-ping" />
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#EFF0A3]">
                      {formData.promoPopup.tag}
                    </span>
                  </div>
                )}

                <h4 className="font-['Oxygen'] text-sm font-bold uppercase tracking-tight text-white pr-4">
                  {formData.promoPopup?.headline || 'Notification Headline'}
                </h4>

                {formData.promoPopup?.description && (
                  <p className="text-[11px] text-zinc-300 leading-snug mt-1">
                    {formData.promoPopup.description}
                  </p>
                )}
              </div>

              <div className="mt-3 pt-2 border-t border-dotted border-zinc-700 flex items-center justify-between">
                <div className="text-[11px] font-bold text-[#EFF0A3] flex items-center gap-1">
                  <span>{formData.promoPopup?.ctaText || 'Ask for floor walkthrough'}</span>
                  <ArrowUpRight className="w-3 h-3" />
                </div>
                {formData.promoPopup?.floorLocation && (
                  <span className="text-[10px] text-zinc-400">{formData.promoPopup.floorLocation}</span>
                )}
              </div>
            </div>

            {!formData.promoPopup?.enabled && (
              <div className="mt-3 p-2.5 bg-amber-50 border border-amber-200 rounded-xl text-[11px] text-amber-800 text-center font-medium">
                Pop-up is currently disabled and won't appear on the live site.
              </div>
            )}
          </div>

        </div>
      </div>

      {/* Announcement Banner */}
      <div className="p-5 rounded-2xl bg-[#F6F5FA] border border-[#D8DFE9] space-y-3 shadow-2xs">
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 text-xs font-bold text-[#212121] uppercase tracking-wider cursor-pointer">
            <input
              type="checkbox"
              checked={formData.bannerEnabled}
              onChange={(e) => handleChange('bannerEnabled', e.target.checked)}
              className="w-4 h-4 rounded accent-[#212121]"
            />
            <span>Top Announcement Banner</span>
          </label>
          <span className="text-[11px] text-zinc-500">Shows at the very top of every page</span>
        </div>

        <input
          type="text"
          value={formData.bannerText}
          onChange={(e) => handleChange('bannerText', e.target.value)}
          placeholder="e.g. Desks & Private Cabins available for immediate walk-in on 1st Floor, Hilite Business Park!"
          className="w-full bg-white border border-[#D8DFE9] rounded-xl px-3 py-2 text-xs text-[#212121] focus:outline-none focus:border-[#212121]"
        />
      </div>

      {/* Hero Section Copy */}
      <div className="p-5 rounded-2xl bg-[#F6F5FA] border border-[#D8DFE9] space-y-4 shadow-2xs">
        <h4 className="font-['Oxygen'] font-bold text-sm text-[#212121] uppercase tracking-wider">
          Hero Section Copy
        </h4>

        <div>
          <label className="block text-[11px] font-bold text-zinc-500 uppercase mb-1">
            Main Hero Headline (H1)
          </label>
          <input
            type="text"
            value={formData.heroHeadline}
            onChange={(e) => handleChange('heroHeadline', e.target.value)}
            className="w-full bg-white border border-[#D8DFE9] rounded-xl px-3 py-2 text-xs text-[#212121] focus:outline-none focus:border-[#212121]"
          />
        </div>

        <div>
          <label className="block text-[11px] font-bold text-zinc-500 uppercase mb-1">
            Hero Subhead Description
          </label>
          <textarea
            rows={2}
            value={formData.heroSubhead}
            onChange={(e) => handleChange('heroSubhead', e.target.value)}
            className="w-full bg-white border border-[#D8DFE9] rounded-xl px-3 py-2 text-xs text-[#212121] focus:outline-none focus:border-[#212121]"
          />
        </div>
      </div>

      {/* Contact & WhatsApp Integration */}
      <div className="p-5 rounded-2xl bg-[#F6F5FA] border border-[#D8DFE9] space-y-4 shadow-2xs">
        <h4 className="font-['Oxygen'] font-bold text-sm text-[#212121] uppercase tracking-wider">
          Contact Numbers & WhatsApp Direct
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[11px] font-bold text-zinc-500 uppercase mb-1">
              Phone Number (Digits for tel: links) *
            </label>
            <input
              type="text"
              value={formData.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              className="w-full bg-white border border-[#D8DFE9] rounded-xl px-3 py-2 text-xs text-[#212121] focus:outline-none focus:border-[#212121]"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-zinc-500 uppercase mb-1">
              Display Phone Formatted
            </label>
            <input
              type="text"
              value={formData.phoneFormatted}
              onChange={(e) => handleChange('phoneFormatted', e.target.value)}
              className="w-full bg-white border border-[#D8DFE9] rounded-xl px-3 py-2 text-xs text-[#212121] focus:outline-none focus:border-[#212121]"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-zinc-500 uppercase mb-1">
              WhatsApp Number (with country code 91) *
            </label>
            <input
              type="text"
              value={formData.whatsappNumber}
              onChange={(e) => handleChange('whatsappNumber', e.target.value)}
              className="w-full bg-white border border-[#D8DFE9] rounded-xl px-3 py-2 text-xs text-[#212121] focus:outline-none focus:border-[#212121]"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-zinc-500 uppercase mb-1">
              Official Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              className="w-full bg-white border border-[#D8DFE9] rounded-xl px-3 py-2 text-xs text-[#212121] focus:outline-none focus:border-[#212121]"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-zinc-500 uppercase mb-1">
              Instagram Handle
            </label>
            <input
              type="text"
              value={formData.instagram}
              onChange={(e) => handleChange('instagram', e.target.value)}
              className="w-full bg-white border border-[#D8DFE9] rounded-xl px-3 py-2 text-xs text-[#212121] focus:outline-none focus:border-[#212121]"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-zinc-500 uppercase mb-1">
              Instagram Link URL
            </label>
            <input
              type="text"
              value={formData.instagramUrl}
              onChange={(e) => handleChange('instagramUrl', e.target.value)}
              className="w-full bg-white border border-[#D8DFE9] rounded-xl px-3 py-2 text-xs text-[#212121] focus:outline-none focus:border-[#212121]"
            />
          </div>
        </div>
      </div>

      {/* Address & Accessibility */}
      <div className="p-5 rounded-2xl bg-[#F6F5FA] border border-[#D8DFE9] space-y-4 shadow-2xs">
        <h4 className="font-['Oxygen'] font-bold text-sm text-[#212121] uppercase tracking-wider">
          Address & Floor Accessibility Copy
        </h4>

        <div>
          <label className="block text-[11px] font-bold text-zinc-500 uppercase mb-1">
            Display Address
          </label>
          <input
            type="text"
            value={formData.address}
            onChange={(e) => handleChange('address', e.target.value)}
            className="w-full bg-white border border-[#D8DFE9] rounded-xl px-3 py-2 text-xs text-[#212121] focus:outline-none focus:border-[#212121]"
          />
        </div>

        <div>
          <label className="block text-[11px] font-bold text-zinc-500 uppercase mb-1">
            "No Stairs, No Stress" Floor Accessibility Notice
          </label>
          <textarea
            rows={2}
            value={formData.floorNotice}
            onChange={(e) => handleChange('floorNotice', e.target.value)}
            className="w-full bg-white border border-[#D8DFE9] rounded-xl px-3 py-2 text-xs text-[#212121] focus:outline-none focus:border-[#212121]"
          />
        </div>
      </div>

      {/* Why Coworking Works Points */}
      <div className="p-5 rounded-2xl bg-[#F6F5FA] border border-[#D8DFE9] space-y-4 shadow-2xs">
        <h4 className="font-['Oxygen'] font-bold text-sm text-[#212121] uppercase tracking-wider">
          "Why Coworking Works" Benefits List
        </h4>

        <div className="space-y-3">
          {formData.whyCoworkingPoints.map((point, idx) => (
            <div key={idx} className="p-3 bg-white border border-[#D8DFE9] rounded-xl space-y-2 shadow-2xs">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-zinc-400">0{idx + 1}</span>
                <input
                  type="text"
                  placeholder="Benefit title..."
                  value={point}
                  onChange={(e) => {
                    const updated = [...formData.whyCoworkingPoints];
                    updated[idx] = e.target.value;
                    setFormData({ ...formData, whyCoworkingPoints: updated });
                  }}
                  className="flex-1 bg-zinc-50 border border-[#D8DFE9] rounded-lg px-2.5 py-1.5 text-xs text-[#212121] font-semibold focus:outline-none focus:border-[#212121]"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveBenefit(idx)}
                  className="p-1.5 text-zinc-400 hover:text-rose-600 cursor-pointer"
                  title="Remove benefit"
                >
                  ✕
                </button>
              </div>
              <textarea
                rows={2}
                placeholder="Benefit description / body text..."
                value={(formData.whyCoworkingDescriptions && formData.whyCoworkingDescriptions[idx]) || ''}
                onChange={(e) => {
                  const updatedDescs = [...(formData.whyCoworkingDescriptions || [])];
                  updatedDescs[idx] = e.target.value;
                  setFormData({ ...formData, whyCoworkingDescriptions: updatedDescs });
                }}
                className="w-full bg-zinc-50 border border-[#D8DFE9] rounded-lg px-2.5 py-1.5 text-xs text-zinc-600 focus:outline-none focus:border-[#212121]"
              />
            </div>
          ))}
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Add new benefit point..."
            value={newPoint}
            onChange={(e) => setNewPoint(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAddBenefit();
              }
            }}
            className="flex-1 bg-white border border-[#D8DFE9] rounded-xl px-3 py-2 text-xs text-[#212121] focus:outline-none focus:border-[#212121]"
          />
          <button
            type="button"
            onClick={handleAddBenefit}
            className="px-4 py-2 bg-[#212121] hover:bg-[#333333] text-white rounded-full text-xs font-semibold cursor-pointer"
          >
            Add
          </button>
        </div>
      </div>

      {/* Submit Bar */}
      <div className="flex items-center justify-between pt-4 border-t border-[#D8DFE9]">
        {showResetConfirm ? (
          <div className="inline-flex items-center gap-2 bg-rose-50 border border-rose-200 px-3 py-1.5 rounded-full animate-in fade-in duration-150">
            <span className="text-xs font-semibold text-rose-700">Restore all defaults?</span>
            <button
              type="button"
              onClick={handleReset}
              className="px-3 py-1 rounded-full bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-colors cursor-pointer shadow-2xs"
            >
              Confirm Reset
            </button>
            <button
              type="button"
              onClick={() => setShowResetConfirm(false)}
              className="px-3 py-1 rounded-full bg-white hover:bg-zinc-100 text-zinc-600 text-xs font-medium border border-zinc-200 transition-colors cursor-pointer"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setShowResetConfirm(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white border border-[#D8DFE9] hover:bg-rose-50 text-zinc-600 hover:text-rose-600 text-xs font-semibold transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Restore Castillo Defaults</span>
          </button>
        )}

        <button
          type="submit"
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#212121] hover:bg-[#333333] text-white text-xs font-bold transition-all shadow-xs cursor-pointer active:scale-95"
        >
          <Check className="w-4 h-4 text-[#EFF0A3]" />
          <span>Save Changes</span>
        </button>
      </div>
    </form>
  );
};
