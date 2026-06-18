import { useState } from 'react'
import { Save, Key, Database, Download } from 'lucide-react'
import { updateConfig, SHEETS_API_URL } from '../api/sheetsApi'

export default function SettingsPage() {
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState<{ type: string; message: string } | null>(null)

  const showToast = (type: string, message: string) => {
    setToast({ type, message })
    setTimeout(() => setToast(null), 3000)
  }

  const handlePasswordChange = async () => {
    if (!newPassword.trim() || newPassword.length < 6) {
      showToast('error', 'Password must be at least 6 characters')
      return
    }
    if (newPassword !== confirmPassword) {
      showToast('error', 'Passwords do not match')
      return
    }

    setSaving(true)
    const result = await updateConfig('adminPassword', newPassword)
    if (result.success) {
      showToast('success', 'Password updated!')
      setNewPassword('')
      setConfirmPassword('')
    } else {
      showToast('error', result.error || 'Failed to update')
    }
    setSaving(false)
  }

  const handleExportData = async () => {
    try {
      const [blogsRes, configRes] = await Promise.all([
        fetch(`${SHEETS_API_URL}?action=getBlogs`).then(r => r.json()),
        fetch(`${SHEETS_API_URL}?action=getConfig`).then(r => r.json()),
      ])

      const exportData = {
        exportedAt: new Date().toISOString(),
        blogs: blogsRes.data || [],
        config: configRes.data || {},
      }

      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `releaf-cms-export-${new Date().toISOString().split('T')[0]}.json`
      a.click()
      URL.revokeObjectURL(url)

      showToast('success', 'Data exported successfully!')
    } catch {
      showToast('error', 'Failed to export data')
    }
  }

  return (
    <div style={{ maxWidth: 640 }}>
      {/* Change Password */}
      <div className="admin-card" style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
          <Key size={16} style={{ color: 'var(--admin-accent)' }} />
          <h3 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--admin-text)' }}>Change Admin Password</h3>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          <div>
            <label className="admin-label">New Password</label>
            <input
              type="password" value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              className="admin-input" placeholder="Enter new password (min 6 chars)"
            />
          </div>
          <div>
            <label className="admin-label">Confirm Password</label>
            <input
              type="password" value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              className="admin-input" placeholder="Confirm new password"
            />
          </div>
          <button
            onClick={handlePasswordChange}
            disabled={saving || !newPassword.trim()}
            className="admin-btn admin-btn-primary"
            style={{ alignSelf: 'flex-start', opacity: newPassword.trim() ? 1 : 0.5 }}
          >
            <Save size={15} /> {saving ? 'Saving...' : 'Update Password'}
          </button>
        </div>
      </div>

      {/* API Info */}
      <div className="admin-card" style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
          <Database size={16} style={{ color: 'var(--admin-accent)' }} />
          <h3 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--admin-text)' }}>Database Connection</h3>
        </div>
        <div>
          <label className="admin-label">Google Sheets API URL</label>
          <input
            type="text" readOnly value={SHEETS_API_URL}
            className="admin-input" style={{ fontSize: '0.75rem', color: 'var(--admin-text-dim)' }}
            onClick={e => (e.target as HTMLInputElement).select()}
          />
          <p style={{ fontSize: '0.7rem', color: 'var(--admin-text-dim)', marginTop: '0.35rem' }}>
            All CMS data is stored in Google Sheets via this Apps Script endpoint.
          </p>
        </div>
      </div>

      {/* Export */}
      <div className="admin-card" style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
          <Download size={16} style={{ color: 'var(--admin-accent)' }} />
          <h3 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--admin-text)' }}>Export Data</h3>
        </div>
        <p style={{ fontSize: '0.8rem', color: 'var(--admin-text-muted)', marginBottom: '1rem', lineHeight: 1.5 }}>
          Download all your blogs and site configuration as a JSON file for backup.
        </p>
        <button onClick={handleExportData} className="admin-btn admin-btn-secondary">
          <Download size={15} /> Export All Data
        </button>
      </div>

      {/* Future integrations placeholder */}
      <div className="admin-card" style={{ opacity: 0.6 }}>
        <h3 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--admin-text)', marginBottom: '0.5rem' }}>Coming Soon</h3>
        <ul style={{ fontSize: '0.8rem', color: 'var(--admin-text-muted)', lineHeight: 2, paddingLeft: '1.25rem' }}>
          <li>Google Analytics 4 integration</li>
          <li>Google Search Console integration</li>
          <li>Automated SEO audits</li>
          <li>Email notification for new contacts</li>
        </ul>
      </div>

      {/* Toast */}
      {toast && (
        <div className={`admin-toast ${toast.type === 'success' ? 'admin-toast-success' : 'admin-toast-error'}`}>
          {toast.message}
        </div>
      )}
    </div>
  )
}
