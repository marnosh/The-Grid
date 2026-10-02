import React, { useState, useEffect } from 'react';
import { useData } from '../context/DataContext';
import { BlogPost } from '../types';
import {
  X,
  Calendar,
  Clock,
  User,
  Share2,
  ArrowLeft,
  ArrowRight,
  Check,
  Search,
  BookOpen,
  Sparkles,
  ExternalLink,
  ChevronRight,
  Phone,
} from 'lucide-react';
import { WhatsAppIcon } from './WhatsAppIcon';
import { BrandLogo } from './BrandLogo';

export const BlogViewer: React.FC = () => {
  const {
    blogs,
    isBlogViewerOpen,
    setIsBlogViewerOpen,
    selectedBlogSlug,
    setSelectedBlogSlug,
    openBlogBySlug,
    siteConfig,
    showToast,
    isAdminView,
  } = useData();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [copiedLink, setCopiedLink] = useState(false);

  // Sync with browser URL hash e.g. #blog or #blog/slug
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash;
      if (hash.startsWith('#blog')) {
        const parts = hash.split('/');
        if (parts.length > 1 && parts[1]) {
          setSelectedBlogSlug(parts[1]);
        } else {
          setSelectedBlogSlug(null);
        }
        setIsBlogViewerOpen(true);
      }
    };

    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, [setSelectedBlogSlug, setIsBlogViewerOpen]);

  // Find currently active blog (allow draft preview if in admin view)
  const activeBlog: BlogPost | undefined = blogs.find(
    (b) => b.slug === selectedBlogSlug && (b.isPublished || isAdminView)
  );

  // Update SEO meta title and schema when reading a blog
  useEffect(() => {
    if (activeBlog) {
      const prevTitle = document.title;
      document.title = activeBlog.metaTitle || `${activeBlog.title} | THE GRID Calicut`;

      // Inject JSON-LD Schema for BlogPosting
      const scriptId = 'blog-jsonld-schema';
      let script = document.getElementById(scriptId) as HTMLScriptElement | null;
      if (!script) {
        script = document.createElement('script');
        script.id = scriptId;
        script.type = 'application/ld+json';
        document.head.appendChild(script);
      }
      script.text = JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: activeBlog.title,
        description: activeBlog.excerpt,
        image: activeBlog.coverImageUrl,
        author: {
          '@type': 'Organization',
          name: activeBlog.author,
        },
        publisher: {
          '@type': 'Organization',
          name: 'THE GRID Coworking Calicut',
          logo: {
            '@type': 'ImageObject',
            url: window.location.origin + '/grid-logo.png',
          },
        },
        datePublished: activeBlog.publishedAt,
      });

      return () => {
        document.title = prevTitle;
        const s = document.getElementById(scriptId);
        if (s) s.remove();
      };
    }
  }, [activeBlog]);

  if (!isBlogViewerOpen) return null;

  const publishedBlogs = blogs.filter((b) => b.isPublished);
  const categories = ['all', ...Array.from(new Set(publishedBlogs.map((b) => b.category)))];

  const filteredBlogs = publishedBlogs.filter((b) => {
    const matchesSearch =
      b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory =
      selectedCategory === 'all' || b.category.toLowerCase() === selectedCategory.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  const handleShare = () => {
    const url = `${window.location.origin}/#blog/${activeBlog?.slug || ''}`;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    showToast('Article link copied to clipboard');
    setTimeout(() => setCopiedLink(false), 3000);
  };

  const handleClose = () => {
    setIsBlogViewerOpen(false);
    setSelectedBlogSlug(null);
    if (window.location.hash.startsWith('#blog')) {
      window.history.replaceState(null, '', window.location.pathname + window.location.search);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex flex-col justify-between overflow-y-auto animate-in fade-in duration-200">
      {/* Top Fixed Header */}
      <header className="sticky top-0 z-20 bg-[#212121] border-b border-zinc-800 px-4 sm:px-8 py-3.5 text-white flex items-center justify-between">
        <div className="flex items-center gap-3">
          <BrandLogo size="sm" darkTheme={true} />
          <div className="hidden sm:block h-5 w-px bg-zinc-700" />
          <div className="flex items-center gap-2">
            <span className="font-['Oxygen'] text-xs uppercase tracking-wider text-[#EFF0A3] font-bold">
              Blogs & Insights
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300 font-mono">
              Hilite Business Park, Calicut
            </span>
            {isAdminView && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#EFF0A3] text-[#212121] font-bold uppercase tracking-wider">
                Admin Preview Mode
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {activeBlog && (
            <button
              onClick={() => setSelectedBlogSlug(null)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-zinc-200 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>All Articles</span>
            </button>
          )}

          <button
            onClick={handleClose}
            className="p-2 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeBlog ? (
          /* Single Article Reader View */
          <article className="bg-white rounded-2xl border border-[#D8DFE9] overflow-hidden shadow-2xl space-y-6 animate-in slide-in-from-bottom-3 duration-300">
            {/* Hero Cover Image (Link-based!) */}
            <div className="relative h-64 sm:h-96 w-full bg-zinc-900 overflow-hidden">
              <img
                src={activeBlog.coverImageUrl}
                alt={activeBlog.coverImageAlt || activeBlog.title}
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80';
                }}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              
              <div className="absolute top-4 left-4 flex flex-wrap items-center gap-2">
                <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-[#212121] text-white backdrop-blur-md">
                  {activeBlog.category}
                </span>
                <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-black/60 text-zinc-200 backdrop-blur-md flex items-center gap-1">
                  <Clock className="w-3 h-3 text-[#EFF0A3]" />
                  {activeBlog.readTime}
                </span>
              </div>

              <div className="absolute bottom-6 left-6 right-6 text-white space-y-2">
                <div className="flex items-center gap-2 text-xs text-zinc-300">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {activeBlog.publishedAt}
                  </span>
                  <span>·</span>
                  <span>By {activeBlog.author}</span>
                </div>
                <h1 className="font-['Oxygen'] text-2xl sm:text-4xl font-bold uppercase tracking-tight text-white leading-tight">
                  {activeBlog.title}
                </h1>
              </div>
            </div>

            {/* Article Body */}
            <div className="px-6 sm:px-12 py-6 max-w-3xl mx-auto space-y-8 text-[#212121]">
              {/* Excerpt Lead Box */}
              <div className="p-5 rounded-xl bg-[#F6F5FA] border-l-4 border-[#212121] text-sm sm:text-base font-medium text-zinc-700 leading-relaxed italic">
                "{activeBlog.excerpt}"
              </div>

              {/* Share & Byline Bar */}
              <div className="flex items-center justify-between py-3 border-y border-[#D8DFE9] text-xs text-zinc-500">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-[#212121] text-white font-bold flex items-center justify-center text-xs">
                    G
                  </div>
                  <div>
                    <span className="font-bold text-[#212121] block">{activeBlog.author}</span>
                    <span className="text-[10px]">1st Floor, Phase 2, Hilite Business Park</span>
                  </div>
                </div>

                <button
                  onClick={handleShare}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#F6F5FA] hover:bg-zinc-200 border border-[#D8DFE9] text-zinc-700 text-xs font-semibold transition-colors cursor-pointer"
                >
                  {copiedLink ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Copied URL!</span>
                    </>
                  ) : (
                    <>
                      <Share2 className="w-3.5 h-3.5" />
                      <span>Share Article</span>
                    </>
                  )}
                </button>
              </div>

              {/* Formatted Article Content */}
              <div className="prose prose-zinc max-w-none space-y-5 text-sm sm:text-base leading-relaxed text-zinc-800">
                {activeBlog.content.split('\n\n').map((paragraph, idx) => {
                  if (paragraph.startsWith('### ')) {
                    return (
                      <h3
                        key={idx}
                        className="font-['Oxygen'] text-lg sm:text-xl font-bold uppercase text-[#212121] pt-4 tracking-tight"
                      >
                        {paragraph.replace('### ', '')}
                      </h3>
                    );
                  }
                  if (paragraph.startsWith('## ')) {
                    return (
                      <h2
                        key={idx}
                        className="font-['Oxygen'] text-xl sm:text-2xl font-bold uppercase text-[#212121] pt-6 tracking-tight border-b border-[#D8DFE9] pb-2"
                      >
                        {paragraph.replace('## ', '')}
                      </h2>
                    );
                  }
                  if (paragraph.startsWith('- ')) {
                    const items = paragraph.split('\n');
                    return (
                      <ul key={idx} className="space-y-1.5 my-3 list-disc pl-5 text-zinc-700">
                        {items.map((it, iIdx) => (
                          <li key={iIdx}>{it.replace('- ', '')}</li>
                        ))}
                      </ul>
                    );
                  }
                  return (
                    <p key={idx} className="text-zinc-700 leading-relaxed font-sans">
                      {paragraph}
                    </p>
                  );
                })}
              </div>

              {/* Tags Strip */}
              <div className="pt-6 border-t border-[#D8DFE9] flex flex-wrap items-center gap-1.5">
                <span className="text-xs font-semibold text-zinc-400 mr-2">Tags:</span>
                {activeBlog.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="text-xs px-2.5 py-1 rounded-full bg-[#F6F5FA] text-zinc-700 border border-[#D8DFE9] font-medium"
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              {/* Bottom Conversion CTA Strip */}
              <div className="mt-8 rounded-2xl bg-[#212121] text-white p-6 sm:p-8 space-y-4 shadow-xl">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#EFF0A3] block">
                  Work in Calicut's Premier Coworking Space
                </span>
                <h4 className="font-['Oxygen'] text-xl sm:text-2xl font-bold uppercase tracking-tight text-white">
                  Visit THE GRID on 1st Floor, Phase 2, Hilite Business Park
                </h4>
                <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed max-w-xl">
                  Workstations from ₹3,500/mo, lockable private cabins, conference suites, and ₹999/mo virtual office addresses. Walk in today for a personal walkthrough.
                </p>

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <a
                    href={`https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(
                      `Hi, I read your article "${activeBlog.title}" and would like to schedule a tour of THE GRID at Hilite Business Park.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#CFDECA] hover:bg-[#b8cbb3] text-[#212121] text-xs font-bold transition-all shadow-md active:scale-95 cursor-pointer"
                  >
                    <WhatsAppIcon className="w-4 h-4 text-[#212121]" />
                    <span>WhatsApp Community Manager</span>
                  </a>

                  <a
                    href={`tel:${siteConfig.phone}`}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-white hover:bg-zinc-100 text-[#212121] text-xs font-bold transition-all cursor-pointer"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>{siteConfig.phoneFormatted}</span>
                  </a>
                </div>
              </div>
            </div>
          </article>
        ) : (
          /* All Blogs Index View */
          <div className="space-y-6">
            {/* Header Banner */}
            <div className="text-center max-w-2xl mx-auto space-y-3 py-6">
              <span className="text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-[#EFF0A3] text-[#212121] inline-block font-['Oxygen']">
                THE GRID Calicut · Knowledge Base
              </span>
              <h2 className="font-['Oxygen'] text-3xl sm:text-4xl font-bold uppercase text-white tracking-tight">
                Insights, Guides & Calicut Tech News
              </h2>
              <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                Expert insights on coworking, virtual office compliance, productivity, and startup growth at Hilite Business Park Phase 2.
              </p>
            </div>

            {/* Filter & Search Bar */}
            <div className="bg-[#212121] p-4 rounded-2xl border border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="relative flex-1 w-full sm:max-w-md">
                <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search articles by title, topic, or keyword..."
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#EFF0A3]"
                />
              </div>

              <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                      selectedCategory === cat
                        ? 'bg-[#EFF0A3] text-[#212121] font-bold'
                        : 'bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-700'
                    }`}
                  >
                    {cat === 'all' ? 'All Topics' : cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Articles Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredBlogs.map((blog) => (
                <div
                  key={blog.id}
                  onClick={() => openBlogBySlug(blog.slug)}
                  className="bg-white rounded-2xl border border-zinc-800 overflow-hidden flex flex-col justify-between hover:border-[#EFF0A3] hover:shadow-xl transition-all cursor-pointer group"
                >
                  <div>
                    {/* Image Cover */}
                    <div className="relative h-48 bg-zinc-800 overflow-hidden">
                      <img
                        src={blog.coverImageUrl}
                        alt={blog.coverImageAlt || blog.title}
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80';
                        }}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 left-3">
                        <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-[#212121]/90 text-white backdrop-blur-xs">
                          {blog.category}
                        </span>
                      </div>
                      <div className="absolute bottom-3 right-3 text-[10px] font-semibold px-2 py-0.5 rounded bg-black/70 text-white backdrop-blur-xs flex items-center gap-1">
                        <Clock className="w-2.5 h-2.5" />
                        <span>{blog.readTime}</span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-5 space-y-2.5">
                      <div className="flex items-center gap-2 text-[10px] text-zinc-400">
                        <span>{blog.publishedAt}</span>
                        <span>·</span>
                        <span>{blog.author}</span>
                      </div>

                      <h3 className="font-['Oxygen'] text-base font-bold text-[#212121] leading-snug line-clamp-2 group-hover:text-black">
                        {blog.title}
                      </h3>

                      <p className="text-xs text-zinc-500 line-clamp-2 leading-relaxed">
                        {blog.excerpt}
                      </p>
                    </div>
                  </div>

                  <div className="px-5 pb-5 pt-2 border-t border-zinc-100 flex items-center justify-between text-xs font-bold text-[#212121] group-hover:text-black">
                    <span>Read Article</span>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
