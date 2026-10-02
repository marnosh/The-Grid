import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { BrandLogo } from '../BrandLogo';
import { AdminSpacesTab } from './AdminSpacesTab';
import { AdminAmenitiesTab } from './AdminAmenitiesTab';
import { AdminContentTab } from './AdminContentTab';
import { AdminEnquiriesTab } from './AdminEnquiriesTab';
import { AdminBlogsTab } from './AdminBlogsTab';
import { AdminExportTab } from './AdminExportTab';
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
  BookOpen,
  Github,
  Share2,
  LogOut,
  User,
  Lock,
} from 'lucide-react';
import { AdminTab } from '../../types';

export const AdminPanel: React.FC = () => {
  const {
    setIsAdminView,
    isAdminAuthenticated,
    adminUser,
    logoutAdmin,
    setIsAdminLoginModalOpen,
    spaces,
    amenities,
    enquiries,
    blogs,
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

  // Guard: If not authenticated, require login
  if (!isAdminAuthenticated) {
    return (
      <div className="min-h-screen bg-[#18181b] text-white flex flex-col items-center justify-center p-6 text-center">
        <div className="w-full max-w-md p-8 rounded-2xl bg-[#212121] border border-zinc-800 shadow-2xl">
          <div className="w-12 h-12 rounded-full bg-red-950/60 border border-red-800/80 flex items-center justify-center mx-auto mb-4 text-red-400">
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold mb-2">Authentication Required</h2>
          <p className="text-xs text-zinc-400 mb-6 leading-relaxed">
            The CMS Management Portal is protected by serverless backend authentication. Please sign in with your administrator credentials.
          </p>
          <div className="space-y-3">
            <button
              onClick={() => setIsAdminLoginModalOpen(true)}
              className="w-full py-2.5 px-4 rounded-xl bg-[#EFF0A3] hover:bg-[#dfe094] text-[#212121] text-xs font-bold transition-all shadow-md cursor-pointer"
            >
              Sign In to CMS Admin
            </button>
            <button
              onClick={() => setIsAdminView(false)}
              className="w-full py-2.5 px-4 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-semibold transition-all cursor-pointer"
            >
              Return to Website
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F6F5FA] text-[#212121] flex flex-col">
      {/* Admin Top Navigation */}
      <header className="sticky top-0 z-50 bg-[#212121] border-b border-zinc-800 px-4 sm:px-6 py-3 text-white">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 sm:gap-4">
            <BrandLogo size="sm" darkTheme={true} />
            <div className="hidden sm:block h-6 w-px bg-zinc-700" />
            <div className="hidden sm:flex items-center gap-2">
              <span className="font-['Oxygen'] text-sm tracking-wider uppercase text-[#EFF0A3] font-bold">
                CMS Portal
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950/60 text-emerald-300 font-semibold border border-emerald-800/60 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                <span>Backend Verified</span>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Current Admin Email Pill */}
            {adminUser?.email && (
              <div className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-700/80 text-[11px] text-zinc-300">
                <User className="w-3.5 h-3.5 text-[#EFF0A3]" />
                <span className="truncate max-w-[150px]">{adminUser.email}</span>
              </div>
            )}

            {/* Export / Backup */}
            <button
              onClick={handleExport}
              className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-zinc-300 border border-zinc-700 transition-colors cursor-pointer"
              title="Download full JSON backup of current configuration"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export</span>
            </button>

            {/* Import */}
            <button
              onClick={() => setImportModalOpen(true)}
              className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-zinc-300 border border-zinc-700 transition-colors cursor-pointer"
              title="Import JSON data backup"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Import</span>
            </button>

            {/* Live Website Preview Button */}
            <button
              id="view-live-website-btn"
              onClick={() => setIsAdminView(false)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#EFF0A3] hover:bg-[#dfe094] text-[#212121] text-xs font-bold transition-all shadow-sm active:scale-95 cursor-pointer border border-[#dfe094]"
            >
              <Eye className="w-3.5 h-3.5 text-[#212121]" />
              <span>Live Website</span>
            </button>

            {/* Logout Button */}
            <button
              id="admin-logout-btn"
              onClick={logoutAdmin}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-zinc-800 hover:bg-red-950/80 hover:border-red-800/80 text-xs font-semibold text-zinc-300 hover:text-red-300 border border-zinc-700 transition-all cursor-pointer"
              title="Sign out of Admin Session"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Log Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1">
        
        {/* Metric Quick Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-8">
          <div
            onClick={() => setActiveTab('spaces')}
            className={`p-4 rounded-2xl border transition-all cursor-pointer bg-white shadow-xs ${
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
            <div className="font-['Oxygen'] text-xl font-bold text-[#212121]">
              {spaces.length} Spaces
            </div>
          </div>

          <div
            onClick={() => setActiveTab('amenities')}
            className={`p-4 rounded-2xl border transition-all cursor-pointer bg-white shadow-xs ${
              activeTab === 'amenities'
                ? 'border-[#212121] ring-1 ring-[#212121]'
                : 'border-[#D8DFE9] hover:border-[#212121]'
            }`}
          >
            <div className="flex items-center justify-between text-xs text-zinc-500 font-semibold mb-2">
              <span>Amenities</span>
              <div className="w-7 h-7 rounded-lg bg-[#D8DFE9]/40 flex items-center justify-center">
                <Coffee className="w-3.5 h-3.5 text-[#212121]" />
              </div>
            </div>
            <div className="font-['Oxygen'] text-xl font-bold text-[#212121]">
              {amenities.filter((a) => a.enabled).length} Active
            </div>
          </div>

          <div
            onClick={() => setActiveTab('blogs')}
            className={`p-4 rounded-2xl border transition-all cursor-pointer bg-white shadow-xs ${
              activeTab === 'blogs'
                ? 'border-[#212121] ring-1 ring-[#212121]'
                : 'border-[#D8DFE9] hover:border-[#212121]'
            }`}
          >
            <div className="flex items-center justify-between text-xs text-zinc-500 font-semibold mb-2">
              <span>Blogs</span>
              <div className="w-7 h-7 rounded-lg bg-[#EFF0A3] flex items-center justify-center">
                <BookOpen className="w-3.5 h-3.5 text-[#212121]" />
              </div>
            </div>
            <div className="font-['Oxygen'] text-xl font-bold text-[#212121]">
              {blogs.length} Articles
            </div>
          </div>

          <div
            onClick={() => setActiveTab('enquiries')}
            className={`p-4 rounded-2xl border transition-all cursor-pointer bg-white shadow-xs ${
              activeTab === 'enquiries'
                ? 'border-[#212121] ring-1 ring-[#212121]'
                : 'border-[#D8DFE9] hover:border-[#212121]'
            }`}
          >
            <div className="flex items-center justify-between text-xs text-zinc-500 font-semibold mb-2">
              <span>Leads CRM</span>
              <div className="w-7 h-7 rounded-lg bg-[#D8DFE9]/40 flex items-center justify-center">
                <Users className="w-3.5 h-3.5 text-[#212121]" />
              </div>
            </div>
            <div className="font-['Oxygen'] text-xl font-bold text-[#212121] flex items-center gap-1.5">
              <span>{enquiries.length}</span>
              {newLeadsCount > 0 && (
                <span className="text-[10px] font-sans px-1.5 py-0.5 rounded-full bg-[#EFF0A3] text-[#212121] border border-[#DFE094] font-bold">
                  {newLeadsCount} New
                </span>
              )}
            </div>
          </div>

          <div
            onClick={() => setActiveTab('export')}
            className={`p-4 rounded-2xl border transition-all cursor-pointer bg-white shadow-xs ${
              activeTab === 'export'
                ? 'border-[#212121] ring-1 ring-[#212121]'
                : 'border-[#D8DFE9] hover:border-[#212121]'
            }`}
          >
            <div className="flex items-center justify-between text-xs text-zinc-500 font-semibold mb-2">
              <span>GitHub Deploy</span>
              <div className="w-7 h-7 rounded-lg bg-zinc-900 text-[#EFF0A3] flex items-center justify-center">
                <Github className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="font-['Oxygen'] text-xl font-bold text-[#212121]">
              Export Code
            </div>
          </div>
        </div>

        {/* Tab Navigation Bar */}
        <div className="flex border-b border-[#D8DFE9] gap-2 mb-8 overflow-x-auto pb-1">
          <button
            onClick={() => setActiveTab('spaces')}
            className={`flex items-center gap-2 px-4 py-3 border-b-2 text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${
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
            className={`flex items-center gap-2 px-4 py-3 border-b-2 text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'amenities'
                ? 'border-[#212121] text-[#212121] font-bold'
                : 'border-transparent text-zinc-500 hover:text-[#212121]'
            }`}
          >
            <Coffee className="w-4 h-4" />
            <span>Amenities ({amenities.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('blogs')}
            className={`flex items-center gap-2 px-4 py-3 border-b-2 text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'blogs'
                ? 'border-[#212121] text-[#212121] font-bold'
                : 'border-transparent text-zinc-500 hover:text-[#212121]'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Blogs ({blogs.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('content')}
            className={`flex items-center gap-2 px-4 py-3 border-b-2 text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${
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
            className={`flex items-center gap-2 px-4 py-3 border-b-2 text-sm font-semibold transition-all whitespace-nowrap cursor-pointer relative ${
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

          <button
            onClick={() => setActiveTab('export')}
            className={`flex items-center gap-2 px-4 py-3 border-b-2 text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'export'
                ? 'border-[#212121] text-[#212121] font-bold'
                : 'border-transparent text-zinc-500 hover:text-[#212121]'
            }`}
          >
            <Github className="w-4 h-4" />
            <span>Export & GitHub Deploy</span>
          </button>
        </div>

        {/* Tab Content Display */}
        <div className="bg-white rounded-2xl border border-[#D8DFE9] p-6 sm:p-8 shadow-xs">
          {activeTab === 'spaces' && <AdminSpacesTab />}
          {activeTab === 'amenities' && <AdminAmenitiesTab />}
          {activeTab === 'blogs' && <AdminBlogsTab />}
          {activeTab === 'content' && <AdminContentTab />}
          {activeTab === 'enquiries' && <AdminEnquiriesTab />}
          {activeTab === 'export' && <AdminExportTab />}
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
