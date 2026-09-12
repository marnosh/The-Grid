import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { AmenityItem } from '../../types';
import { Plus, Trash2, Edit2, Check, X, Armchair, Snowflake, Building2, Wifi, Gamepad2, Coffee, Shield } from 'lucide-react';

export const AdminAmenitiesTab: React.FC = () => {
  const { amenities, updateAmenity, addAmenity, deleteAmenity } = useData();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const [formData, setFormData] = useState<Omit<AmenityItem, 'id'>>({
    title: '',
    description: '',
    icon: 'coffee',
    enabled: true,
  });

  const getAmenityIcon = (iconName: AmenityItem['icon']) => {
    switch (iconName) {
      case 'sofa':
        return <Armchair className="w-5 h-5 text-[#212121]" />;
      case 'snowflake':
        return <Snowflake className="w-5 h-5 text-[#212121]" />;
      case 'map-pin':
        return <Building2 className="w-5 h-5 text-[#212121]" />;
      case 'wifi':
        return <Wifi className="w-5 h-5 text-[#212121]" />;
      case 'gamepad':
        return <Gamepad2 className="w-5 h-5 text-[#212121]" />;
      case 'coffee':
        return <Coffee className="w-5 h-5 text-[#212121]" />;
      default:
        return <Shield className="w-5 h-5 text-[#212121]" />;
    }
  };

  const startEdit = (amenity: AmenityItem) => {
    setEditingId(amenity.id);
    setIsAdding(false);
    setFormData({
      title: amenity.title,
      description: amenity.description,
      icon: amenity.icon,
      enabled: amenity.enabled,
    });
  };

  const handleSave = () => {
    if (!formData.title.trim() || !formData.description.trim()) return;

    if (editingId) {
      updateAmenity(editingId, formData);
      setEditingId(null);
    } else if (isAdding) {
      addAmenity(formData);
      setIsAdding(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#D8DFE9]">
        <div>
          <h3 className="text-lg font-bold text-[#212121] font-['Oxygen'] uppercase tracking-wide">
            Manage Amenities
          </h3>
          <p className="text-xs text-zinc-500">
            Customise the features and perks included in your Hilite Business Park workspaces.
          </p>
        </div>

        {!isAdding && !editingId && (
          <button
            onClick={() => {
              setIsAdding(true);
              setEditingId(null);
              setFormData({
                title: 'Power Backup & Generator',
                description: '100% uninterrupted power supply with dual generator backup',
                icon: 'snowflake',
                enabled: true,
              });
            }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#212121] hover:bg-[#333333] text-white text-xs font-bold transition-all shadow-xs cursor-pointer active:scale-95"
          >
            <Plus className="w-4 h-4 text-[#EFF0A3]" />
            <span>Add Amenity</span>
          </button>
        )}
      </div>

      {/* Edit / Add Form */}
      {(editingId || isAdding) && (
        <div className="p-6 rounded-2xl bg-[#F6F5FA] border border-[#D8DFE9] shadow-md space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#D8DFE9]">
            <h4 className="font-['Oxygen'] font-bold text-sm text-[#212121] uppercase tracking-wider">
              {isAdding ? 'Add New Facility' : 'Edit Amenity'}
            </h4>
            <button
              onClick={() => {
                setEditingId(null);
                setIsAdding(false);
              }}
              className="text-zinc-400 hover:text-[#212121] p-1 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold text-zinc-500 uppercase mb-1">
                Amenity Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full bg-white border border-[#D8DFE9] rounded-xl px-3 py-2 text-xs text-[#212121] focus:outline-none focus:border-[#212121]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-zinc-500 uppercase mb-1">
                Icon Type
              </label>
              <select
                value={formData.icon}
                onChange={(e) => setFormData({ ...formData, icon: e.target.value as any })}
                className="w-full bg-white border border-[#D8DFE9] rounded-xl px-3 py-2 text-xs text-[#212121] focus:outline-none focus:border-[#212121]"
              >
                <option value="sofa">Sofa / Furnished</option>
                <option value="snowflake">Air Conditioning (Snowflake)</option>
                <option value="map-pin">Location / Building</option>
                <option value="wifi">High-speed WiFi</option>
                <option value="gamepad">Games & Fun Zone</option>
                <option value="coffee">Coffee Machine</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-zinc-500 uppercase mb-1">
              Description (One line, Indian English) *
            </label>
            <input
              type="text"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full bg-white border border-[#D8DFE9] rounded-xl px-3 py-2 text-xs text-[#212121] focus:outline-none focus:border-[#212121]"
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <label className="flex items-center gap-2 text-xs text-[#212121] font-semibold cursor-pointer select-none">
              <input
                type="checkbox"
                checked={formData.enabled}
                onChange={(e) => setFormData({ ...formData, enabled: e.target.checked })}
                className="w-4 h-4 rounded accent-[#212121]"
              />
              <span>Display on live website</span>
            </label>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setEditingId(null);
                  setIsAdding(false);
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
                <span>Save</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Amenities Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {amenities.map((amenity) => (
          <div
            key={amenity.id}
            className={`p-4 rounded-2xl border transition-all flex items-start justify-between gap-3 shadow-2xs ${
              amenity.enabled
                ? 'bg-white border-[#D8DFE9] hover:border-[#212121]'
                : 'bg-[#F6F5FA] border-[#D8DFE9] opacity-60'
            }`}
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#D8DFE9]/40 flex items-center justify-center shrink-0 border border-[#D8DFE9]">
                {getAmenityIcon(amenity.icon)}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-[#212121] text-sm leading-snug">
                    {amenity.title}
                  </h4>
                  {!amenity.enabled && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-zinc-200 text-zinc-600 font-semibold">
                      Hidden
                    </span>
                  )}
                </div>
                <p className="text-xs text-zinc-500 mt-1 leading-snug">
                  {amenity.description}
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-1 shrink-0">
              <button
                onClick={() => updateAmenity(amenity.id, { enabled: !amenity.enabled })}
                className={`px-2 py-1 rounded-full text-[10px] font-bold transition-colors cursor-pointer ${
                  amenity.enabled
                    ? 'bg-[#CFDECA] text-[#212121] hover:bg-[#bfcfba] border border-[#b9caa4]'
                    : 'bg-zinc-200 text-zinc-600 hover:bg-zinc-300'
                }`}
                title={amenity.enabled ? 'Click to hide' : 'Click to show'}
              >
                {amenity.enabled ? 'ON' : 'OFF'}
              </button>
              <button
                onClick={() => startEdit(amenity)}
                className="p-1.5 rounded-full bg-[#F6F5FA] hover:bg-zinc-100 text-[#212121] border border-[#D8DFE9] transition-colors cursor-pointer"
                title="Edit"
              >
                <Edit2 className="w-3.5 h-3.5 text-[#212121]" />
              </button>
              {deleteConfirmId === amenity.id ? (
                <div className="inline-flex items-center gap-1 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-full animate-in fade-in duration-150">
                  <button
                    type="button"
                    onClick={() => {
                      deleteAmenity(amenity.id);
                      setDeleteConfirmId(null);
                    }}
                    className="px-1.5 py-0.5 rounded-full bg-rose-600 hover:bg-rose-700 text-white text-[9px] font-bold cursor-pointer"
                    title="Confirm Delete"
                  >
                    Yes
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeleteConfirmId(null)}
                    className="px-1.5 py-0.5 rounded-full bg-white hover:bg-zinc-100 text-zinc-600 text-[9px] border border-zinc-200 cursor-pointer"
                    title="Cancel"
                  >
                    No
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setDeleteConfirmId(amenity.id)}
                  className="p-1.5 rounded-full bg-[#F6F5FA] hover:bg-rose-50 text-zinc-400 hover:text-rose-600 border border-[#D8DFE9] transition-colors cursor-pointer"
                  title="Delete"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
