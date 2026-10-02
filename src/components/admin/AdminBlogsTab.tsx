import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { BlogPost } from '../../types';
import {
  Plus,
  Edit2,
  Trash2,
  Eye,
  ExternalLink,
  Search,
  Image as ImageIcon,
  Calendar,
  Clock,
  Tag,
  CheckCircle,
  FileText,
  Sparkles,
  ArrowRight,
  Globe,
  Share2,
} from 'lucide-react';

export const AdminBlogsTab: React.FC = () => {
  const { blogs, addBlog, updateBlog, deleteBlog, openBlogBySlug, showToast } = useData();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBlogId, setEditingBlogId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Form State
  const initialFormState: Omit<BlogPost, 'id'> = {
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    coverImageUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80',
    coverImageAlt: 'THE GRID Coworking Space Hilite Business Park Calicut',
    author: 'THE GRID Editorial',
    category: 'Calicut Business',
    tags: ['Coworking', 'Calicut', 'Hilite Park'],
    publishedAt: new Date().toISOString().slice(0, 10),
    readTime: '4 min read',
    isPublished: true,
    metaTitle: '',
    metaDescription: '',
  };

  const [formData, setFormData] = useState<Omit<BlogPost, 'id'>>(initialFormState);
  const [tagsInput, setTagsInput] = useState('Coworking, Calicut, Hilite Park');

  const categories = ['all', ...Array.from(new Set(blogs.map((b) => b.category)))];

  const handleOpenCreate = () => {
    setEditingBlogId(null);
    setFormData(initialFormState);
    setTagsInput('Coworking, Calicut, Hilite Park');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (blog: BlogPost) => {
    setEditingBlogId(blog.id);
    setFormData({
      title: blog.title,
      slug: blog.slug,
      excerpt: blog.excerpt,
      content: blog.content,
      coverImageUrl: blog.coverImageUrl,
      coverImageAlt: blog.coverImageAlt || '',
      author: blog.author,
      category: blog.category,
      tags: blog.tags,
      publishedAt: blog.publishedAt,
      readTime: blog.readTime,
      isPublished: blog.isPublished,
      metaTitle: blog.metaTitle || '',
      metaDescription: blog.metaDescription || '',
    });
    setTagsInput(blog.tags.join(', '));
    setIsModalOpen(true);
  };

  // Generate slug from title automatically if slug is untouched
  const handleTitleChange = (newTitle: string) => {
    const autoSlug = newTitle
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-');

    setFormData((prev) => ({
      ...prev,
      title: newTitle,
      // Auto-update slug if not previously customized or empty
      slug: !editingBlogId || prev.slug === '' ? autoSlug : prev.slug,
      metaTitle: prev.metaTitle || `${newTitle} | THE GRID Calicut`,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      showToast('Please provide an article title');
      return;
    }

    const processedTags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const cleanSlug = (formData.slug || formData.title)
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-');

    const payload = {
      ...formData,
      slug: cleanSlug,
      tags: processedTags.length > 0 ? processedTags : ['Coworking'],
      metaTitle: formData.metaTitle || `${formData.title} | THE GRID`,
      metaDescription: formData.metaDescription || formData.excerpt,
    };

    if (editingBlogId) {
      updateBlog(editingBlogId, payload);
    } else {
      addBlog(payload);
    }

    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    deleteBlog(id);
    setDeleteConfirmId(null);
  };

  const filteredBlogs = blogs.filter((b) => {
    const matchesSearch =
      b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory =
      selectedCategory === 'all' || b.category.toLowerCase() === selectedCategory.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#D8DFE9]">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-['Oxygen'] text-xl font-bold uppercase tracking-tight text-[#212121]">
              Blog & Article Management
            </h3>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#CFDECA] text-[#212121] font-bold">
              {blogs.length} Articles
            </span>
          </div>
          <p className="text-xs text-zinc-500 mt-1">
            Publish articles with link-based imagery for Hilite Business Park Calicut. Articles appear in the site footer.
          </p>
        </div>

        <button
          id="admin-create-blog-btn"
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#212121] hover:bg-[#333333] text-white text-xs font-bold transition-all shadow-sm cursor-pointer shrink-0 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 text-[#EFF0A3]" />
          <span>New Blog Article</span>
        </button>
      </div>

      {/* Filter & Search Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search blogs by title, keyword, or tag..."
            className="w-full bg-[#F6F5FA] border border-[#D8DFE9] rounded-xl pl-9 pr-3 py-2 text-xs text-[#212121] focus:outline-none focus:border-[#212121]"
          />
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-[11px] font-semibold transition-all whitespace-nowrap cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[#212121] text-white'
                  : 'bg-[#F6F5FA] text-zinc-600 hover:text-[#212121] border border-[#D8DFE9]'
              }`}
            >
              {cat === 'all' ? 'All Categories' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Blog Cards Grid */}
      {filteredBlogs.length === 0 ? (
        <div className="text-center py-16 bg-[#F6F5FA] rounded-2xl border border-dashed border-[#D8DFE9] p-8">
          <FileText className="w-8 h-8 text-zinc-400 mx-auto mb-2" />
          <p className="text-sm font-bold text-zinc-700">No blog posts found</p>
          <p className="text-xs text-zinc-500 mt-1">
            {searchQuery
              ? 'Try changing your search query or filters'
              : 'Click "New Blog Article" to create your first article!'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredBlogs.map((blog) => (
            <div
              key={blog.id}
              className="bg-[#F6F5FA] border border-[#D8DFE9] rounded-2xl overflow-hidden flex flex-col hover:border-[#212121] transition-all shadow-xs group"
            >
              {/* Cover Image Container (Link-Based) */}
              <div
                onClick={() => openBlogBySlug(blog.slug)}
                className="relative h-44 bg-zinc-200 overflow-hidden cursor-pointer"
                title="Click to read article"
              >
                <img
                  src={blog.coverImageUrl}
                  alt={blog.coverImageAlt || blog.title}
                  onError={(e) => {
                    // Fallback if image link fails
                    (e.target as HTMLImageElement).src =
                      'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80';
                  }}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 flex items-center gap-1.5">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#212121]/90 text-white backdrop-blur-xs">
                    {blog.category}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      blog.isPublished
                        ? 'bg-[#CFDECA] text-[#212121]'
                        : 'bg-amber-100 text-amber-900 border border-amber-300'
                    }`}
                  >
                    {blog.isPublished ? 'Published' : 'Draft'}
                  </span>
                </div>

                <div className="absolute bottom-3 right-3 text-[10px] font-semibold px-2 py-0.5 rounded bg-black/70 text-white backdrop-blur-xs flex items-center gap-1">
                  <Clock className="w-2.5 h-2.5" />
                  <span>{blog.readTime}</span>
                </div>
              </div>

              {/* Content Summary */}
              <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-[10px] text-zinc-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {blog.publishedAt}
                    </span>
                    <span>·</span>
                    <span>By {blog.author}</span>
                  </div>

                  <h4
                    onClick={() => openBlogBySlug(blog.slug)}
                    className="font-['Oxygen'] font-bold text-sm text-[#212121] leading-snug line-clamp-2 group-hover:text-black cursor-pointer hover:underline"
                    title="Click to read article"
                  >
                    {blog.title}
                  </h4>

                  <p className="text-xs text-zinc-500 line-clamp-2 leading-relaxed">
                    {blog.excerpt}
                  </p>

                  {/* Tag Chips */}
                  <div className="flex flex-wrap gap-1 pt-1">
                    {blog.tags.slice(0, 3).map((tag, idx) => (
                      <span
                        key={idx}
                        className="text-[9px] px-1.5 py-0.5 rounded bg-white text-zinc-600 border border-[#D8DFE9]"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Card Action Footer */}
                <div className="pt-3 border-t border-[#D8DFE9] flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      openBlogBySlug(blog.slug);
                    }}
                    className="text-xs font-bold text-[#212121] bg-[#EFF0A3]/50 hover:bg-[#EFF0A3] border border-[#DFE094] px-2.5 py-1 rounded-lg flex items-center gap-1.5 transition-all shadow-2xs hover:shadow-xs cursor-pointer active:scale-95"
                    title="Preview Live Reader View"
                  >
                    <Eye className="w-3.5 h-3.5 text-[#212121]" />
                    <span>Read</span>
                  </button>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEdit(blog)}
                      className="p-1.5 rounded-lg text-zinc-600 hover:text-black hover:bg-white transition-colors cursor-pointer"
                      title="Edit Article"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => setDeleteConfirmId(blog.id)}
                      className="p-1.5 rounded-lg text-zinc-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                      title="Delete Article"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full border border-[#D8DFE9] space-y-4 shadow-2xl">
            <h4 className="font-['Oxygen'] text-base font-bold text-[#212121]">
              Delete Blog Article?
            </h4>
            <p className="text-xs text-zinc-500 leading-relaxed">
              Are you sure you want to delete this article? You can always restore defaults from the settings menu or export a backup before deleting.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-3.5 py-1.5 rounded-full border border-[#D8DFE9] text-xs font-semibold text-zinc-700 hover:bg-zinc-100 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                className="px-4 py-1.5 rounded-full bg-red-600 hover:bg-red-700 text-white text-xs font-bold cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create / Edit Article Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-3xl w-full p-6 sm:p-8 space-y-5 border border-[#D8DFE9] shadow-2xl my-8 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-[#D8DFE9]">
              <div>
                <h4 className="font-['Oxygen'] text-lg font-bold text-[#212121] uppercase">
                  {editingBlogId ? 'Edit Blog Article' : 'Create New Blog Article'}
                </h4>
                <p className="text-xs text-zinc-500">
                  Fill in article details, link-based cover image, and metadata tags.
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-zinc-400 hover:text-[#212121] text-xs font-bold px-2.5 py-1 rounded-lg hover:bg-zinc-100 cursor-pointer"
              >
                ✕ Close
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Title */}
              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1">
                  Article Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="e.g., Why Hilite Business Park Phase 2 is Calicut's Tech Epicenter"
                  className="w-full bg-[#F6F5FA] border border-[#D8DFE9] rounded-xl px-3.5 py-2 text-xs font-semibold text-[#212121] focus:outline-none focus:border-[#212121]"
                />
              </div>

              {/* URL Slug & Category Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-700 mb-1">
                    URL Slug (Path)
                  </label>
                  <div className="flex items-center bg-[#F6F5FA] border border-[#D8DFE9] rounded-xl px-3 py-2 text-xs">
                    <span className="text-zinc-400 select-none">/blog/</span>
                    <input
                      type="text"
                      value={formData.slug}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-'),
                        }))
                      }
                      placeholder="custom-article-slug"
                      className="bg-transparent flex-1 text-[#212121] font-mono text-[11px] focus:outline-none ml-1"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-700 mb-1">
                    Category
                  </label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData((prev) => ({ ...prev, category: e.target.value }))}
                    placeholder="e.g., Calicut Business, Coworking, Business Setup"
                    className="w-full bg-[#F6F5FA] border border-[#D8DFE9] rounded-xl px-3.5 py-2 text-xs text-[#212121] focus:outline-none focus:border-[#212121]"
                  />
                </div>
              </div>

              {/* Cover Image URL (Link-Based as requested!) */}
              <div className="bg-[#F6F5FA] p-4 rounded-xl border border-[#D8DFE9] space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-zinc-800">
                    Cover Image URL (Link-Based) *
                  </label>
                  <span className="text-[10px] text-zinc-500">
                    Paste any public image link (Unsplash, PostImage, Imgur, Cloudinary)
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <ImageIcon className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="url"
                      required
                      value={formData.coverImageUrl}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, coverImageUrl: e.target.value }))
                      }
                      placeholder="https://images.unsplash.com/..."
                      className="w-full bg-white border border-[#D8DFE9] rounded-xl pl-8 pr-3 py-2 text-xs font-mono text-zinc-700 focus:outline-none focus:border-[#212121]"
                    />
                  </div>
                </div>

                {/* Quick Unsplash Preset Buttons for User Convenience */}
                <div className="flex flex-wrap items-center gap-2 text-[10px]">
                  <span className="text-zinc-500 font-medium">Quick link presets:</span>
                  <button
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        coverImageUrl:
                          'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80',
                      }))
                    }
                    className="px-2 py-0.5 rounded bg-white border border-zinc-300 hover:border-black cursor-pointer text-zinc-700"
                  >
                    Office Interior
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        coverImageUrl:
                          'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
                      }))
                    }
                    className="px-2 py-0.5 rounded bg-white border border-zinc-300 hover:border-black cursor-pointer text-zinc-700"
                  >
                    Modern Tower
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        coverImageUrl:
                          'https://images.unsplash.com/photo-1527192491265-7e15c55b1ed2?auto=format&fit=crop&w=1200&q=80',
                      }))
                    }
                    className="px-2 py-0.5 rounded bg-white border border-zinc-300 hover:border-black cursor-pointer text-zinc-700"
                  >
                    Coworking Desks
                  </button>
                </div>

                {/* Image Live Preview */}
                {formData.coverImageUrl && (
                  <div className="mt-2 flex items-center gap-3 p-2 bg-white rounded-lg border border-[#D8DFE9]">
                    <img
                      src={formData.coverImageUrl}
                      alt="Preview"
                      className="w-20 h-14 object-cover rounded-md bg-zinc-100 shrink-0"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                    <div className="text-[11px] text-zinc-500">
                      <span className="font-semibold text-[#212121] block">Image Link Active</span>
                      <span>This image will be rendered directly via its link without database storage.</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Author, Read Time, Published Date */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-zinc-700 mb-1">Author</label>
                  <input
                    type="text"
                    value={formData.author}
                    onChange={(e) => setFormData((prev) => ({ ...prev, author: e.target.value }))}
                    className="w-full bg-[#F6F5FA] border border-[#D8DFE9] rounded-xl px-3 py-2 text-xs text-[#212121] focus:outline-none focus:border-[#212121]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-700 mb-1">Read Time</label>
                  <input
                    type="text"
                    value={formData.readTime}
                    onChange={(e) => setFormData((prev) => ({ ...prev, readTime: e.target.value }))}
                    placeholder="e.g. 4 min read"
                    className="w-full bg-[#F6F5FA] border border-[#D8DFE9] rounded-xl px-3 py-2 text-xs text-[#212121] focus:outline-none focus:border-[#212121]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-700 mb-1">Publish Date</label>
                  <input
                    type="date"
                    value={formData.publishedAt}
                    onChange={(e) => setFormData((prev) => ({ ...prev, publishedAt: e.target.value }))}
                    className="w-full bg-[#F6F5FA] border border-[#D8DFE9] rounded-xl px-3 py-2 text-xs text-[#212121] focus:outline-none focus:border-[#212121]"
                  />
                </div>
              </div>

              {/* Tags */}
              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1">
                  Tags (Comma separated)
                </label>
                <input
                  type="text"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  placeholder="Coworking, Calicut, Startups, Private Cabins"
                  className="w-full bg-[#F6F5FA] border border-[#D8DFE9] rounded-xl px-3.5 py-2 text-xs text-[#212121] focus:outline-none focus:border-[#212121]"
                />
              </div>

              {/* Excerpt */}
              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1">
                  Excerpt / Brief Summary * (Shown in card listings & Google Snippets)
                </label>
                <textarea
                  rows={2}
                  required
                  value={formData.excerpt}
                  onChange={(e) => setFormData((prev) => ({ ...prev, excerpt: e.target.value }))}
                  placeholder="A concise 2-sentence overview of the article..."
                  className="w-full bg-[#F6F5FA] border border-[#D8DFE9] rounded-xl p-3 text-xs text-[#212121] focus:outline-none focus:border-[#212121]"
                />
              </div>

              {/* Full Content */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-zinc-700">
                    Article Full Content *
                  </label>
                  <span className="text-[10px] text-zinc-400 font-mono">
                    Markdown supported (### Subheading, **bold**, - lists)
                  </span>
                </div>
                <textarea
                  rows={8}
                  required
                  value={formData.content}
                  onChange={(e) => setFormData((prev) => ({ ...prev, content: e.target.value }))}
                  placeholder="Write or paste your article content here..."
                  className="w-full bg-[#F6F5FA] border border-[#D8DFE9] rounded-xl p-3 text-xs font-sans leading-relaxed text-[#212121] focus:outline-none focus:border-[#212121]"
                />
              </div>

              {/* Search & Social Meta Title & Description */}
              <div className="p-4 bg-[#F6F5FA] rounded-xl border border-[#D8DFE9] space-y-3">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#212121]">
                  <Globe className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Search & Social Meta Tags</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-zinc-600 mb-1">
                      Meta Title Tag
                    </label>
                    <input
                      type="text"
                      value={formData.metaTitle}
                      onChange={(e) => setFormData((prev) => ({ ...prev, metaTitle: e.target.value }))}
                      placeholder="Title tag displayed on Google SERP"
                      className="w-full bg-white border border-[#D8DFE9] rounded-lg px-3 py-1.5 text-xs text-[#212121] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-zinc-600 mb-1">
                      Meta Description Tag
                    </label>
                    <input
                      type="text"
                      value={formData.metaDescription}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, metaDescription: e.target.value }))
                      }
                      placeholder="150-160 char snippet for search results"
                      className="w-full bg-white border border-[#D8DFE9] rounded-lg px-3 py-1.5 text-xs text-[#212121] focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Status Toggle & Submit */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-[#D8DFE9]">
                <label className="flex items-center gap-2 text-xs font-semibold text-zinc-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isPublished}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, isPublished: e.target.checked }))
                    }
                    className="w-4 h-4 rounded text-black border-zinc-300 focus:ring-0"
                  />
                  <span>Publish immediately to live website</span>
                </label>

                <div className="flex items-center gap-2 self-end sm:self-auto">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 rounded-full border border-[#D8DFE9] text-xs font-semibold text-zinc-700 hover:bg-zinc-100 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-full bg-[#212121] hover:bg-[#333333] text-white text-xs font-bold transition-all shadow-sm cursor-pointer flex items-center gap-1.5"
                  >
                    <CheckCircle className="w-4 h-4 text-[#EFF0A3]" />
                    <span>{editingBlogId ? 'Save Changes' : 'Create Article'}</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
