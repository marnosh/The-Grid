import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { BrandLogo } from '../BrandLogo';
import { AdminSpacesTab } from './AdminSpacesTab';
import { AdminAmenitiesTab } from './AdminAmenitiesTab';
import { AdminContentTab } from './AdminContentTab';
import { AdminEnquiriesTab } from './AdminEnquiriesTab';
import {
  LayoutGrid,
  Coffee,
  FileText,
  Users,
  Eye,
  Download,
  Upload,
  RotateCcw,
  Sparkles,
  Check,
  ShieldCheck,
} from 'lucide-react';
import { AdminTab } from '../../types';

export const AdminPanel: React.FC = () => {
  const {
    setIsAdminView,
    spaces,
    amenities,
    enquiries,
    resetToDefaults,
    exportJSON,
    importJSON,
    showToast,
  } = useData();

  const [activeTab, setActiveTab] = useState<AdminTab>('spaces');
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [importText, setImportText] = useState('');

  const newLeadsCount = enquiries.filter((e) => e.status === 'new').length;

  const handleExport = () => {
    const json = exportJSON();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `thegrid_content_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    showToast('Exported site content to JSON');
  };

  const handleImportSubmit = () => {
    if (!importText.trim()) return;
    const ok = importJSON(importText);
    if (ok) {
      setImportModalOpen(false);
      setImportText('');
    }
  };

  return (
    <div className="min-h-screen bg-[#F6F5FA] text-[#212121] flex flex-col">
      {/* Admin Top Navigation */}
      <header className="sticky top-0 z-50 bg-[#212121] border-b border-zinc-800 px-4 sm:px-6 py-3.5 text-white">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <BrandLogo size="sm" darkTheme={true} />
            <div className="hidden sm:block h-6 w-px bg-zinc-700" />
            <div className="hidden sm:flex items-center gap-2">
              <span className="font-['Oxygen'] text-sm tracking-wider uppercase text-[#EFF0A3] font-bold">
                CMS Management Portal
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#CFDECA]/20 text-[#CFDECA] font-semibold border border-[#CFDECA]/30">
                Live Dynamic Sync
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Export / Backup */}
            <button
              onClick={handleExport}
              className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-zinc-300 border border-zinc-700 transition-colors cursor-pointer"
              title="Download full JSON backup of current configuration"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export JSON</span>
            </button>

            {/* Import */}
            <button
              onClick={() => setImportModalOpen(true)}
              className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-zinc-300 border border-zinc-700 transition-colors cursor-pointer"
              title="Import JSON data backup"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Import JSON</span>
            </button>

            {/* Live Website Preview Button */}
            <button
              id="view-live-website-btn"
              onClick={() => setIsAdminView(false)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#EFF0A3] hover:bg-[#dfe094] text-[#212121] text-xs font-bold transition-all shadow-sm active:scale-95 cursor-pointer border border-[#dfe094]"
            >
              <Eye className="w-4 h-4 text-[#212121]" />
              <span>View Live Website</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1">
        
        {/* Metric Quick Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <div
            onClick={() => setActiveTab('spaces')}
            className={`p-5 rounded-2xl border transition-all cursor-pointer bg-white shadow-xs ${
              activeTab === 'spaces'
                ? 'border-[#212121] ring-1 ring-[#212121]'
                : 'border-[#D8DFE9] hover:border-[#212121]'
            }`}
          >
            <div className="flex items-center justify-between text-xs text-zinc-500 font-semibold mb-2">
              <span>Workspaces</span>
              <div className="w-7 h-7 rounded-lg bg-[#D8DFE9]/40 flex items-center justify-center">
                <LayoutGrid className="w-3.5 h-3.5 text-[#212121]" />
              </div>
            </div>
            <div className="font-['Oxygen'] text-2xl font-bold text-[#212121]">
              {spaces.length} Spaces
            </div>
          </div>

          <div
            onClick={() => setActiveTab('amenities')}
            className={`p-5 rounded-2xl border transition-all cursor-pointer bg-white shadow-xs ${
              activeTab === 'amenities'
                ? 'border-[#212121] ring-1 ring-[#212121]'
                : 'border-[#D8DFE9] hover:border-[#212121]'
            }`}
          >
            <div className="flex items-center justify-between text-xs text-zinc-500 font-semibold mb-2">
              <span>Perks & Amenities</span>
              <div className="w-7 h-7 rounded-lg bg-[#D8DFE9]/40 flex items-center justify-center">
                <Coffee className="w-3.5 h-3.5 text-[#212121]" />
              </div>
            </div>
            <div className="font-['Oxygen'] text-2xl font-bold text-[#212121]">
              {amenities.filter((a) => a.enabled).length} Active
            </div>
          </div>

          <div
            onClick={() => setActiveTab('enquiries')}
            className={`p-5 rounded-2xl border transition-all cursor-pointer bg-white shadow-xs ${
              activeTab === 'enquiries'
                ? 'border-[#212121] ring-1 ring-[#212121]'
                : 'border-[#D8DFE9] hover:border-[#212121]'
            }`}
          >
            <div className="flex items-center justify-between text-xs text-zinc-500 font-semibold mb-2">
              <span>Customer Leads</span>
              <div className="w-7 h-7 rounded-lg bg-[#D8DFE9]/40 flex items-center justify-center">
                <Users className="w-3.5 h-3.5 text-[#212121]" />
              </div>
            </div>
            <div className="font-['Oxygen'] text-2xl font-bold text-[#212121] flex items-center gap-2">
              <span>{enquiries.length}</span>
              {newLeadsCount > 0 && (
                <span className="text-[10px] font-sans px-2 py-0.5 rounded-full bg-[#EFF0A3] text-[#212121] border border-[#DFE094] font-bold">
                  {newLeadsCount} New
                </span>
              )}
            </div>
          </div>

          <div
            onClick={() => setActiveTab('content')}
            className={`p-5 rounded-2xl border transition-all cursor-pointer bg-white shadow-xs ${
              activeTab === 'content'
                ? 'border-[#212121] ring-1 ring-[#212121]'
                : 'border-[#D8DFE9] hover:border-[#212121]'
            }`}
          >
            <div className="flex items-center justify-between text-xs text-zinc-500 font-semibold mb-2">
              <span>Copy & Pop-up</span>
              <div className="w-7 h-7 rounded-lg bg-[#D8DFE9]/40 flex items-center justify-center">
                <FileText className="w-3.5 h-3.5 text-[#212121]" />
              </div>
            </div>
            <div className="font-['Oxygen'] text-2xl font-bold text-[#212121]">
              Copy & Pop-up
            </div>
          </div>
        </div>

        {/* Tab Navigation Navigation Bar */}
        <div className="flex border-b border-[#D8DFE9] gap-2 mb-8 overflow-x-auto pb-1">
          <button
            onClick={() => setActiveTab('spaces')}
            className={`flex items-center gap-2 px-5 py-3 border-b-2 text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'spaces'
                ? 'border-[#212121] text-[#212121] font-bold'
                : 'border-transparent text-zinc-500 hover:text-[#212121]'
            }`}
          >
            <LayoutGrid className="w-4 h-4" />
            <span>Spaces & Pricing</span>
          </button>

          <button
            onClick={() => setActiveTab('amenities')}
            className={`flex items-center gap-2 px-5 py-3 border-b-2 text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'amenities'
                ? 'border-[#212121] text-[#212121] font-bold'
                : 'border-transparent text-zinc-500 hover:text-[#212121]'
            }`}
          >
            <Coffee className="w-4 h-4" />
            <span>Amenities ({amenities.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('content')}
            className={`flex items-center gap-2 px-5 py-3 border-b-2 text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'content'
                ? 'border-[#212121] text-[#212121] font-bold'
                : 'border-transparent text-zinc-500 hover:text-[#212121]'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Site Content & Pop-up</span>
          </button>

          <button
            onClick={() => setActiveTab('enquiries')}
            className={`flex items-center gap-2 px-5 py-3 border-b-2 text-sm font-semibold transition-all whitespace-nowrap cursor-pointer relative ${
              activeTab === 'enquiries'
                ? 'border-[#212121] text-[#212121] font-bold'
                : 'border-transparent text-zinc-500 hover:text-[#212121]'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Incoming Enquiries CRM</span>
            {newLeadsCount > 0 && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#EFF0A3] text-[#212121] font-bold border border-[#DFE094]">
                {newLeadsCount} New
              </span>
            )}
          </button>
        </div>

        {/* Tab Content Display */}
        <div className="bg-white rounded-2xl border border-[#D8DFE9] p-6 sm:p-8 shadow-xs">
          {activeTab === 'spaces' && <AdminSpacesTab />}
          {activeTab === 'amenities' && <AdminAmenitiesTab />}
          {activeTab === 'content' && <AdminContentTab />}
          {activeTab === 'enquiries' && <AdminEnquiriesTab />}
        </div>
      </div>

      {/* JSON Import Modal */}
      {importModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#D8DFE9] rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <h4 className="font-['Oxygen'] text-lg font-bold uppercase text-[#212121]">Import Configuration JSON</h4>
            <p className="text-xs text-zinc-500">
              Paste exported JSON below to restore or migrate spaces, amenities, and site settings.
            </p>
            <textarea
              rows={8}
              value={importText}
              onChange={(e) => setImportText(e.target.value)}
              placeholder="Paste JSON content here..."
              className="w-full bg-[#F6F5FA] border border-[#D8DFE9] rounded-xl p-3 text-xs text-[#212121] font-mono focus:outline-none focus:border-[#212121]"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setImportModalOpen(false)}
                className="px-4 py-2 rounded-full bg-[#F6F5FA] border border-[#D8DFE9] text-xs font-semibold text-zinc-700 hover:bg-zinc-100 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleImportSubmit}
                className="px-4 py-2 rounded-full bg-[#212121] hover:bg-[#333333] text-white text-xs font-bold cursor-pointer"
              >
                Apply Import
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
