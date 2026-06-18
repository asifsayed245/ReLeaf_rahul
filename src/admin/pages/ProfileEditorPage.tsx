import { useState, useEffect, useRef } from 'react'
import { Save, RefreshCw, Upload } from 'lucide-react'
import { fetchSiteConfig, bulkUpdateConfig, type SiteConfig } from '../api/sheetsApi'

const FIELDS: { key: keyof SiteConfig; label: string; type?: string }[] = [
  { key: 'ownerName', label: 'Full Name' },
  { key: 'ownerTitle', label: 'Title / Role' },
  { key: 'ownerEmail', label: 'Email', type: 'email' },
  { key: 'ownerPhone', label: 'Phone Number', type: 'tel' },
  { key: 'whatsappNumber', label: 'WhatsApp Number (without +)' },
  { key: 'location', label: 'Location' },
  { key: 'soberSince', label: 'Sober Since' },
  { key: 'certifications', label: 'Certifications' },
  { key: 'linkedIn', label: 'LinkedIn URL', type: 'url' },
  { key: 'instagram', label: 'Instagram URL', type: 'url' },
]

// Profile photo is stored inline as a compressed JPEG data URL in the config
// sheet. Resize so the encoded string stays well under Google Sheets' ~50k
// character per-cell limit. A circular avatar never needs to be large.
const MAX_DIMENSION = 400
const SIZE_BUDGET = 45000

function resizeImageToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const img = new Image()
      img.onload = () => {
        let { width, height } = img
        if (width > height && width > MAX_DIMENSION) {
          height = Math.round((height * MAX_DIMENSION) / width)
          width = MAX_DIMENSION
        } else if (height > MAX_DIMENSION) {
          width = Math.round((width * MAX_DIMENSION) / height)
          height = MAX_DIMENSION
        }
        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')
        if (!ctx) return reject(new Error('Canvas not supported in this browser'))
        ctx.drawImage(img, 0, 0, width, height)

        let quality = 0.9
        let dataUrl = canvas.toDataURL('image/jpeg', quality)
        while (dataUrl.length > SIZE_BUDGET && quality > 0.3) {
          quality -= 0.1
          dataUrl = canvas.toDataURL('image/jpeg', quality)
        }
        if (dataUrl.length > SIZE_BUDGET) {
          return reject(new Error('Image is too detailed to store. Try a simpler photo.'))
        }
        resolve(dataUrl)
      }
      img.onerror = () => reject(new Error('Could not load that image'))
      img.src = reader.result as string
    }
    reader.onerror = () => reject(new Error('Could not read that file'))
    reader.readAsDataURL(file)
  })
}

export default function ProfileEditorPage() {
  const [config, setConfig] = useState<Record<string, string>>({})
  const [original, setOriginal] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [processing, setProcessing] = useState(false)
  const [toast, setToast] = useState<{ type: string; message: string } | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const load = async () => {
    setLoading(true)
    const data = await fetchSiteConfig()
    if (data) {
      setConfig({ ...data })
      setOriginal({ ...data })
    }
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const showToast = (type: string, message: string) => {
    setToast({ type, message })
    setTimeout(() => setToast(null), 3000)
  }

  const hasChanges = JSON.stringify(config) !== JSON.stringify(original)

  const handleSave = async () => {
    setSaving(true)
    const changed: Record<string, string> = {}
    Object.keys(config).forEach(key => {
      if (config[key] !== original[key]) changed[key] = config[key]
    })

    const result = await bulkUpdateConfig(changed)
    if (result.success) {
      setOriginal({ ...config })
      showToast('success', 'Profile updated! Changes will appear on the site immediately.')
    } else {
      showToast('error', result.error || 'Failed to save')
    }
    setSaving(false)
  }

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) {
      showToast('error', 'Please choose an image file')
      return
    }
    setProcessing(true)
    try {
      const dataUrl = await resizeImageToDataUrl(file)
      setConfig(prev => ({ ...prev, ownerPhoto: dataUrl }))
      showToast('success', 'Photo ready — click Save Changes to publish')
    } catch (err) {
      showToast('error', err instanceof Error ? err.message : 'Failed to process image')
    } finally {
      setProcessing(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {[1, 2, 3, 4, 5].map(i => <div key={i} className="admin-skeleton" style={{ height: 60 }} />)}
      </div>
    )
  }

  return (
    <div>
      <div className="admin-grid-2col" style={{ alignItems: 'start' }}>
        {/* Edit Form */}
        <div className="admin-card">
          <h3 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--admin-text)', marginBottom: '1.25rem' }}>
            Owner Profile
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {/* Profile Photo */}
            <div>
              <label className="admin-label">Profile Photo</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <img
                  src={config.ownerPhoto || '/rahul-portrait.jpg'}
                  alt="Owner"
                  style={{ width: 64, height: 64, borderRadius: '50%', objectFit: 'cover', border: '1px solid var(--admin-border)', flexShrink: 0 }}
                />
                <div style={{ flex: 1 }}>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    style={{ display: 'none' }}
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={processing}
                    className="admin-btn admin-btn-secondary"
                  >
                    <Upload size={15} /> {processing ? 'Processing...' : 'Upload New Photo'}
                  </button>
                  <input
                    type="text"
                    value={config.ownerPhoto || ''}
                    onChange={e => setConfig({ ...config, ownerPhoto: e.target.value })}
                    className="admin-input"
                    placeholder="…or paste an image URL"
                    style={{ marginTop: '0.5rem' }}
                  />
                </div>
              </div>
            </div>
            {FIELDS.map(field => (
              <div key={field.key}>
                <label className="admin-label">{field.label}</label>
                <input
                  type={field.type || 'text'}
                  value={config[field.key] || ''}
                  onChange={e => setConfig({ ...config, [field.key]: e.target.value })}
                  className="admin-input"
                />
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button
              onClick={handleSave}
              disabled={!hasChanges || saving}
              className="admin-btn admin-btn-primary"
              style={{ opacity: hasChanges ? 1 : 0.5 }}
            >
              <Save size={15} /> {saving ? 'Saving...' : 'Save Changes'}
            </button>
            <button onClick={load} className="admin-btn admin-btn-secondary">
              <RefreshCw size={15} /> Reset
            </button>
          </div>
        </div>

        {/* Live Preview */}
        <div className="admin-card" style={{ position: 'sticky', top: '5rem' }}>
          <h3 style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--admin-text)', marginBottom: '1rem' }}>
            Live Preview
          </h3>

          {/* Hero preview */}
          <div style={{
            background: '#1f2a1d', borderRadius: 10, padding: '1.25rem', marginBottom: '1rem',
            textAlign: 'center'
          }}>
            <img
              src={config.ownerPhoto || '/rahul-portrait.jpg'}
              alt="Preview"
              style={{ width: 48, height: 48, borderRadius: '50%', objectFit: 'cover', margin: '0 auto 0.5rem', display: 'block' }}
            />
            <p style={{ fontSize: '0.8rem', fontWeight: 500, color: '#fff' }}>{config.ownerName}</p>
            <p style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.5)' }}>{config.certifications}</p>
          </div>

          {/* Footer preview */}
          <div style={{ background: '#1f2a1d', borderRadius: 10, padding: '1rem' }}>
            <p style={{ fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#85AB8B', marginBottom: '0.5rem' }}>Footer Preview</p>
            <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.8 }}>
              <p>📱 {config.ownerPhone}</p>
              <p>✉️ {config.ownerEmail}</p>
              <p>📍 {config.location}</p>
            </div>
          </div>

          <p style={{ fontSize: '0.65rem', color: 'var(--admin-text-dim)', marginTop: '0.75rem', textAlign: 'center' }}>
            Changes appear on the live site immediately after saving
          </p>
        </div>
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
