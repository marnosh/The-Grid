import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import {
  Download,
  Copy,
  Check,
  Upload,
  FileCode2,
  Github,
  Terminal,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
  FileJson,
  Sparkles,
  Info,
} from 'lucide-react';

export const AdminExportTab: React.FC = () => {
  const {
    exportDefaultContentTs,
    exportJSON,
    importJSON,
    spaces,
    amenities,
    blogs,
    siteConfig,
    showToast,
    resetToDefaults,
  } = useData();

  const [copiedCode, setCopiedCode] = useState(false);
  const [importJsonText, setImportJsonText] = useState('');
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [activePreviewTab, setActivePreviewTab] = useState<'ts' | 'json'>('ts');

  const tsCode = exportDefaultContentTs();
  const jsonCode = exportJSON();

  const handleDownloadTs = () => {
    const blob = new Blob([tsCode], { type: 'text/typescript' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'defaultContent.ts';
    a.click();
    URL.revokeObjectURL(url);
    showToast('Downloaded defaultContent.ts for GitHub deployment');
  };

  const handleCopyTs = () => {
    navigator.clipboard.writeText(tsCode);
    setCopiedCode(true);
    showToast('Copied defaultContent.ts code to clipboard');
    setTimeout(() => setCopiedCode(false), 3000);
  };

  const handleDownloadJson = () => {
    const blob = new Blob([jsonCode], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `thegrid_backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Downloaded JSON backup file');
  };

  const handleImportSubmit = () => {
    if (!importJsonText.trim()) return;
    const success = importJSON(importJsonText);
    if (success) {
      setIsImportModalOpen(false);
      setImportJsonText('');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        importJSON(content);
        setIsImportModalOpen(false);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-8">
      {/* Tab Header */}
      <div className="pb-4 border-b border-[#D8DFE9]">
        <div className="flex items-center gap-2">
          <h3 className="font-['Oxygen'] text-xl font-bold uppercase tracking-tight text-[#212121]">
            File-Based Export & GitHub Deployment
          </h3>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#CFDECA] text-[#212121] font-bold">
            Zero-Database Workflow
          </span>
        </div>
        <p className="text-xs text-zinc-500 mt-1">
          Export your latest workspaces, amenities, site text, and blogs directly into code. Download the file, replace it in your GitHub repository, and Vercel automatically updates your live site!
        </p>
      </div>

      {/* 3-Step GitHub Deployment Walkthrough Banner */}
      <div className="bg-[#212121] text-white p-6 sm:p-7 rounded-2xl border border-zinc-800 shadow-lg space-y-5">
        <div className="flex items-center gap-2 text-xs font-bold text-[#EFF0A3] uppercase tracking-wider">
          <Github className="w-4 h-4" />
          <span>How to Push Admin Updates to Live Site via GitHub</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-zinc-900/90 border border-zinc-800 p-4 rounded-xl space-y-2">
            <div className="w-6 h-6 rounded-full bg-[#EFF0A3] text-[#212121] font-bold text-xs flex items-center justify-center">
              1
            </div>
            <h5 className="font-['Oxygen'] text-xs font-bold uppercase text-white">
              Download File
            </h5>
            <p className="text-[11px] text-zinc-400 leading-relaxed">
              Click the black <strong className="text-white">"Download defaultContent.ts"</strong> button below. It contains all your latest changes.
            </p>
          </div>

          <div className="bg-zinc-900/90 border border-zinc-800 p-4 rounded-xl space-y-2">
            <div className="w-6 h-6 rounded-full bg-[#CFDECA] text-[#212121] font-bold text-xs flex items-center justify-center">
              2
            </div>
            <h5 className="font-['Oxygen'] text-xs font-bold uppercase text-white">
              Replace in GitHub Repo
            </h5>
            <p className="text-[11px] text-zinc-400 leading-relaxed">
              In your GitHub repo, go to <code className="text-[#EFF0A3] bg-black px-1 py-0.5 rounded">src/data/defaultContent.ts</code>, upload the file, and commit.
            </p>
          </div>

          <div className="bg-zinc-900/90 border border-zinc-800 p-4 rounded-xl space-y-2">
            <div className="w-6 h-6 rounded-full bg-white text-[#212121] font-bold text-xs flex items-center justify-center">
              3
            </div>
            <h5 className="font-['Oxygen'] text-xs font-bold uppercase text-white">
              Instant Live Deploy
            </h5>
            <p className="text-[11px] text-zinc-400 leading-relaxed">
              Vercel automatically detects the commit, runs the build, and publishes your updates to all site visitors in 30 seconds!
            </p>
          </div>
        </div>
      </div>

      {/* Main Action Download Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Card 1: TypeScript Code for GitHub */}
        <div className="bg-[#F6F5FA] border border-[#D8DFE9] rounded-2xl p-6 flex flex-col justify-between space-y-4 hover:border-[#212121] transition-all">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-[#212121] text-[#EFF0A3] flex items-center justify-center">
                <FileCode2 className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                Recommended for Vercel
              </span>
            </div>
            <h4 className="font-['Oxygen'] font-bold text-base text-[#212121]">
              Download defaultContent.ts
            </h4>
            <p className="text-xs text-zinc-500 leading-relaxed">
              This single file holds all current spaces ({spaces.length}), amenities ({amenities.length}), blog posts ({blogs.length}), and site configuration. Ready to commit into <code className="font-mono text-[#212121] font-semibold">src/data/defaultContent.ts</code>.
            </p>
          </div>

          <div className="pt-2 flex flex-wrap items-center gap-2">
            <button
              onClick={handleDownloadTs}
              className="flex-1 min-w-[160px] inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-full bg-[#212121] hover:bg-[#333333] text-white text-xs font-bold transition-all shadow-sm cursor-pointer"
            >
              <Download className="w-4 h-4 text-[#EFF0A3]" />
              <span>Download defaultContent.ts</span>
            </button>

            <button
              onClick={handleCopyTs}
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-full bg-white hover:bg-zinc-100 text-zinc-800 text-xs font-semibold border border-[#D8DFE9] transition-all cursor-pointer"
            >
              {copiedCode ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-zinc-500" />
                  <span>Copy Code</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Card 2: JSON Backup & Restore */}
        <div className="bg-[#F6F5FA] border border-[#D8DFE9] rounded-2xl p-6 flex flex-col justify-between space-y-4 hover:border-[#212121] transition-all">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-zinc-200 text-[#212121] flex items-center justify-center">
                <FileJson className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-zinc-200 text-zinc-700">
                Browser Data Backup
              </span>
            </div>
            <h4 className="font-['Oxygen'] font-bold text-base text-[#212121]">
              JSON Backup & Restore
            </h4>
            <p className="text-xs text-zinc-500 leading-relaxed">
              Export raw JSON backup to archive your settings or import previously exported JSON data to migrate data to another computer or browser.
            </p>
          </div>

          <div className="pt-2 flex flex-wrap items-center gap-2">
            <button
              onClick={handleDownloadJson}
              className="flex-1 min-w-[140px] inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-full bg-white hover:bg-zinc-100 text-zinc-800 text-xs font-bold border border-[#D8DFE9] transition-all cursor-pointer"
            >
              <Download className="w-4 h-4 text-[#212121]" />
              <span>Export JSON</span>
            </button>

            <button
              onClick={() => setIsImportModalOpen(true)}
              className="flex-1 min-w-[140px] inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-full bg-[#CFDECA] hover:bg-[#b8cbb3] text-[#212121] text-xs font-bold transition-all cursor-pointer"
            >
              <Upload className="w-4 h-4 text-[#212121]" />
              <span>Import JSON</span>
            </button>
          </div>
        </div>
      </div>

      {/* Code Inspector / Preview */}
      <div className="bg-[#F6F5FA] border border-[#D8DFE9] rounded-2xl p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h4 className="font-['Oxygen'] text-sm font-bold text-[#212121] uppercase">
              Generated Code Preview
            </h4>
            <p className="text-[11px] text-zinc-500">
              Live inspection of the compiled code that will be exported.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActivePreviewTab('ts')}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                activePreviewTab === 'ts'
                  ? 'bg-[#212121] text-white'
                  : 'bg-white text-zinc-600 border border-[#D8DFE9]'
              }`}
            >
              defaultContent.ts
            </button>
            <button
              onClick={() => setActivePreviewTab('json')}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                activePreviewTab === 'json'
                  ? 'bg-[#212121] text-white'
                  : 'bg-white text-zinc-600 border border-[#D8DFE9]'
              }`}
            >
              site_backup.json
            </button>
          </div>
        </div>

        <div className="relative">
          <pre className="bg-[#181818] text-zinc-300 font-mono text-xs p-4 rounded-xl max-h-72 overflow-y-auto overflow-x-auto leading-relaxed border border-zinc-800 selection:bg-zinc-700">
            {activePreviewTab === 'ts' ? tsCode : jsonCode}
          </pre>
          <button
            onClick={() => {
              navigator.clipboard.writeText(activePreviewTab === 'ts' ? tsCode : jsonCode);
              showToast('Code copied to clipboard');
            }}
            className="absolute top-3 right-3 p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-semibold border border-zinc-700 cursor-pointer"
            title="Copy snippet"
          >
            <Copy className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* JSON Import Modal */}
      {isImportModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#D8DFE9] rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-2 border-b border-[#D8DFE9]">
              <h4 className="font-['Oxygen'] text-base font-bold uppercase text-[#212121]">
                Import Backup JSON
              </h4>
              <button
                onClick={() => setIsImportModalOpen(false)}
                className="text-xs text-zinc-400 hover:text-black cursor-pointer"
              >
                ✕ Close
              </button>
            </div>

            <p className="text-xs text-zinc-500 leading-relaxed">
              Upload an exported JSON file or paste the JSON content below to restore all spaces, amenities, blogs, and settings.
            </p>

            {/* File Upload Button */}
            <div className="p-4 rounded-xl border border-dashed border-[#D8DFE9] bg-[#F6F5FA] text-center space-y-2">
              <Upload className="w-5 h-5 text-zinc-400 mx-auto" />
              <div className="text-xs text-zinc-600">
                <label className="font-bold text-[#212121] underline cursor-pointer hover:text-black">
                  Choose a JSON file
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>{' '}
                from your computer
              </div>
            </div>

            <div className="relative flex py-1 items-center">
              <div className="flex-grow border-t border-zinc-200"></div>
              <span className="flex-shrink mx-3 text-[10px] uppercase font-bold text-zinc-400">Or paste JSON</span>
              <div className="flex-grow border-t border-zinc-200"></div>
            </div>

            <textarea
              rows={6}
              value={importJsonText}
              onChange={(e) => setImportJsonText(e.target.value)}
              placeholder="Paste JSON content here..."
              className="w-full bg-[#F6F5FA] border border-[#D8DFE9] rounded-xl p-3 text-xs text-[#212121] font-mono focus:outline-none focus:border-[#212121]"
            />

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setIsImportModalOpen(false)}
                className="px-4 py-2 rounded-full border border-[#D8DFE9] text-xs font-semibold text-zinc-700 hover:bg-zinc-100 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleImportSubmit}
                className="px-5 py-2 rounded-full bg-[#212121] hover:bg-[#333333] text-white text-xs font-bold cursor-pointer"
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
