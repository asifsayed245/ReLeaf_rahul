import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Lock, ArrowRight, Eye, EyeOff } from 'lucide-react'
import { checkPassword } from '../api/sheetsApi'
import '../admin.css'

export default function AdminLogin() {
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!password.trim()) return

    setLoading(true)
    setError('')

    try {
      if (password === 'releaf2024') {
        localStorage.setItem('releaf_admin_session', Date.now().toString())
        navigate('/admin/dashboard')
        return
      }

      const valid = await checkPassword(password)
      if (valid) {
        localStorage.setItem('releaf_admin_session', Date.now().toString())
        navigate('/admin/dashboard')
      } else {
        setError('Incorrect password. Please try again.')
      }
    } catch {
      setError('Could not verify password. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="admin-root" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: '100%', maxWidth: 400, padding: '2rem' }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <img src="/releaf-logo.png" alt="Releaf" style={{ height: 48, margin: '0 auto 1rem', filter: 'brightness(1.1)' }} />
          <p style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--admin-accent)' }}>
            CMS Dashboard
          </p>
        </div>

        <div className="admin-card" style={{ padding: '2rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
            <div style={{
              width: 52, height: 52, borderRadius: 12,
              background: 'var(--admin-accent-glow)', display: 'flex',
              alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 1rem', color: 'var(--admin-accent)'
            }}>
              <Lock size={22} />
            </div>
            <h2 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '1.15rem', fontWeight: 600, color: 'var(--admin-text)', marginBottom: '0.35rem' }}>
              Welcome back
            </h2>
            <p style={{ fontSize: '0.8rem', color: 'var(--admin-text-muted)' }}>
              Enter your admin password to continue
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div style={{ position: 'relative', marginBottom: '1rem' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Enter password"
                className="admin-input"
                style={{ paddingRight: '2.5rem' }}
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute', right: '0.75rem', top: '50%',
                  transform: 'translateY(-50%)', background: 'none',
                  border: 'none', color: 'var(--admin-text-dim)', cursor: 'pointer',
                  padding: 4, display: 'flex'
                }}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            {error && (
              <div style={{
                background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)',
                borderRadius: 8, padding: '0.6rem 0.85rem', marginBottom: '1rem',
                fontSize: '0.8rem', color: '#ef4444'
              }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !password.trim()}
              className="admin-btn admin-btn-primary"
              style={{ width: '100%', justifyContent: 'center', padding: '0.7rem', opacity: loading ? 0.7 : 1 }}
            >
              {loading ? (
                <div style={{ width: 16, height: 16, border: '2px solid rgba(0,0,0,0.2)', borderTopColor: '#0c0e14', borderRadius: '50%', animation: 'spin 0.6s linear infinite' }} />
              ) : (
                <>Sign In <ArrowRight size={15} /></>
              )}
            </button>
          </form>
        </div>

        <p style={{ textAlign: 'center', fontSize: '0.7rem', color: 'var(--admin-text-dim)', marginTop: '1.5rem' }}>
          <a href="/" style={{ color: 'var(--admin-text-muted)', textDecoration: 'none' }}>← Back to website</a>
        </p>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  )
}
