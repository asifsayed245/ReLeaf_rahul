import { useState, useEffect, type MouseEvent as ReactMouseEvent } from 'react'
import { Link } from 'react-router-dom'
import { FileText, MessageSquare, Eye, TrendingUp, ArrowRight, Plus, User } from 'lucide-react'
import { fetchBlogs, fetchContacts, fetchAnalytics, fetchLighthouseScores, type BlogPost, type ContactSubmission, type AnalyticsData, type LighthouseData } from '../api/sheetsApi'

const RANGE_OPTIONS = [
  { key: '7d', label: 'Last 7 days', days: 7 },
  { key: '30d', label: 'Last 30 days', days: 30 },
  { key: '90d', label: 'Last 90 days', days: 90 },
  { key: '365d', label: 'Last 12 months', days: 365 },
]

// GA returns dates as 'YYYYMMDD' strings
function parseGADate(s: string): Date {
  return new Date(Number(s.slice(0, 4)), Number(s.slice(4, 6)) - 1, Number(s.slice(6, 8)))
}
function shortDate(s: string): string {
  return parseGADate(s).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}
const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v))

function TrafficChart({ data }: { data: { date: string; views: number }[] }) {
  const [hover, setHover] = useState<number | null>(null)

  if (data.length === 0) {
    return (
      <div className="admin-chart" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--admin-text-dim)', fontSize: '0.8rem' }}>
        No visits recorded in this period
      </div>
    )
  }

  const max = Math.max(...data.map(d => d.views), 1)
  const w = 600, h = 200
  const padL = 30, padR = 12, padT = 14, padB = 22
  const innerW = w - padL - padR
  const innerH = h - padT - padB
  const n = data.length
  const xAt = (i: number) => (n === 1 ? padL + innerW / 2 : padL + (i / (n - 1)) * innerW)
  const yAt = (v: number) => padT + innerH - (v / max) * innerH

  const points = data.map((d, i) => `${xAt(i)},${yAt(d.views)}`)
  const areaPoints = [`${xAt(0)},${padT + innerH}`, ...points, `${xAt(n - 1)},${padT + innerH}`]
  const yTicks = [max, Math.round(max / 2), 0]

  const onMove = (e: ReactMouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const fx = (e.clientX - rect.left) / rect.width
    let best = 0, bestD = Infinity
    for (let i = 0; i < n; i++) {
      const d = Math.abs(xAt(i) / w - fx)
      if (d < bestD) { bestD = d; best = i }
    }
    setHover(best)
  }

  const tipBelow = hover !== null && yAt(data[hover].views) / h < 0.35

  return (
    <div className="admin-chart" style={{ position: 'relative' }} onMouseMove={onMove} onMouseLeave={() => setHover(null)}>
      {/* Y-axis value labels */}
      {yTicks.map((t, i) => (
        <span key={i} style={{ position: 'absolute', left: 0, top: `${((padT + (i * innerH) / 2) / h) * 100}%`, transform: 'translateY(-50%)', fontSize: '0.6rem', color: 'var(--admin-text-dim)' }}>{t.toLocaleString()}</span>
      ))}

      <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none">
        <defs>
          <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#4ade80" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#4ade80" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[0, 0.5, 1].map(frac => {
          const yy = padT + frac * innerH
          return <line key={frac} x1={padL} y1={yy} x2={w - padR} y2={yy} className="admin-chart-grid" />
        })}
        <polygon points={areaPoints.join(' ')} className="admin-chart-area" />
        <polyline points={points.join(' ')} className="admin-chart-line" />
        {data.map((d, i) => (
          <circle key={i} cx={xAt(i)} cy={yAt(d.views)} r={hover === i ? 5 : (n <= 31 ? 3 : 0)} className="admin-chart-dot" />
        ))}
        {hover !== null && (
          <line x1={xAt(hover)} y1={padT} x2={xAt(hover)} y2={padT + innerH} className="admin-chart-grid" />
        )}
      </svg>

      {hover !== null && (
        <div style={{ position: 'absolute', left: `${clamp((xAt(hover) / w) * 100, 14, 86)}%`, top: `${(yAt(data[hover].views) / h) * 100}%`, transform: `translate(-50%, ${tipBelow ? '30%' : '-130%'})`, background: '#1a1f2e', border: '1px solid var(--admin-border)', borderRadius: 6, padding: '4px 8px', fontSize: '0.65rem', color: 'var(--admin-text)', whiteSpace: 'nowrap', pointerEvents: 'none', zIndex: 2, textAlign: 'center' }}>
          <strong>{data[hover].views.toLocaleString()}</strong> views<br />
          <span style={{ color: 'var(--admin-text-dim)' }}>{shortDate(data[hover].date)}</span>
        </div>
      )}
    </div>
  )
}

export default function DashboardPage() {
  const [blogs, setBlogs] = useState<BlogPost[]>([])
  const [contacts, setContacts] = useState<ContactSubmission[]>([])
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [lighthouse, setLighthouse] = useState<LighthouseData | null>(null)
  const [loading, setLoading] = useState(true)
  const [range, setRange] = useState('30d')

  useEffect(() => {
    Promise.all([fetchBlogs(), fetchContacts(), fetchAnalytics(), fetchLighthouseScores()]).then(([b, c, a, lh]) => {
      setBlogs(b)
      setContacts(c)
      setAnalytics(a)
      setLighthouse(lh)
      setLoading(false)
    })
  }, [])

  const rangeMeta = RANGE_OPTIONS.find(r => r.key === range) ?? RANGE_OPTIONS[1]
  const cutoff = new Date()
  cutoff.setHours(0, 0, 0, 0)
  cutoff.setDate(cutoff.getDate() - (rangeMeta.days - 1))
  const filteredTraffic = (analytics?.traffic ?? []).filter(t => parseGADate(t.date) >= cutoff)
  const totalPageviews = filteredTraffic.reduce((sum, t) => sum + t.views, 0)
  const analyticsLoaded = analytics !== null

  const seoScore = lighthouse ? `${lighthouse.averageScores.seo}/100` : '—'
  const seoChange = lighthouse ? 'Live Data' : 'Scanning...'

  const stats = [
    { label: 'Total Blogs', value: loading ? '—' : String(blogs.length), icon: FileText, color: 'green', change: '+2 this month', up: true },
    { label: 'Contact Leads', value: loading ? '—' : String(contacts.length), icon: MessageSquare, color: 'blue', change: '+5 this week', up: true },
    { label: 'Pageviews', value: loading ? '—' : (analyticsLoaded ? totalPageviews.toLocaleString() : '—'), icon: Eye, color: 'amber', change: rangeMeta.label, up: true },
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
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', gap: '0.75rem', flexWrap: 'wrap' }}>
            <div>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--admin-text)', marginBottom: '0.15rem' }}>Traffic Overview</h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--admin-text-muted)' }}>
                {analyticsLoaded
                  ? <><strong style={{ color: 'var(--admin-text)' }}>{totalPageviews.toLocaleString()}</strong> pageviews · Live Data</>
                  : 'No analytics data'}
              </p>
            </div>
            <select
              value={range}
              onChange={e => setRange(e.target.value)}
              className="admin-input"
              style={{ width: 'auto', padding: '0.35rem 0.5rem', fontSize: '0.75rem' }}
            >
              {RANGE_OPTIONS.map(o => <option key={o.key} value={o.key}>{o.label}</option>)}
            </select>
          </div>
          <TrafficChart data={filteredTraffic} />
          {filteredTraffic.length > 0 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem', fontSize: '0.65rem', color: 'var(--admin-text-dim)' }}>
              <span>{shortDate(filteredTraffic[0].date)}</span>
              <span>{shortDate(filteredTraffic[filteredTraffic.length - 1].date)}</span>
            </div>
          )}
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
