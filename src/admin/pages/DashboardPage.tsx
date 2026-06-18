import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FileText, MessageSquare, Eye, TrendingUp, ArrowRight, Plus, User } from 'lucide-react'
import { fetchBlogs, fetchContacts, fetchAnalytics, fetchLighthouseScores, type BlogPost, type ContactSubmission, type AnalyticsData, type LighthouseData } from '../api/sheetsApi'

// Fallback mock traffic if no analytics connected
const FALLBACK_TRAFFIC = [
  120, 145, 132, 168, 155, 189, 210, 198, 225, 245,
  230, 260, 275, 290, 268, 310, 295, 320, 340, 355,
  330, 365, 380, 395, 410, 425, 440, 460, 475, 490,
]

function TrafficChart({ data }: { data: number[] }) {
  if (data.length === 0) return null
  const max = Math.max(...data, 10)
  const min = Math.min(...data)
  const range = max - min || 1
  const w = 600
  const h = 180
  const padding = 10

  const points = data.map((v, i) => {
    const x = padding + (i / (data.length - 1 || 1)) * (w - 2 * padding)
    const y = h - padding - ((v - min) / range) * (h - 2 * padding)
    return `${x},${y}`
  })

  const areaPoints = [...points, `${w - padding},${h - padding}`, `${padding},${h - padding}`]

  return (
    <div className="admin-chart">
      <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none">
        <defs>
          <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#4ade80" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#4ade80" stopOpacity="0" />
          </linearGradient>
        </defs>
        {/* Grid lines */}
        {[0.25, 0.5, 0.75].map(frac => (
          <line key={frac} x1={padding} y1={h * frac} x2={w - padding} y2={h * frac} className="admin-chart-grid" />
        ))}
        {/* Area */}
        <polygon points={areaPoints.join(' ')} className="admin-chart-area" />
        {/* Line */}
        <polyline points={points.join(' ')} className="admin-chart-line" />
        {/* End dot */}
        <circle cx={points[points.length - 1].split(',')[0]} cy={points[points.length - 1].split(',')[1]} r="4" className="admin-chart-dot" />
      </svg>
    </div>
  )
}

export default function DashboardPage() {
  const [blogs, setBlogs] = useState<BlogPost[]>([])
  const [contacts, setContacts] = useState<ContactSubmission[]>([])
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [lighthouse, setLighthouse] = useState<LighthouseData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([fetchBlogs(), fetchContacts(), fetchAnalytics(), fetchLighthouseScores()]).then(([b, c, a, lh]) => {
      setBlogs(b)
      setContacts(c)
      setAnalytics(a)
      setLighthouse(lh)
      setLoading(false)
    })
  }, [])

  const hasTraffic = analytics && analytics.traffic !== undefined
  const totalPageviews = hasTraffic 
    ? analytics.traffic.reduce((sum, item) => sum + item.views, 0)
    : 4890 // mock default
  const chartData = hasTraffic ? analytics.traffic.map(t => t.views) : FALLBACK_TRAFFIC

  const seoScore = lighthouse ? `${lighthouse.averageScores.seo}/100` : '—'
  const seoChange = lighthouse ? 'Live Data' : 'Scanning...'

  const stats = [
    { label: 'Total Blogs', value: loading ? '—' : String(blogs.length), icon: FileText, color: 'green', change: '+2 this month', up: true },
    { label: 'Contact Leads', value: loading ? '—' : String(contacts.length), icon: MessageSquare, color: 'blue', change: '+5 this week', up: true },
    { label: 'Pageviews (30d)', value: loading ? '—' : totalPageviews.toLocaleString(), icon: Eye, color: 'amber', change: hasTraffic ? 'Live Data' : '+12.3%', up: true },
    { label: 'SEO Score', value: loading ? '—' : seoScore, icon: TrendingUp, color: 'purple', change: seoChange, up: true },
  ]

  return (
    <div>
      {/* Stat cards */}
      <div className="admin-grid-stats" style={{ marginBottom: '1.5rem' }}>
        {stats.map((stat, i) => (
          <div key={i} className="admin-stat-card admin-animate-in">
            <div className={`admin-stat-icon ${stat.color}`}>
              <stat.icon size={20} />
            </div>
            <div>
              <div className="admin-stat-value">{stat.value}</div>
              <div className="admin-stat-label">{stat.label}</div>
              <div className={`admin-stat-change ${stat.up ? 'up' : 'down'}`}>{stat.change}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Traffic chart + Recent blogs */}
      <div className="admin-grid-2col">
        {/* Chart */}
        <div className="admin-card admin-animate-in">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <div>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--admin-text)', marginBottom: '0.15rem' }}>Traffic Overview</h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--admin-text-muted)' }}>Last 30 days {hasTraffic ? '· Live Data' : '· Mock data'}</p>
            </div>
            {hasTraffic ? <span className="admin-badge admin-badge-green">Live</span> : <span className="admin-badge admin-badge-amber">+12.3%</span>}
          </div>
          <TrafficChart data={chartData} />
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem', fontSize: '0.65rem', color: 'var(--admin-text-dim)' }}>
            <span>{hasTraffic ? (analytics.traffic.length > 0 ? new Date(analytics.traffic[0].date.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3')).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '30 days ago') : 'May 18'}</span>
            <span>{hasTraffic ? (analytics.traffic.length > 0 ? new Date(analytics.traffic[analytics.traffic.length-1].date.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3')).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'Today') : 'Jun 17'}</span>
          </div>
        </div>

        {/* Recent blogs */}
        <div className="admin-card admin-animate-in">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--admin-text)' }}>Recent Blogs</h3>
            <Link to="/admin/blogs" className="admin-btn admin-btn-ghost" style={{ fontSize: '0.75rem' }}>
              View all <ArrowRight size={14} />
            </Link>
          </div>

          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {[1, 2, 3].map(i => <div key={i} className="admin-skeleton" style={{ height: 48 }} />)}
            </div>
          ) : blogs.length === 0 ? (
            <div className="admin-empty">
              <FileText />
              <p>No blogs yet</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {blogs.slice(0, 5).map(blog => (
                <Link
                  key={blog.slug}
                  to="/admin/blogs"
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '0.65rem 0.85rem', borderRadius: 8, textDecoration: 'none',
                    background: 'var(--admin-surface-2)', transition: 'background 100ms'
                  }}
                >
                  <div>
                    <p style={{ fontSize: '0.82rem', fontWeight: 500, color: 'var(--admin-text)', marginBottom: '0.15rem' }}>
                      {blog.title.length > 45 ? blog.title.slice(0, 45) + '...' : blog.title}
                    </p>
                    <p style={{ fontSize: '0.7rem', color: 'var(--admin-text-dim)' }}>{blog.date}</p>
                  </div>
                  <span className="admin-badge admin-badge-green">{blog.category}</span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recent contacts */}
      <div className="admin-card admin-animate-in" style={{ marginTop: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <h3 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--admin-text)' }}>Recent Contact Submissions</h3>
          <Link to="/admin/contacts" className="admin-btn admin-btn-ghost" style={{ fontSize: '0.75rem' }}>
            View all <ArrowRight size={14} />
          </Link>
        </div>

        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {[1, 2, 3].map(i => <div key={i} className="admin-skeleton" style={{ height: 40 }} />)}
          </div>
        ) : contacts.length === 0 ? (
          <div className="admin-empty">
            <MessageSquare />
            <p>No contact submissions yet.<br />They'll appear here when someone fills out the contact form.</p>
          </div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {contacts.slice(-5).reverse().map((c, i) => {
                const name = c.Name || c.name || '—'
                const email = c.Email || c.email || '—'
                const phone = c.Phone || c.phone || '—'
                const status = c.Status || c.status || 'New'
                return (
                <tr key={i}>
                  <td style={{ fontWeight: 500 }}>{name}</td>
                  <td>{email}</td>
                  <td>{phone}</td>
                  <td><span className={`admin-badge ${status === 'Replied' ? 'admin-badge-blue' : status === 'Closed' ? 'admin-badge-gray' : 'admin-badge-green'}`}>{status}</span></td>
                </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Quick actions */}
      <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem', flexWrap: 'wrap' }}>
        <Link to="/admin/blogs" className="admin-btn admin-btn-primary">
          <Plus size={16} /> New Blog Post
        </Link>
        <Link to="/admin/profile" className="admin-btn admin-btn-secondary">
          <User size={16} /> Edit Profile
        </Link>
      </div>
    </div>
  )
}
