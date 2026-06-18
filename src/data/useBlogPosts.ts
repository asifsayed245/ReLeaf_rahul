import { useState, useEffect } from 'react'
import { fetchBlogs, type BlogPost } from '../admin/api/sheetsApi'
import { blogPosts as fallbackPosts } from './blogs'

export function useBlogPosts() {
  const [posts, setPosts] = useState<BlogPost[]>(fallbackPosts)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = async () => {
    setLoading(true)
    try {
      const data = await fetchBlogs()
      // Only use Sheets data if we got results; otherwise keep fallback
      if (data.length > 0) {
        // Filter to only published posts for the public site
        setPosts(data.filter(p => !p.status || p.status === 'published'))
      }
    } catch (err) {
      setError(String(err))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  return { posts, loading, error, refetch: load }
}
