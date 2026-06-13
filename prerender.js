import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const template = fs.readFileSync(path.resolve(__dirname, 'dist/index.html'), 'utf-8')
const { render } = await import('./dist-server/entry-server.js')

const blogsContent = fs.readFileSync('src/data/blogs.ts', 'utf-8')
const blogSlugs = [...blogsContent.matchAll(/slug:\s*"([^"]+)"/g)].map(m => m[1])

const routesToPrerender = [
  '/',
  '/my-story',
  '/how-i-help',
  '/book',
  '/stories',
  '/blog',
  '/sitemap',
  '/what-i-treat/alcohol',
  '/what-i-treat/drug-addiction',
  '/what-i-treat/anxiety',
  '/what-i-treat/depression',
  '/what-i-treat/cocaine',
  ...blogSlugs.map(slug => `/blog/${slug}`)
]

for (const url of routesToPrerender) {
  const helmetContext = {}
  const appHtml = render(url, helmetContext)
  
  const { helmet } = helmetContext
  let html = template.replace(`<!--app-html-->`, appHtml)
  
  if (helmet) {
    if (helmet.title) {
      html = html.replace(/<title>.*?<\/title>/, helmet.title.toString())
    }
    const metaAndLinks = `${helmet.meta ? helmet.meta.toString() : ''}\n${helmet.link ? helmet.link.toString() : ''}`
    html = html.replace('</head>', `${metaAndLinks}\n</head>`)
  }

  const filePath = url === '/' ? 'index.html' : `${url.replace(/^\//, '')}/index.html`
  const absolutePath = path.resolve(__dirname, 'dist', filePath)
  
  fs.mkdirSync(path.dirname(absolutePath), { recursive: true })
  fs.writeFileSync(absolutePath, html)
  console.log('pre-rendered:', filePath)
}

console.log('✨ All pages prerendered successfully!')
