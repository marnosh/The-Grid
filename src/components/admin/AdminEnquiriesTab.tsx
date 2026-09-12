import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Enquiry } from '../../types';
import { Phone, Trash2, Search, Filter, Calendar, Clock, CheckCircle, AlertCircle, Bookmark } from 'lucide-react';
import { WhatsAppIcon } from '../WhatsAppIcon';

export const AdminEnquiriesTab: React.FC = () => {
  const { enquiries, updateEnquiryStatus, deleteEnquiry } = useData();

  const [statusFilter, setStatusFilter] = useState<'all' | Enquiry['status']>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [noteInput, setNoteInput] = useState('');
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const filtered = enquiries.filter((enq) => {
    const matchesStatus = statusFilter === 'all' || enq.status === statusFilter;
    const matchesSearch =
      enq.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      enq.phone.includes(searchTerm) ||
      enq.spaceType.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const getStatusBadge = (status: Enquiry['status']) => {
    switch (status) {
      case 'new':
        return (
          <span className="inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#EFF0A3] text-[#212121] border border-[#DFE094]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#212121] animate-ping" />
            NEW LEAD
          </span>
        );
      case 'contacted':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-[#D8DFE9] text-[#212121] border border-[#cbd5e1]">
            CONTACTED
          </span>
        );
      case 'booked':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-[#CFDECA] text-[#212121] border border-[#b8cbb3]">
            <CheckCircle className="w-3 h-3 text-[#212121]" />
            BOOKED
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-zinc-100 text-zinc-500 border border-zinc-200">
            ARCHIVED
          </span>
        );
    }
  };

  const handleSaveNote = (id: string) => {
    updateEnquiryStatus(id, enquiries.find((e) => e.id === id)?.status || 'contacted', noteInput);
    setEditingNoteId(null);
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Filter Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#D8DFE9]">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-[#212121] font-['Oxygen'] uppercase tracking-wide">
              Customer Enquiries & Leads CRM
            </h3>
            <span className="px-2.5 py-0.5 rounded-full bg-[#EFF0A3] text-[#212121] border border-[#DFE094] text-xs font-bold">
              {enquiries.length}
            </span>
          </div>
          <p className="text-xs text-zinc-500">
            Prospective tenants looking for desks, cabins, and virtual office addresses at Hilite Business Park.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {(['all', 'new', 'contacted', 'booked', 'cancelled'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold capitalize transition-colors whitespace-nowrap cursor-pointer ${
                statusFilter === st
                  ? 'bg-[#212121] text-white font-bold shadow-xs'
                  : 'bg-white border border-[#D8DFE9] text-zinc-600 hover:text-[#212121] hover:border-[#212121]'
              }`}
            >
              {st === 'all' ? 'All Leads' : st}
            </button>
          ))}
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search leads by name, phone number, or space type..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-white border border-[#D8DFE9] rounded-xl pl-10 pr-4 py-2.5 text-xs text-[#212121] placeholder:text-zinc-400 focus:outline-none focus:border-[#212121]"
        />
      </div>

      {/* Leads List */}
      {filtered.length === 0 ? (
        <div className="text-center py-12 rounded-2xl bg-[#F6F5FA] border border-[#D8DFE9] text-zinc-500">
          <p className="text-sm">No enquiries found matching your filter.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((enq) => {
            const cleanPhone = enq.phone.replace(/[^0-9]/g, '');
            const intlPhone = cleanPhone.startsWith('91') ? cleanPhone : `91${cleanPhone}`;
            const whatsappProspectUrl = `https://wa.me/${intlPhone}?text=${encodeURIComponent(
              `Hi ${enq.name}, greetings from THE GRID Coworking at Hilite Business Park, Calicut! Thank you for inquiring about our ${enq.spaceType}. Are you available for a quick chat or visit to the 1st floor?`
            )}`;

            const formattedDate = new Date(enq.createdAt).toLocaleDateString('en-IN', {
              day: 'numeric',
              month: 'short',
              hour: '2-digit',
              minute: '2-digit',
            });

            return (
              <div
                key={enq.id}
                className="p-5 rounded-2xl bg-white border border-[#D8DFE9] hover:border-[#212121] transition-all space-y-3 shadow-2xs"
              >
                {/* Header Row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <h4 className="font-bold text-[#212121] text-base">{enq.name}</h4>
                    {getStatusBadge(enq.status)}
                  </div>

                  <div className="flex items-center gap-2 text-xs text-zinc-500">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{formattedDate}</span>
                  </div>
                </div>

                {/* Details Badges */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-[#F6F5FA] border border-[#D8DFE9]/60 text-zinc-700">
                    <span className="text-zinc-400 block text-[10px] uppercase font-bold">Space Type</span>
                    <span className="text-[#212121] font-semibold">{enq.spaceType}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#F6F5FA] border border-[#D8DFE9]/60 text-zinc-700">
                    <span className="text-zinc-400 block text-[10px] uppercase font-bold">Requirement</span>
                    <span className="text-[#212121] font-semibold">{enq.seatsNeeded}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#F6F5FA] border border-[#D8DFE9]/60 text-zinc-700">
                    <span className="text-zinc-400 block text-[10px] uppercase font-bold">Direct Phone</span>
                    <span className="text-[#212121] font-semibold">{enq.phone}</span>
                  </div>
                </div>

                {/* Message */}
                {enq.message && (
                  <div className="p-3 rounded-xl bg-[#F6F5FA] border border-[#D8DFE9] text-xs text-zinc-700 leading-relaxed">
                    <span className="text-zinc-500 font-semibold block mb-0.5 text-[10px] uppercase">
                      Client Note / Message:
                    </span>
                    "{enq.message}"
                  </div>
                )}

                {/* Admin Internal Notes */}
                <div className="pt-2">
                  {editingNoteId === enq.id ? (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={noteInput}
                        onChange={(e) => setNoteInput(e.target.value)}
                        placeholder="Add internal manager note (e.g. Quoted ₹14,000 for 4-seater)..."
                        className="flex-1 bg-white border border-[#D8DFE9] rounded-xl px-3 py-1.5 text-xs text-[#212121] focus:outline-none focus:border-[#212121]"
                      />
                      <button
                        onClick={() => handleSaveNote(enq.id)}
                        className="px-3.5 py-1.5 rounded-full bg-[#212121] hover:bg-[#333333] text-white text-xs font-bold cursor-pointer"
                      >
                        Save Note
                      </button>
                      <button
                        onClick={() => setEditingNoteId(null)}
                        className="px-3 py-1.5 rounded-full bg-white border border-[#D8DFE9] text-zinc-600 text-xs hover:bg-zinc-50 cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between text-xs text-zinc-500">
                      <span className="italic">
                        {enq.notes ? `📝 Manager Note: ${enq.notes}` : 'No internal note yet.'}
                      </span>
                      <button
                        onClick={() => {
                          setEditingNoteId(enq.id);
                          setNoteInput(enq.notes || '');
                        }}
                        className="text-[#212121] hover:underline font-semibold text-[11px] cursor-pointer"
                      >
                        {enq.notes ? 'Edit note' : '+ Add note'}
                      </button>
                    </div>
                  )}
                </div>

                {/* Action Controls & Status Changer */}
                <div className="pt-3 border-t border-dotted-separator flex flex-wrap items-center justify-between gap-3">
                  {/* Status Dropdown */}
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-zinc-500 font-semibold uppercase">Status:</span>
                    <select
                      value={enq.status}
                      onChange={(e) => updateEnquiryStatus(enq.id, e.target.value as any)}
                      className="bg-white border border-[#D8DFE9] rounded-lg px-2.5 py-1 text-xs text-[#212121] focus:outline-none focus:border-[#212121]"
                    >
                      <option value="new">New Lead</option>
                      <option value="contacted">Contacted</option>
                      <option value="booked">Booked (Tenant)</option>
                      <option value="cancelled">Archived</option>
                    </select>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <a
                      href={whatsappProspectUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#CFDECA]/40 hover:bg-[#CFDECA]/70 border border-[#b8cbb3] text-[#212121] text-xs font-semibold transition-colors cursor-pointer"
                    >
                      <WhatsAppIcon className="w-3.5 h-3.5" />
                      <span>WhatsApp Client</span>
                    </a>

                    <a
                      href={`tel:${enq.phone}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#F6F5FA] hover:bg-zinc-100 border border-[#D8DFE9] text-[#212121] text-xs font-semibold transition-colors cursor-pointer"
                    >
                      <Phone className="w-3.5 h-3.5 text-[#212121]" />
                      <span>Call</span>
                    </a>

                    {confirmDeleteId === enq.id ? (
                      <div className="inline-flex items-center gap-1.5 bg-rose-50 border border-rose-200 px-2.5 py-1 rounded-full animate-in fade-in duration-150">
                        <span className="text-[11px] font-semibold text-rose-700">Delete?</span>
                        <button
                          type="button"
                          onClick={() => {
                            deleteEnquiry(enq.id);
                            setConfirmDeleteId(null);
                          }}
                          className="px-2 py-0.5 rounded-full bg-rose-600 hover:bg-rose-700 text-white text-[10px] font-bold transition-colors cursor-pointer shadow-2xs"
                        >
                          Confirm
                        </button>
                        <button
                          type="button"
                          onClick={() => setConfirmDeleteId(null)}
                          className="px-2 py-0.5 rounded-full bg-white hover:bg-zinc-100 text-zinc-600 text-[10px] font-medium border border-zinc-200 transition-colors cursor-pointer"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setConfirmDeleteId(enq.id)}
                        className="p-1.5 rounded-full bg-[#F6F5FA] hover:bg-rose-50 text-zinc-400 hover:text-rose-600 border border-[#D8DFE9] transition-colors cursor-pointer"
                        title="Delete enquiry"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
