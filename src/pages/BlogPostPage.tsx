import { useParams, Navigate, Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import ReactMarkdown from 'react-markdown'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { useBlogPosts } from '../data/useBlogPosts'
import { useSiteConfig } from '../data/useSiteConfig'
import WhatsAppCTA from '../components/WhatsAppCTA'

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>()
  const { posts } = useBlogPosts()
  const { config } = useSiteConfig()
  const post = posts.find((p) => p.slug === slug)

  if (!post) {
    return <Navigate to="/blog" replace />
  }

  return (
    <>
      <Helmet>
        <title>{`${post.title} | Releaf — ${config.ownerName}`}</title>
        <meta name="description" content={post.excerpt} />
        <meta property="og:title" content={`${post.title} | Releaf`} />
        <meta property="og:description" content={post.excerpt} />
        <meta property="og:url" content={`https://releaf.co.in/blog/${post.slug}`} />
        <meta property="og:type" content="article" />
        <link rel="canonical" href={`https://releaf.co.in/blog/${post.slug}`} />
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: post.title,
            description: post.excerpt,
            datePublished: post.dateISO || post.date,
            author: {
              '@type': 'Person',
              name: config.ownerName,
              url: 'https://releaf.co.in/my-story',
            },
            publisher: {
              '@type': 'Organization',
              name: 'Releaf',
              url: 'https://releaf.co.in',
            },
            mainEntityOfPage: {
              '@type': 'WebPage',
              '@id': `https://releaf.co.in/blog/${post.slug}`,
            },
          })}
        </script>
      </Helmet>

      {/* Hero Section */}
      <section className="bg-forest text-white py-20 sm:py-28">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-sage/80 hover:text-sage transition-colors duration-200 mb-8 font-medium text-sm"
          >
            <ArrowLeft className="w-4 h-4" /> Back to all articles
          </Link>
          
          <div className="flex items-center gap-3 mb-6">
            <span className="text-xs font-medium bg-sage/20 text-sage px-3 py-1 rounded-full">
              {post.category}
            </span>
            <span className="text-xs text-white/60">{post.readTime}</span>
          </div>
          
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-display leading-tight mb-8">
            {post.title}
          </h1>
          
          <div className="flex items-center gap-3 pt-6 border-t border-white/10">
            <img src={config.ownerPhoto || "/rahul-portrait.jpg"} alt={config.ownerName} className="w-10 h-10 rounded-full object-cover" />
            <div>
              <p className="text-sm font-medium">{config.ownerName}</p>
              <p className="text-xs text-white/60">{post.date}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Article Body */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <article className="prose prose-lg prose-p:text-moss prose-headings:text-forest prose-a:text-leaf prose-strong:text-forest prose-li:text-moss max-w-none">
            <ReactMarkdown>{post.content}</ReactMarkdown>
          </article>
        </div>
      </section>

      {/* Article CTA */}
      <section className="bg-mist py-16 sm:py-24 border-t border-forest/10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h3 className="text-2xl font-display text-forest mb-4">
            Ready to take the next step?
          </h3>
          <p className="text-moss leading-relaxed max-w-xl mx-auto mb-8">
            If this resonated with you and you're looking for guidance, I offer a free 30-minute conversation. No commitment, just an honest chat.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <WhatsAppCTA whatsappNumber={config.whatsappNumber} />
            <Link
              to="/book"
              className="inline-flex items-center gap-2 font-semibold text-forest border border-forest/20 rounded-full px-8 py-3.5 hover:bg-forest hover:text-white transition-all duration-200"
            >
              Book a Free Call <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
