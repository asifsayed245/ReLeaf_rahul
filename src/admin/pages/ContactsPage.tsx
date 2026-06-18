import { useState, useEffect } from 'react'
import { Search, RefreshCw, MessageSquare, ChevronDown, ChevronUp } from 'lucide-react'
import { fetchContacts, type ContactSubmission } from '../api/sheetsApi'

export default function ContactsPage() {
  const [contacts, setContacts] = useState<ContactSubmission[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null)

  // Helper to get field value (supports both old lowercase and new capitalized headers)
  const f = (c: ContactSubmission, field: string): string => {
    const map: Record<string, string[]> = {
      name: ['Name', 'name'],
      email: ['Email', 'email'],
      phone: ['Phone', 'phone'],
      message: ['Message', 'message'],
      timeSlot: ['Preferred Time', 'timeSlot'],
      status: ['Status', 'status'],
      date: ['Date', 'timestamp'],
    }
    const keys = map[field] || [field]
    for (const k of keys) {
      if (c[k]) return String(c[k])
    }
    return ''
  }

  const load = async () => {
    setLoading(true)
    const data = await fetchContacts()
    setContacts(data)
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const filtered = contacts.filter(c => {
    if (!searchQuery) return true
    const q = searchQuery.toLowerCase()
    return (
      f(c, 'name').toLowerCase().includes(q) ||
      f(c, 'email').toLowerCase().includes(q) ||
      f(c, 'phone').toLowerCase().includes(q) ||
      f(c, 'message').toLowerCase().includes(q)
    )
  }).reverse() // Most recent first

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', gap: '0.75rem', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, maxWidth: 360 }}>
          <Search size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--admin-text-dim)' }} />
          <input
            type="text" placeholder="Search contacts..."
            value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
            className="admin-input" style={{ paddingLeft: '2.25rem' }}
          />
        </div>
        <button onClick={load} className="admin-btn admin-btn-secondary">
          <RefreshCw size={15} /> Refresh
        </button>
      </div>

      {/* Contacts list */}
      <div className="admin-card" style={{ padding: 0, overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {[1, 2, 3, 4].map(i => <div key={i} className="admin-skeleton" style={{ height: 52 }} />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="admin-empty">
            <MessageSquare />
            <p>{searchQuery ? 'No contacts match your search' : 'No contact submissions yet'}</p>
          </div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Time Slot</th>
                <th>Status</th>
                <th style={{ width: 40 }}></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((contact, i) => (
                <>
                  <tr key={i} style={{ cursor: 'pointer' }} onClick={() => setExpandedIndex(expandedIndex === i ? null : i)}>
                    <td style={{ fontWeight: 500 }}>{f(contact, 'name') || '—'}</td>
                    <td>
                      {f(contact, 'email') ? (
                        <a href={`mailto:${f(contact, 'email')}`} style={{ color: 'var(--admin-accent)', textDecoration: 'none' }} onClick={e => e.stopPropagation()}>
                          {f(contact, 'email')}
                        </a>
                      ) : '—'}
                    </td>
                    <td>
                      {f(contact, 'phone') ? (
                        <a href={`tel:${f(contact, 'phone')}`} style={{ color: 'var(--admin-text)', textDecoration: 'none' }} onClick={e => e.stopPropagation()}>
                          {f(contact, 'phone')}
                        </a>
                      ) : '—'}
                    </td>
                    <td style={{ fontSize: '0.8rem', color: 'var(--admin-text-muted)' }}>{f(contact, 'timeSlot') || '—'}</td>
                    <td>
                      <span className={`admin-badge ${
                        f(contact, 'status') === 'Replied' ? 'admin-badge-blue' :
                        f(contact, 'status') === 'Closed' ? 'admin-badge-gray' :
                        'admin-badge-green'
                      }`}>
                        {f(contact, 'status') || 'New'}
                      </span>
                    </td>
                    <td>
                      {expandedIndex === i ? <ChevronUp size={14} style={{ color: 'var(--admin-text-dim)' }} /> : <ChevronDown size={14} style={{ color: 'var(--admin-text-dim)' }} />}
                    </td>
                  </tr>
                  {expandedIndex === i && (
                    <tr key={`${i}-expanded`}>
                      <td colSpan={6} style={{ background: 'var(--admin-surface-2)', padding: '1rem 1.5rem' }}>
                        <p style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--admin-text-dim)', marginBottom: '0.5rem' }}>Message</p>
                        <p style={{ fontSize: '0.85rem', color: 'var(--admin-text)', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
                          {f(contact, 'message') || 'No message provided'}
                        </p>
                        {f(contact, 'date') && (
                          <p style={{ fontSize: '0.7rem', color: 'var(--admin-text-dim)', marginTop: '0.75rem' }}>
                            Submitted: {f(contact, 'date')}
                          </p>
                        )}
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <p style={{ fontSize: '0.7rem', color: 'var(--admin-text-dim)', marginTop: '0.75rem' }}>
        {filtered.length} contact{filtered.length !== 1 ? 's' : ''} total · Data from Google Sheets
      </p>
    </div>
  )
}
