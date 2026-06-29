// Releaf CMS — Google Sheets API Client
// All CRUD operations go through the Google Apps Script web app

// Replace this with your deployed Apps Script web app URL
export const SHEETS_API_URL = 'https://script.google.com/macros/s/AKfycbyjEWM2acwvVl6Ipnhg2dwjV-PAH6fmF0-zdxzH1C1PkOL4ZIa4cCXfjxDjXfOGG9lA/exec'

export interface BlogPost {
  slug: string
  title: string
  excerpt: string
  date: string
  readTime: string
  category: string
  content: string
  status?: string
}

export interface SiteConfig {
  ownerName: string
  ownerTitle: string
  ownerPhoto: string
  ownerEmail: string
  ownerPhone: string
  whatsappNumber: string
  location: string
  soberSince: string
  certifications: string
  linkedIn: string
  instagram: string
  adminPassword: string
  [key: string]: string
}

export interface ContactSubmission {
  Date?: string
  Name: string
  Phone: string
  Email: string
  Message: string
  'Preferred Time': string
  Status?: string
  // Keep legacy field names for backwards compatibility
  timestamp?: string
  name?: string
  phone?: string
  email?: string
  message?: string
  timeSlot?: string
  status?: string
  [key: string]: string | undefined
}

export interface AnalyticsData {
  traffic: { date: string; views: number }[]
  seo: { keyword: string; clicks: number; impressions: number; ctr: number; position: number }[]
}

export interface LighthousePageResult {
  url: string
  title: string
  path: string
  scores: {
    seo: number
    performance: number
    accessibility: number
    bestPractices: number
  }
  webVitals: {
    lcp: string
    fid: string
    cls: string
    ttfb: string
  }
}

export interface LighthouseData {
  pages: LighthousePageResult[]
  averageScores: {
    seo: number
    performance: number
    accessibility: number
    bestPractices: number
  }
  scannedAt: string
}

const PSI_API_URL = 'https://www.googleapis.com/pagespeedonline/v5/runPagespeed'
const SITE_PAGES = [
  { path: '/', title: 'Home' },
  { path: '/my-story', title: 'My Story' },
  { path: '/how-i-help', title: 'How I Help' },
  { path: '/blog', title: 'Blog' },
  { path: '/book', title: 'Book a Call' },
  { path: '/stories', title: 'Stories' },
]

async function runLighthouse(pagePath: string, pageTitle: string): Promise<LighthousePageResult | null> {
  try {
    const url = `https://releaf.co.in${pagePath}`
    const categories = ['seo', 'performance', 'accessibility', 'best-practices'].map(c => `category=${c}`).join('&')
    const res = await fetch(`${PSI_API_URL}?url=${encodeURIComponent(url)}&${categories}&strategy=mobile&key=AIzaSyCPF3h4Ao74-wYWL1NaXhrlzHB0xbNIXOw`)
    const json = await res.json()

    if (!json.lighthouseResult) return null

    const cats = json.lighthouseResult.categories
    const audits = json.lighthouseResult.audits

    return {
      url,
      title: pageTitle,
      path: pagePath,
      scores: {
        seo: Math.round((cats?.seo?.score || 0) * 100),
        performance: Math.round((cats?.performance?.score || 0) * 100),
        accessibility: Math.round((cats?.accessibility?.score || 0) * 100),
        bestPractices: Math.round((cats?.['best-practices']?.score || 0) * 100),
      },
      webVitals: {
        lcp: audits?.['largest-contentful-paint']?.displayValue || '—',
        fid: audits?.['max-potential-fid']?.displayValue || '—',
        cls: audits?.['cumulative-layout-shift']?.displayValue || '—',
        ttfb: audits?.['server-response-time']?.displayValue || '—',
      },
    }
  } catch (err) {
    console.error(`Lighthouse error for ${pagePath}:`, err)
    return null
  }
}

export async function fetchLighthouseScores(onProgress?: (done: number, total: number) => void): Promise<LighthouseData | null> {
  // Check localStorage cache (valid for 6 hours)
  const cached = localStorage.getItem('releaf_lighthouse_cache')
  if (cached) {
    try {
      const parsed = JSON.parse(cached) as LighthouseData & { _cachedAt: number }
      const sixHours = 6 * 60 * 60 * 1000
      if (Date.now() - parsed._cachedAt < sixHours) {
        return parsed
      }
    } catch { /* cache invalid, continue */ }
  }

  const results: LighthousePageResult[] = []
  for (let i = 0; i < SITE_PAGES.length; i++) {
    onProgress?.(i, SITE_PAGES.length)
    const result = await runLighthouse(SITE_PAGES[i].path, SITE_PAGES[i].title)
    if (result) results.push(result)
  }
  onProgress?.(SITE_PAGES.length, SITE_PAGES.length)

  if (results.length === 0) return null

  const avg = (key: keyof LighthousePageResult['scores']) =>
    Math.round(results.reduce((sum, r) => sum + r.scores[key], 0) / results.length)

  const data: LighthouseData = {
    pages: results,
    averageScores: {
      seo: avg('seo'),
      performance: avg('performance'),
      accessibility: avg('accessibility'),
      bestPractices: avg('bestPractices'),
    },
    scannedAt: new Date().toISOString(),
  }

  // Cache in localStorage
  localStorage.setItem('releaf_lighthouse_cache', JSON.stringify({ ...data, _cachedAt: Date.now() }))
  return data
}

// ── GET operations ──

export async function fetchBlogs(): Promise<BlogPost[]> {
  try {
    const res = await fetch(`${SHEETS_API_URL}?action=getBlogs`)
    const json = await res.json()
    if (json.success) return json.data
    console.error('fetchBlogs error:', json.error)
    return []
  } catch (err) {
    console.error('fetchBlogs network error:', err)
    return []
  }
}

// Returns false when the Apps Script web app is unreachable or denying access
// (it serves an HTML "Access denied" page instead of JSON). Used to warn the
// admin that the data source — not the data — is the problem.
export async function checkApiHealth(): Promise<boolean> {
  try {
    const res = await fetch(`${SHEETS_API_URL}?action=getConfig`)
    const text = await res.text()
    if (text.trimStart().startsWith('<')) return false
    return JSON.parse(text).success === true
  } catch {
    return false
  }
}

export async function fetchSiteConfig(): Promise<SiteConfig | null> {
  try {
    const res = await fetch(`${SHEETS_API_URL}?action=getConfig`)
    const json = await res.json()
    if (json.success) return json.data
    console.error('fetchSiteConfig error:', json.error)
    return null
  } catch (err) {
    console.error('fetchSiteConfig network error:', err)
    return null
  }
}

export async function fetchContacts(): Promise<ContactSubmission[]> {
  try {
    const res = await fetch(`${SHEETS_API_URL}?action=getContacts`)
    const json = await res.json()
    if (json.success) return json.data
    console.error('fetchContacts error:', json.error)
    return []
  } catch (err) {
    console.error('fetchContacts network error:', err)
    return []
  }
}

export async function fetchAnalytics(): Promise<AnalyticsData | null> {
  try {
    const res = await fetch(`${SHEETS_API_URL}?action=getAnalytics`)
    const json = await res.json()
    if (json.success) return json.data
    console.error('fetchAnalytics error:', json.error)
    return null
  } catch (err) {
    console.error('fetchAnalytics network error:', err)
    return null
  }
}

export async function checkPassword(password: string): Promise<boolean> {
  try {
    const res = await fetch(`${SHEETS_API_URL}?action=checkPassword&password=${encodeURIComponent(password)}`)
    const json = await res.json()
    // If the old script responds, it won't have the 'success' property
    if (json.success === undefined) throw new Error('Old API endpoint detected')
    return json.success && json.valid
  } catch {
    return false
  }
}

// ── POST operations ──

async function postAction(action: string, body: Record<string, unknown>): Promise<{ success: boolean; message?: string; error?: string }> {
  try {
    const res = await fetch(`${SHEETS_API_URL}?action=${action}`, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain' },
      body: JSON.stringify(body),
    })
    return await res.json()
  } catch (err) {
    return { success: false, error: String(err) }
  }
}

export function addBlog(blog: BlogPost) {
  return postAction('addBlog', blog as unknown as Record<string, unknown>)
}

export function updateBlog(blog: BlogPost) {
  return postAction('updateBlog', blog as unknown as Record<string, unknown>)
}

export function deleteBlog(slug: string) {
  return postAction('deleteBlog', { slug })
}

export function updateConfig(key: string, value: string) {
  return postAction('updateConfig', { key, value })
}

export function bulkUpdateConfig(entries: Record<string, string>) {
  return postAction('bulkUpdateConfig', { entries })
}

export function seedBlogs(blogs: BlogPost[]) {
  return postAction('seedBlogs', { blogs })
}
