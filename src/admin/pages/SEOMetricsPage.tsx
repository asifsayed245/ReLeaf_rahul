import { useState, useEffect, useCallback } from 'react'
import { Search as SearchIcon, Zap, Globe, RefreshCw, Loader2 } from 'lucide-react'
import { fetchAnalytics, fetchLighthouseScores, type AnalyticsData, type LighthouseData } from '../api/sheetsApi'

function ProgressRing({ score, size = 100, label }: { score: number; size?: number; label: string }) {
  const radius = (size - 16) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (score / 100) * circumference
  const color = score >= 90 ? '#4ade80' : score >= 70 ? '#f59e0b' : '#ef4444'

  return (
    <div style={{ textAlign: 'center' }}>
      <svg width={size} height={size} className="admin-progress-ring">
        <circle cx={size / 2} cy={size / 2} r={radius} className="admin-progress-ring-bg" />
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          className="admin-progress-ring-fill"
          style={{
            stroke: color,
            strokeDasharray: circumference,
            strokeDashoffset: offset,
          }}
        />
        <text
          x="50%" y="50%"
          textAnchor="middle" dy="0.35em"
          style={{
            fill: color, fontSize: size * 0.28,
            fontWeight: 700, fontFamily: "'DM Sans', sans-serif",
            transform: 'rotate(90deg)', transformOrigin: '50% 50%'
          }}
        >
          {score}
        </text>
      </svg>
      <p style={{ fontSize: '0.75rem', color: 'var(--admin-text-muted)', marginTop: '0.35rem' }}>{label}</p>
    </div>
  )
}

function vitalStatus(label: string, value: string): { status: string; color: string } {
  const num = parseFloat(value.replace(/[^0-9.]/g, ''))
  if (isNaN(num)) return { status: '—', color: 'gray' }

  if (label === 'LCP') {
    if (num <= 2.5) return { status: 'Good', color: 'green' }
    if (num <= 4) return { status: 'Needs Work', color: 'amber' }
    return { status: 'Poor', color: 'red' }
  }
  if (label === 'FID') {
    if (num <= 100) return { status: 'Good', color: 'green' }
    if (num <= 300) return { status: 'Needs Work', color: 'amber' }
    return { status: 'Poor', color: 'red' }
  }
  if (label === 'CLS') {
    if (num <= 0.1) return { status: 'Good', color: 'green' }
    if (num <= 0.25) return { status: 'Needs Work', color: 'amber' }
    return { status: 'Poor', color: 'red' }
  }
  if (label === 'TTFB') {
    if (num <= 800) return { status: 'Good', color: 'green' }
    if (num <= 1800) return { status: 'Needs Work', color: 'amber' }
    return { status: 'Poor', color: 'red' }
  }
  return { status: 'Good', color: 'green' }
}

export default function SEOMetricsPage() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [lighthouse, setLighthouse] = useState<LighthouseData | null>(null)
  const [loading, setLoading] = useState(true)
  const [scanning, setScanning] = useState(false)
  const [scanProgress, setScanProgress] = useState({ done: 0, total: 6 })

  useEffect(() => {
    Promise.all([
      fetchAnalytics(),
      fetchLighthouseScores(),
    ]).then(([a, lh]) => {
      setAnalytics(a)
      setLighthouse(lh)
      setLoading(false)
    })
  }, [])

  const handleRescan = useCallback(async () => {
    // Clear cache and rescan
    localStorage.removeItem('releaf_lighthouse_cache')
    setScanning(true)
    setScanProgress({ done: 0, total: 6 })
    const lh = await fetchLighthouseScores((done, total) => {
      setScanProgress({ done, total })
    })
    setLighthouse(lh)
    setScanning(false)
  }, [])

  const hasSeo = analytics && analytics.seo !== undefined
  const keywords = hasSeo ? analytics.seo : []
  const hasLighthouse = lighthouse !== null

  // Use real scores if available
  const scores = hasLighthouse
    ? lighthouse.averageScores
    : { seo: 0, performance: 0, accessibility: 0, bestPractices: 0 }

  // Use real web vitals from the home page if available
  const homeVitals = hasLighthouse
    ? lighthouse.pages.find(p => p.path === '/')?.webVitals
    : null

  const vitals = homeVitals
    ? [
        { label: 'LCP', value: homeVitals.lcp },
        { label: 'FID', value: homeVitals.fid },
        { label: 'CLS', value: homeVitals.cls },
        { label: 'TTFB', value: homeVitals.ttfb },
      ]
    : []

  return (
    <div>
      {/* Scanning banner */}
      {scanning && (
        <div style={{
          background: 'rgba(74,222,128,0.08)', border: '1px solid rgba(74,222,128,0.25)',
          borderRadius: 10, padding: '0.85rem 1.25rem', marginBottom: '1.5rem',
          display: 'flex', alignItems: 'center', gap: '0.75rem',
          fontSize: '0.8rem', color: '#4ade80'
        }}>
          <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} />
          <span>Scanning page {scanProgress.done + 1} of {scanProgress.total}... This may take a minute.</span>
        </div>
      )}

      {/* Loading state */}
      {loading && !scanning && (
        <div style={{
          background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.2)',
          borderRadius: 10, padding: '0.85rem 1.25rem', marginBottom: '1.5rem',
          display: 'flex', alignItems: 'center', gap: '0.75rem',
          fontSize: '0.8rem', color: 'var(--admin-info)'
        }}>
          <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} />
          <span>Loading SEO data...</span>
        </div>
      )}

      {/* Score cards */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div />
        <button
          onClick={handleRescan}
          disabled={scanning}
          style={{
            display: 'flex', alignItems: 'center', gap: '0.4rem',
            background: 'var(--admin-surface-2)', border: '1px solid var(--admin-border)',
            borderRadius: 8, padding: '0.4rem 0.85rem', cursor: scanning ? 'not-allowed' : 'pointer',
            fontSize: '0.75rem', color: 'var(--admin-text-muted)', opacity: scanning ? 0.5 : 1,
            transition: 'all 0.2s'
          }}
        >
          <RefreshCw size={14} style={scanning ? { animation: 'spin 1s linear infinite' } : {}} />
          {scanning ? 'Scanning...' : 'Rescan All Pages'}
        </button>
      </div>

      <div className="admin-grid-scores" style={{ marginBottom: '1.5rem' }}>
        <div className="admin-card admin-animate-in" style={{ textAlign: 'center' }}>
          {hasLighthouse || loading ? (
            <ProgressRing score={loading ? 0 : scores.seo} label="Overall SEO" />
          ) : (
            <div style={{ padding: '1rem', color: 'var(--admin-text-dim)', fontSize: '0.8rem' }}>Click "Rescan" to scan</div>
          )}
        </div>
        <div className="admin-card admin-animate-in" style={{ textAlign: 'center' }}>
          {hasLighthouse || loading ? (
            <ProgressRing score={loading ? 0 : scores.performance} label="Performance" />
          ) : (
            <div style={{ padding: '1rem', color: 'var(--admin-text-dim)', fontSize: '0.8rem' }}>—</div>
          )}
        </div>
        <div className="admin-card admin-animate-in" style={{ textAlign: 'center' }}>
          {hasLighthouse || loading ? (
            <ProgressRing score={loading ? 0 : scores.accessibility} label="Accessibility" />
          ) : (
            <div style={{ padding: '1rem', color: 'var(--admin-text-dim)', fontSize: '0.8rem' }}>—</div>
          )}
        </div>
        <div className="admin-card admin-animate-in" style={{ textAlign: 'center' }}>
          {hasLighthouse || loading ? (
            <ProgressRing score={loading ? 0 : scores.bestPractices} label="Best Practices" />
          ) : (
            <div style={{ padding: '1rem', color: 'var(--admin-text-dim)', fontSize: '0.8rem' }}>—</div>
          )}
        </div>
      </div>

      <div className="admin-grid-2col">
        {/* Keyword Rankings */}
        <div className="admin-card admin-animate-in">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <SearchIcon size={16} style={{ color: 'var(--admin-accent)' }} />
            <h3 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--admin-text)' }}>Keyword Rankings</h3>
            {hasSeo && <span className="admin-badge admin-badge-green" style={{ marginLeft: 'auto' }}>Live</span>}
          </div>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Keyword</th>
                <th>Pos.</th>
                <th>Impr.</th>
                <th>CTR</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={4} style={{ textAlign: 'center', padding: '2rem', color: 'var(--admin-text-dim)' }}>Loading...</td></tr>
              ) : keywords.length === 0 ? (
                <tr><td colSpan={4} style={{ textAlign: 'center', padding: '2rem', color: 'var(--admin-text-dim)' }}>No keyword data found for the last 30 days.</td></tr>
              ) : keywords.map((kw, i) => (
                <tr key={i}>
                  <td style={{ fontSize: '0.8rem', textTransform: 'capitalize' }}>{kw.keyword}</td>
                  <td>
                    <span className={`admin-badge ${kw.position <= 5 ? 'admin-badge-green' : kw.position <= 10 ? 'admin-badge-amber' : 'admin-badge-gray'}`}>
                      #{typeof kw.position === 'number' ? kw.position.toFixed(1) : kw.position}
                    </span>
                  </td>
                  <td style={{ fontSize: '0.8rem', color: 'var(--admin-text-muted)' }}>{kw.impressions}</td>
                  <td style={{ fontSize: '0.8rem', color: 'var(--admin-text-muted)' }}>
                    {typeof kw.ctr === 'number' ? `${(kw.ctr * 100).toFixed(1)}%` : kw.ctr}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Page Audit */}
        <div className="admin-card admin-animate-in">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <Globe size={16} style={{ color: 'var(--admin-accent)' }} />
            <h3 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--admin-text)' }}>Page SEO Audit</h3>
            {hasLighthouse && <span className="admin-badge admin-badge-green" style={{ marginLeft: 'auto' }}>Live</span>}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {!hasLighthouse && !loading ? (
              <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--admin-text-dim)', fontSize: '0.8rem' }}>
                Click "Rescan All Pages" to get real audit scores for each page.
              </div>
            ) : loading ? (
              <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--admin-text-dim)', fontSize: '0.8rem' }}>
                Loading...
              </div>
            ) : lighthouse!.pages.map((page, i) => {
              const avgScore = Math.round((page.scores.seo + page.scores.performance + page.scores.accessibility + page.scores.bestPractices) / 4)
              const lowScores = Object.entries(page.scores).filter(([, v]) => v < 80).length
              return (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '0.65rem 0.85rem', borderRadius: 8, background: 'var(--admin-surface-2)'
                }}>
                  <div style={{ minWidth: 0, flex: 1, marginRight: '1rem' }}>
                    <p style={{ fontSize: '0.82rem', fontWeight: 500, color: 'var(--admin-text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{page.title}</p>
                    <p style={{ fontSize: '0.65rem', color: 'var(--admin-text-dim)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{page.path}</p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
                    {lowScores > 0 && (
                      <span className="admin-badge admin-badge-amber">{lowScores} issue{lowScores > 1 ? 's' : ''}</span>
                    )}
                    <span className={`admin-badge ${avgScore >= 90 ? 'admin-badge-green' : avgScore >= 70 ? 'admin-badge-amber' : 'admin-badge-red'}`}>
                      {avgScore}/100
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Core Web Vitals */}
      <div className="admin-card admin-animate-in" style={{ marginTop: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
          <Zap size={16} style={{ color: 'var(--admin-accent)' }} />
          <h3 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--admin-text)' }}>Core Web Vitals</h3>
          {hasLighthouse && <span className="admin-badge admin-badge-green" style={{ marginLeft: 'auto' }}>Live · Home Page</span>}
        </div>
        <div className="admin-grid-vitals">
          {!hasLighthouse && !loading ? (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '2rem', color: 'var(--admin-text-dim)', fontSize: '0.8rem' }}>
              Click "Rescan All Pages" to get real Core Web Vitals.
            </div>
          ) : loading ? (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '2rem', color: 'var(--admin-text-dim)', fontSize: '0.8rem' }}>
              Loading...
            </div>
          ) : vitals.map((metric, i) => {
            const vs = vitalStatus(metric.label, metric.value)
            return (
              <div key={i} style={{ background: 'var(--admin-surface-2)', borderRadius: 10, padding: '1rem', textAlign: 'center' }}>
                <p style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--admin-text-dim)', marginBottom: '0.35rem' }}>{metric.label}</p>
                <p style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--admin-text)' }}>{metric.value}</p>
                <span className={`admin-badge admin-badge-${vs.color}`}>{vs.status}</span>
              </div>
            )
          })}
        </div>
        {hasLighthouse && (
          <p style={{ fontSize: '0.65rem', color: 'var(--admin-text-dim)', marginTop: '0.75rem', textAlign: 'center' }}>
            Last scanned: {new Date(lighthouse!.scannedAt).toLocaleString()}
          </p>
        )}
      </div>
    </div>
  )
}
