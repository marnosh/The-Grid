import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { SpaceItem } from '../../types';
import { Plus, Trash2, Edit2, Check, X, Eye, Sparkles } from 'lucide-react';

export const AdminSpacesTab: React.FC = () => {
  const { spaces, addSpace, updateSpace, deleteSpace } = useData();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Form state for creating or editing
  const [formData, setFormData] = useState<Omit<SpaceItem, 'id' | 'order'>>({
    name: '',
    price: 'Starting from ₹3,500',
    unit: 'per month',
    badge: 'POPULAR',
    seatsInfo: '1-4 Seats',
    description: '',
    features: ['High-speed WiFi', 'Fully air-conditioned', 'Coffee machine access'],
    isAvailable: true,
    highlightTag: '',
    iconType: 'desk',
    imageUrl: '',
    imageAlt: '',
  });

  const [newFeatureInput, setNewFeatureInput] = useState('');

  const startEdit = (space: SpaceItem) => {
    setEditingId(space.id);
    setIsAddingNew(false);
    setFormData({
      name: space.name,
      price: space.price,
      unit: space.unit,
      badge: space.badge || '',
      seatsInfo: space.seatsInfo || '',
      description: space.description,
      features: [...space.features],
      isAvailable: space.isAvailable,
      highlightTag: space.highlightTag || '',
      iconType: space.iconType,
      imageUrl: space.imageUrl || '',
      imageAlt: space.imageAlt || '',
    });
  };

  const startAddNew = () => {
    setIsAddingNew(true);
    setEditingId(null);
    setFormData({
      name: 'Dedicated Desk',
      price: 'Starting from ₹4,500',
      unit: 'per month',
      badge: 'NEW',
      seatsInfo: '1 Dedicated Seat',
      description: 'Your own fixed desk in our premium quiet corner with personal lockable storage.',
      features: ['Personal storage pedestal', 'High-speed WiFi', '24/7 Access option', 'Free meeting room hours'],
      isAvailable: true,
      highlightTag: 'Fixed Desk',
      iconType: 'desk',
      imageUrl: '',
      imageAlt: '',
    });
  };

  const handleSave = () => {
    if (!formData.name.trim() || !formData.price.trim()) return;

    if (editingId) {
      updateSpace(editingId, formData);
      setEditingId(null);
    } else if (isAddingNew) {
      addSpace(formData);
      setIsAddingNew(false);
    }
  };

  const handleAddFeature = () => {
    if (!newFeatureInput.trim()) return;
    setFormData((prev) => ({
      ...prev,
      features: [...prev.features, newFeatureInput.trim()],
    }));
    setNewFeatureInput('');
  };

  const handleRemoveFeature = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index),
    }));
  };

  return (
    <div className="space-y-8">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#D8DFE9]">
        <div>
          <h3 className="text-lg font-bold text-[#212121] font-['Oxygen'] uppercase tracking-wide">
            Manage Workspaces & Pricing
          </h3>
          <p className="text-xs text-zinc-500">
            Update pricing, seat tiers, descriptions and included features. Changes appear live on the website immediately.
          </p>
        </div>

        {!isAddingNew && !editingId && (
          <button
            onClick={startAddNew}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#212121] hover:bg-[#333333] text-white text-xs font-bold transition-all shadow-xs cursor-pointer active:scale-95"
          >
            <Plus className="w-4 h-4 text-[#EFF0A3]" />
            <span>Add New Space</span>
          </button>
        )}
      </div>

      {/* Edit / Add Modal or Inline Form */}
      {(editingId || isAddingNew) && (
        <div className="p-6 rounded-2xl bg-[#F6F5FA] border border-[#D8DFE9] shadow-md space-y-5 animate-in fade-in duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-[#D8DFE9]">
            <h4 className="font-['Oxygen'] font-bold text-sm text-[#212121] uppercase tracking-wider">
              {isAddingNew ? '✨ Add New Workspace Category' : '✏️ Edit Workspace Details'}
            </h4>
            <button
              onClick={() => {
                setEditingId(null);
                setIsAddingNew(false);
              }}
              className="text-zinc-400 hover:text-[#212121] p-1 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-[11px] font-bold text-zinc-500 uppercase mb-1">
                Space Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-white border border-[#D8DFE9] rounded-xl px-3 py-2 text-xs text-[#212121] focus:outline-none focus:border-[#212121]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-zinc-500 uppercase mb-1">
                Display Price *
              </label>
              <input
                type="text"
                placeholder="e.g. Starting from ₹3,500 or ₹999/month"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full bg-white border border-[#D8DFE9] rounded-xl px-3 py-2 text-xs text-[#212121] focus:outline-none focus:border-[#212121]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-zinc-500 uppercase mb-1">
                Billing Unit
              </label>
              <input
                type="text"
                placeholder="e.g. per month, per seat / month, all-inclusive"
                value={formData.unit}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                className="w-full bg-white border border-[#D8DFE9] rounded-xl px-3 py-2 text-xs text-[#212121] focus:outline-none focus:border-[#212121]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-zinc-500 uppercase mb-1">
                Seats Info / Capacity
              </label>
              <input
                type="text"
                placeholder="e.g. 4, 6, 8 or 12 Seater"
                value={formData.seatsInfo}
                onChange={(e) => setFormData({ ...formData, seatsInfo: e.target.value })}
                className="w-full bg-white border border-[#D8DFE9] rounded-xl px-3 py-2 text-xs text-[#212121] focus:outline-none focus:border-[#212121]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-zinc-500 uppercase mb-1">
                Badge / Tag
              </label>
              <input
                type="text"
                placeholder="e.g. MOST POPULAR, BEST VALUE, STARTER"
                value={formData.badge}
                onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                className="w-full bg-white border border-[#D8DFE9] rounded-xl px-3 py-2 text-xs text-[#212121] focus:outline-none focus:border-[#212121]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-zinc-500 uppercase mb-1">
                Space Type Category
              </label>
              <select
                value={formData.iconType}
                onChange={(e) => setFormData({ ...formData, iconType: e.target.value as any })}
                className="w-full bg-white border border-[#D8DFE9] rounded-xl px-3 py-2 text-xs text-[#212121] focus:outline-none focus:border-[#212121]"
              >
                <option value="desk">Hot / Dedicated Desk</option>
                <option value="cabin">Private Team Cabin</option>
                <option value="office">Managed Office</option>
                <option value="virtual">Virtual Office (Address)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-zinc-500 uppercase mb-1">
              One-Line Specific Description *
            </label>
            <textarea
              rows={2}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full bg-white border border-[#D8DFE9] rounded-xl px-3 py-2 text-xs text-[#212121] focus:outline-none focus:border-[#212121]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold text-zinc-500 uppercase mb-1">
                Image URL (Direct link)
              </label>
              <input
                type="url"
                placeholder="https://i.postimg.cc/..."
                value={formData.imageUrl || ''}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                className="w-full bg-white border border-[#D8DFE9] rounded-xl px-3 py-2 text-xs text-[#212121] focus:outline-none focus:border-[#212121]"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-zinc-500 uppercase mb-1">
                Image Alt Text (Accessibility)
              </label>
              <input
                type="text"
                placeholder="e.g. Hot desk coworking space at THE GRID, Hilite Business Park"
                value={formData.imageAlt || ''}
                onChange={(e) => setFormData({ ...formData, imageAlt: e.target.value })}
                className="w-full bg-white border border-[#D8DFE9] rounded-xl px-3 py-2 text-xs text-[#212121] focus:outline-none focus:border-[#212121]"
              />
            </div>
          </div>

          {/* Features Editor */}
          <div>
            <label className="block text-[11px] font-bold text-zinc-500 uppercase mb-2">
              Included Features ({formData.features.length})
            </label>
            <div className="flex flex-wrap gap-2 mb-3">
              {formData.features.map((feat, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white text-xs text-[#212121] border border-[#D8DFE9] shadow-2xs"
                >
                  <span>{feat}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveFeature(idx)}
                    className="text-zinc-400 hover:text-rose-500 p-0.5 cursor-pointer"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Add another feature (e.g. Free Parking, 24/7 Access)..."
                value={newFeatureInput}
                onChange={(e) => setNewFeatureInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddFeature();
                  }
                }}
                className="flex-1 bg-white border border-[#D8DFE9] rounded-xl px-3 py-2 text-xs text-[#212121] focus:outline-none focus:border-[#212121]"
              />
              <button
                type="button"
                onClick={handleAddFeature}
                className="px-3.5 py-2 bg-[#212121] hover:bg-[#333333] text-white rounded-full text-xs font-semibold cursor-pointer"
              >
                Add Bullet
              </button>
            </div>
          </div>

          {/* Availability Toggle */}
          <div className="flex items-center gap-3 pt-2">
            <label className="flex items-center gap-2 text-xs text-[#212121] font-semibold cursor-pointer select-none">
              <input
                type="checkbox"
                checked={formData.isAvailable}
                onChange={(e) => setFormData({ ...formData, isAvailable: e.target.checked })}
                className="w-4 h-4 rounded accent-[#212121]"
              />
              <span>Available for Immediate Move-in</span>
            </label>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#D8DFE9]">
            <button
              type="button"
              onClick={() => {
                setEditingId(null);
                setIsAddingNew(false);
              }}
              className="px-4 py-2 rounded-full bg-white border border-[#D8DFE9] text-zinc-600 text-xs font-semibold hover:bg-zinc-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="inline-flex items-center gap-1.5 px-5 py-2 rounded-full bg-[#212121] hover:bg-[#333333] text-white text-xs font-bold transition-all shadow-xs cursor-pointer active:scale-95"
            >
              <Check className="w-4 h-4 text-[#EFF0A3]" />
              <span>{isAddingNew ? 'Create Space' : 'Save Changes'}</span>
            </button>
          </div>
        </div>
      )}

      {/* Spaces List View */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {spaces.map((space) => (
          <div
            key={space.id}
            className="p-5 rounded-2xl bg-white border border-[#D8DFE9] flex flex-col justify-between hover:border-[#212121] transition-colors shadow-2xs"
          >
            <div>
              <div className="flex items-start justify-between gap-3 mb-2">
                <div>
                  {space.badge && (
                    <span className="inline-block text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full bg-[#EFF0A3] text-[#212121] border border-[#DFE094] mb-1.5">
                      {space.badge}
                    </span>
                  )}
                  <h4 className="font-['Oxygen'] text-lg font-bold text-[#212121] uppercase leading-snug">
                    {space.name}
                  </h4>
                  {space.seatsInfo && (
                    <span className="text-xs text-zinc-500 font-medium">{space.seatsInfo}</span>
                  )}
                </div>

                <div className="text-right">
                  <div className="font-['Oxygen'] text-xl font-bold text-[#212121]">
                    {space.price}
                  </div>
                  <span className="text-[10px] text-zinc-500 block">{space.unit}</span>
                </div>
              </div>

              <p className="text-xs text-zinc-600 mb-3 line-clamp-2">
                {space.description}
              </p>

              <div className="flex flex-wrap gap-1.5 mb-4">
                {space.features.slice(0, 4).map((f, i) => (
                  <span
                    key={i}
                    className="text-[10px] px-2 py-0.5 rounded-md bg-[#F6F5FA] text-zinc-700 border border-[#D8DFE9]/60"
                  >
                    {f}
                  </span>
                ))}
                {space.features.length > 4 && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-[#F6F5FA] text-zinc-400">
                    +{space.features.length - 4} more
                  </span>
                )}
              </div>
            </div>

            <div className="pt-3 border-t border-dotted-separator flex items-center justify-between text-xs">
              <span
                className={`inline-flex items-center gap-1.5 text-[11px] font-semibold ${
                  space.isAvailable ? 'text-[#212121]' : 'text-rose-600'
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${space.isAvailable ? 'bg-[#CFDECA] border border-[#b8cbb3]' : 'bg-rose-500'}`} />
                {space.isAvailable ? 'Open for booking' : 'Waitlist only'}
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => startEdit(space)}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#F6F5FA] hover:bg-zinc-100 text-[#212121] text-xs font-semibold border border-[#D8DFE9] transition-colors cursor-pointer"
                >
                  <Edit2 className="w-3.5 h-3.5 text-[#212121]" />
                  <span>Edit</span>
                </button>

                {deleteConfirmId === space.id ? (
                  <div className="inline-flex items-center gap-1.5 bg-rose-50 border border-rose-200 px-2.5 py-1 rounded-full animate-in fade-in duration-150">
                    <span className="text-[11px] font-semibold text-rose-700">Delete?</span>
                    <button
                      type="button"
                      onClick={() => {
                        deleteSpace(space.id);
                        setDeleteConfirmId(null);
                      }}
                      className="px-2 py-0.5 rounded-full bg-rose-600 hover:bg-rose-700 text-white text-[10px] font-bold transition-colors cursor-pointer shadow-2xs"
                    >
                      Confirm
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteConfirmId(null)}
                      className="px-2 py-0.5 rounded-full bg-white hover:bg-zinc-100 text-zinc-600 text-[10px] font-medium border border-zinc-200 transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setDeleteConfirmId(space.id)}
                    className="p-1.5 rounded-full bg-[#F6F5FA] hover:bg-rose-50 text-zinc-400 hover:text-rose-600 border border-[#D8DFE9] transition-colors cursor-pointer"
                    title="Delete space"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
