import { useState, useEffect } from 'react'
import { fetchSiteConfig, type SiteConfig } from '../admin/api/sheetsApi'

// Default fallback config so the site always renders even if Sheets is unreachable
const DEFAULT_CONFIG: SiteConfig = {
  ownerName: 'Rahul Seth',
  ownerTitle: 'Sobriety Coach & Certified Guidance Counsellor',
  ownerPhoto: '/rahul-portrait.jpg',
  ownerEmail: 'rahul@releaf.co.in',
  ownerPhone: '+91 98202 81442',
  whatsappNumber: '919820281442',
  location: 'Mumbai, India · Online across India',
  soberSince: '28 November 2016',
  certifications: 'Certified Guidance Counsellor · CBT & REBT Therapist',
  linkedIn: 'https://www.linkedin.com/in/rahulseth',
  instagram: 'https://www.instagram.com/releaf.co.in',
  adminPassword: '',
}

export function useSiteConfig() {
  const [config, setConfig] = useState<SiteConfig>(DEFAULT_CONFIG)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = async () => {
    setLoading(true)
    try {
      const data = await fetchSiteConfig()
      if (data) setConfig(data)
    } catch (err) {
      setError(String(err))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  return { config, loading, error, refetch: load }
}
