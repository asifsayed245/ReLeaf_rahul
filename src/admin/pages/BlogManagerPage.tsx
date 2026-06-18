import { useState, useEffect, useMemo } from 'react'
import { Plus, Search, Edit3, Trash2, X, Eye, Save } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import { fetchBlogs, addBlog, updateBlog, deleteBlog, type BlogPost } from '../api/sheetsApi'

const CATEGORIES = ['Recovery', 'Understanding', 'Practical', 'Stories', 'Wellness', 'General']

function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

interface BlogFormData {
  slug: string
  title: string
  excerpt: string
  date: string
  readTime: string
  category: string
  content: string
  status: string
}

const emptyForm: BlogFormData = {
  slug: '', title: '', excerpt: '',
  date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
  readTime: '3 min read', category: 'General', content: '', status: 'published',
}

export default function BlogManagerPage() {
  const [blogs, setBlogs] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterCat, setFilterCat] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingSlug, setEditingSlug] = useState<string | null>(null)
  const [form, setForm] = useState<BlogFormData>(emptyForm)
  const [saving, setSaving] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [toast, setToast] = useState<{ type: string; message: string } | null>(null)

  const load = async () => {
    setLoading(true)
    const data = await fetchBlogs()
    setBlogs(data)
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const showToast = (type: string, message: string) => {
    setToast({ type, message })
    setTimeout(() => setToast(null), 3000)
  }

  const filtered = useMemo(() => {
    return blogs.filter(b => {
      const matchSearch = !searchQuery ||
        b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
      const matchCat = !filterCat || b.category === filterCat
      return matchSearch && matchCat
    })
  }, [blogs, searchQuery, filterCat])

  const openAdd = () => {
    setForm(emptyForm)
    setEditingSlug(null)
    setShowPreview(false)
    setShowModal(true)
  }

  const openEdit = (blog: BlogPost) => {
    setForm({
      slug: blog.slug, title: blog.title, excerpt: blog.excerpt,
      date: blog.date, readTime: blog.readTime, category: blog.category,
      content: blog.content, status: blog.status || 'published',
    })
    setEditingSlug(blog.slug)
    setShowPreview(false)
    setShowModal(true)
  }

  const handleSave = async () => {
    if (!form.title.trim() || !form.content.trim()) return
    setSaving(true)

    const blogData: BlogPost = {
      ...form,
      slug: form.slug || slugify(form.title),
    }

    const result = editingSlug
      ? await updateBlog(blogData)
      : await addBlog(blogData)

    if (result.success) {
      showToast('success', editingSlug ? 'Blog updated!' : 'Blog published!')
      setShowModal(false)
      await load()
    } else {
      showToast('error', result.error || 'Failed to save')
    }
    setSaving(false)
  }

  const handleDelete = async (slug: string) => {
    const result = await deleteBlog(slug)
    if (result.success) {
      showToast('success', 'Blog deleted')
      setDeleteConfirm(null)
      await load()
    } else {
      showToast('error', result.error || 'Failed to delete')
    }
  }

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1, minWidth: 200 }}>
          <div style={{ position: 'relative', flex: 1, maxWidth: 320 }}>
            <Search size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--admin-text-dim)' }} />
            <input
              type="text" placeholder="Search blogs..."
              value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
              className="admin-input" style={{ paddingLeft: '2.25rem' }}
            />
          </div>
          <select
            value={filterCat} onChange={e => setFilterCat(e.target.value)}
            className="admin-input admin-select" style={{ width: 'auto', minWidth: 140 }}
          >
            <option value="">All Categories</option>
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <button onClick={openAdd} className="admin-btn admin-btn-primary">
          <Plus size={16} /> New Blog
        </button>
      </div>

      {/* Blog list */}
      <div className="admin-card" style={{ padding: 0, overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {[1, 2, 3, 4].map(i => <div key={i} className="admin-skeleton" style={{ height: 52 }} />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="admin-empty">
            <p>{searchQuery || filterCat ? 'No blogs match your filters' : 'No blogs yet. Create your first one!'}</p>
          </div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Category</th>
                <th>Date</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(blog => (
                <tr key={blog.slug}>
                  <td>
                    <div style={{ fontWeight: 500 }}>
                      {blog.title.length > 55 ? blog.title.slice(0, 55) + '...' : blog.title}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--admin-text-dim)', marginTop: '0.15rem' }}>/{blog.slug}</div>
                  </td>
                  <td><span className="admin-badge admin-badge-green">{blog.category}</span></td>
                  <td style={{ fontSize: '0.8rem', color: 'var(--admin-text-muted)' }}>{blog.date}</td>
                  <td>
                    <span className={`admin-badge ${blog.status === 'draft' ? 'admin-badge-amber' : 'admin-badge-green'}`}>
                      {blog.status || 'published'}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '0.35rem', justifyContent: 'flex-end' }}>
                      <button onClick={() => openEdit(blog)} className="admin-btn admin-btn-ghost" style={{ padding: '0.35rem' }}>
                        <Edit3 size={15} />
                      </button>
                      <button onClick={() => setDeleteConfirm(blog.slug)} className="admin-btn admin-btn-ghost" style={{ padding: '0.35rem', color: 'var(--admin-danger)' }}>
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <p style={{ fontSize: '0.7rem', color: 'var(--admin-text-dim)', marginTop: '0.75rem' }}>
        {filtered.length} blog{filtered.length !== 1 ? 's' : ''} total
      </p>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="admin-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="admin-modal" style={{ maxWidth: 800 }} onClick={e => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h2>{editingSlug ? 'Edit Blog Post' : 'New Blog Post'}</h2>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button onClick={() => setShowPreview(!showPreview)} className="admin-btn admin-btn-ghost" style={{ fontSize: '0.75rem' }}>
                  <Eye size={14} /> {showPreview ? 'Editor' : 'Preview'}
                </button>
                <button onClick={() => setShowModal(false)} className="admin-btn admin-btn-ghost" style={{ padding: '0.35rem' }}>
                  <X size={18} />
                </button>
              </div>
            </div>
            <div className="admin-modal-body">
              {showPreview ? (
                <div style={{ background: 'var(--admin-bg)', borderRadius: 8, padding: '1.5rem', maxHeight: '60vh', overflowY: 'auto' }}>
                  <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: '1.5rem', color: 'var(--admin-text)', marginBottom: '0.5rem' }}>{form.title || 'Untitled'}</h2>
                  <p style={{ fontSize: '0.8rem', color: 'var(--admin-text-dim)', marginBottom: '1rem' }}>{form.date} · {form.readTime}</p>
                  <div style={{ fontSize: '0.85rem', color: 'var(--admin-text-muted)', lineHeight: 1.7 }}>
                    <ReactMarkdown>{form.content}</ReactMarkdown>
                  </div>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div>
                    <label className="admin-label">Title</label>
                    <input
                      value={form.title}
                      onChange={e => setForm({ ...form, title: e.target.value, slug: editingSlug || slugify(e.target.value) })}
                      className="admin-input" placeholder="Blog post title"
                    />
                  </div>
                  <div className="admin-grid-blog-meta">
                    <div>
                      <label className="admin-label">Slug</label>
                      <input value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value })} className="admin-input" />
                    </div>
                    <div>
                      <label className="admin-label">Category</label>
                      <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="admin-input admin-select">
                        {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="admin-label">Status</label>
                      <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} className="admin-input admin-select">
                        <option value="published">Published</option>
                        <option value="draft">Draft</option>
                      </select>
                    </div>
                  </div>
                  <div className="admin-grid-2col">
                    <div>
                      <label className="admin-label">Date</label>
                      <input value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} className="admin-input" />
                    </div>
                    <div>
                      <label className="admin-label">Read Time</label>
                      <input value={form.readTime} onChange={e => setForm({ ...form, readTime: e.target.value })} className="admin-input" />
                    </div>
                  </div>
                  <div>
                    <label className="admin-label">Excerpt</label>
                    <textarea
                      value={form.excerpt} onChange={e => setForm({ ...form, excerpt: e.target.value })}
                      className="admin-input admin-textarea" style={{ minHeight: 60 }}
                      placeholder="Short description for blog listing..."
                    />
                  </div>
                  <div>
                    <label className="admin-label">Content (Markdown)</label>
                    <textarea
                      value={form.content} onChange={e => setForm({ ...form, content: e.target.value })}
                      className="admin-input admin-textarea" style={{ minHeight: 200, fontFamily: 'monospace', fontSize: '0.8rem' }}
                      placeholder="Write your blog content in Markdown..."
                    />
                  </div>
                </div>
              )}
            </div>
            <div className="admin-modal-footer">
              <button onClick={() => setShowModal(false)} className="admin-btn admin-btn-secondary">Cancel</button>
              <button onClick={handleSave} disabled={saving || !form.title.trim()} className="admin-btn admin-btn-primary" style={{ opacity: saving ? 0.7 : 1 }}>
                <Save size={15} /> {saving ? 'Saving...' : editingSlug ? 'Update' : 'Publish'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteConfirm && (
        <div className="admin-modal-overlay" onClick={() => setDeleteConfirm(null)}>
          <div className="admin-modal" style={{ maxWidth: 400 }} onClick={e => e.stopPropagation()}>
            <div className="admin-modal-body" style={{ textAlign: 'center', padding: '2rem' }}>
              <div style={{
                width: 48, height: 48, borderRadius: 12,
                background: 'rgba(239,68,68,0.12)', display: 'flex',
                alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 1rem', color: '#ef4444'
              }}>
                <Trash2 size={22} />
              </div>
              <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--admin-text)', marginBottom: '0.5rem' }}>Delete this blog?</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--admin-text-muted)', marginBottom: '1.5rem' }}>This action cannot be undone.</p>
              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
                <button onClick={() => setDeleteConfirm(null)} className="admin-btn admin-btn-secondary">Cancel</button>
                <button onClick={() => handleDelete(deleteConfirm)} className="admin-btn admin-btn-danger">Delete</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className={`admin-toast ${toast.type === 'success' ? 'admin-toast-success' : 'admin-toast-error'}`}>
          {toast.message}
        </div>
      )}
    </div>
  )
}
