import { useState, useEffect, useCallback } from 'react'
import { Link, useLocation, Outlet, useNavigate } from 'react-router-dom'
import { LayoutDashboard, FileText, User, Search, MessageSquare, Settings, LogOut, ExternalLink, Menu, AlertTriangle } from 'lucide-react'
import { checkApiHealth } from '../api/sheetsApi'
import '../admin.css'

const navItems = [
  { label: 'Dashboard', to: '/admin/dashboard', icon: LayoutDashboard },
  { label: 'Blog Manager', to: '/admin/blogs', icon: FileText },
  { label: 'Profile', to: '/admin/profile', icon: User },
  { label: 'SEO Metrics', to: '/admin/seo', icon: Search },
  { label: 'Contacts', to: '/admin/contacts', icon: MessageSquare },
  { label: 'Settings', to: '/admin/settings', icon: Settings },
]

export default function AdminLayout() {
  const location = useLocation()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [apiHealthy, setApiHealthy] = useState<boolean | null>(null)

  // Auth guard
  useEffect(() => {
    const session = localStorage.getItem('releaf_admin_session')
    if (!session) navigate('/admin')
  }, [navigate])

  // Warn if the Google Apps Script data source is unreachable / access-denied
  useEffect(() => {
    checkApiHealth().then(setApiHealthy)
  }, [])

  // Close sidebar on route change (mobile)
  useEffect(() => { setSidebarOpen(false) }, [location])

  const isActive = useCallback(
    (path: string) => location.pathname === path,
    [location.pathname]
  )

  const handleLogout = () => {
    localStorage.removeItem('releaf_admin_session')
    navigate('/admin')
  }

  // Page title from route
  const pageTitle = navItems.find(item => isActive(item.to))?.label || 'Dashboard'

  return (
    <div className="admin-root">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 35 }}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="admin-sidebar-logo">
          <img src="/releaf-logo.png" alt="Releaf" />
          <span>CMS</span>
        </div>

        <nav className="admin-nav">
          <div className="admin-nav-section">Menu</div>
          {navItems.map(item => (
            <Link
              key={item.to}
              to={item.to}
              className={`admin-nav-item ${isActive(item.to) ? 'active' : ''}`}
            >
              <item.icon />
              {item.label}
            </Link>
          ))}
        </nav>

        <div style={{ padding: '0.75rem', borderTop: '1px solid var(--admin-border)' }}>
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="admin-nav-item"
            style={{ fontSize: '0.8rem' }}
          >
            <ExternalLink size={16} />
            View Live Site
          </a>
          <button
            onClick={handleLogout}
            className="admin-nav-item"
            style={{ color: 'var(--admin-danger)', fontSize: '0.8rem' }}
          >
            <LogOut size={16} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="admin-main">
        <header className="admin-topbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button
              className="admin-btn admin-btn-ghost"
              style={{ display: 'none', padding: '0.4rem' }}
              onClick={() => setSidebarOpen(true)}
              id="admin-menu-btn"
            >
              <Menu size={20} />
            </button>
            <h1>{pageTitle}</h1>
          </div>
          <div className="admin-topbar-actions">
            <span style={{ fontSize: '0.7rem', color: 'var(--admin-text-dim)' }}>
              Releaf CMS
            </span>
          </div>
        </header>

        {apiHealthy === false && (
          <div style={{
            background: 'rgba(239,68,68,0.1)', borderBottom: '1px solid rgba(239,68,68,0.35)',
            color: '#fca5a5', padding: '0.75rem 1.25rem', fontSize: '0.8rem',
            display: 'flex', alignItems: 'flex-start', gap: '0.6rem', lineHeight: 1.5
          }}>
            <AlertTriangle size={16} style={{ flexShrink: 0, marginTop: '0.1rem' }} />
            <span>
              <strong>Can't reach your data source.</strong> Blogs, contacts, profile and analytics may show empty — the data is safe, but the site can't read it.
              Open the Apps Script project → <strong>Deploy → Manage deployments</strong>, set <strong>"Who has access" to "Anyone"</strong>, and deploy a new version.
            </span>
          </div>
        )}

        <div className="admin-content">
          <Outlet />
        </div>
      </div>

      {/* Mobile menu button override */}
      <style>{`
        @media (max-width: 768px) {
          #admin-menu-btn { display: flex !important; }
        }
      `}</style>
    </div>
  )
}
