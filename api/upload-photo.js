import { put } from '@vercel/blob'

// Receives a resized image as a base64 data URL and stores it in Vercel Blob,
// returning a public CDN URL. This gives the profile photo a real, fast,
// crawlable address (good for SEO) instead of an inline data string.
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ success: false, error: 'Method not allowed' })
    return
  }

  try {
    const { dataUrl, name } = req.body || {}
    const match = typeof dataUrl === 'string' && dataUrl.match(/^data:(image\/[a-zA-Z+]+);base64,(.+)$/)
    if (!match) {
      res.status(400).json({ success: false, error: 'Invalid image data' })
      return
    }

    const contentType = match[1]
    const buffer = Buffer.from(match[2], 'base64')
    if (buffer.length > 3 * 1024 * 1024) {
      res.status(413).json({ success: false, error: 'Image too large (max 3MB)' })
      return
    }

    const ext = contentType.split('/')[1].replace('jpeg', 'jpg')
    const slug =
      String(name || 'profile')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '') || 'profile'

    const blob = await put(`profile/${slug}.${ext}`, buffer, {
      access: 'public',
      contentType,
      addRandomSuffix: true,
      token: process.env.BLOB_READ_WRITE_TOKEN,
    })

    res.status(200).json({ success: true, url: blob.url })
  } catch (err) {
    res.status(500).json({ success: false, error: String((err && err.message) || err) })
  }
}
