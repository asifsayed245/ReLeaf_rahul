import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import WhatsAppCTA from '../components/WhatsAppCTA'
import SectionReveal from '../components/SectionReveal'
import { useBlogPosts } from '../data/useBlogPosts'
import { useSiteConfig } from '../data/useSiteConfig'

export default function BlogPage() {
  const { posts } = useBlogPosts()
  const { config } = useSiteConfig()

  return (
    <>
      <Helmet>
        <title>Blog — Sobriety, Recovery & Coaching Insights | Releaf — Rahul Seth</title>
        <meta
          name="description"
          content="Honest articles about sobriety, recovery, and the journey to a better life. Written by Rahul Seth — sobriety coach, 10 years sober."
        />
        <meta property="og:title" content="Blog — Sobriety, Recovery & Coaching Insights | Releaf" />
        <meta property="og:url" content="https://releaf.co.in/blog/" />
        <link rel="canonical" href="https://releaf.co.in/blog/" />
      </Helmet>

      {/* Hero */}
      <section className="bg-forest text-white py-20 sm:py-28">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 hero-stagger">
          <p className="eyebrow text-sage/60 mb-4">Blog</p>
          <h1 className="text-white mb-6 text-3xl sm:text-4xl">
            Honest thoughts on recovery,{' '}
            <em className="font-display italic text-sage">from experience.</em>
          </h1>
          <p className="text-lg text-white/60 font-light max-w-2xl leading-relaxed">
            Written by {config.ownerName}. Sober since {config.soberSince.split(' ')[2] || '2016'}. {config.certifications}.
          </p>
        </div>
      </section>

      {/* Blog Grid */}
      <section className="py-20 sm:py-28">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post, i) => (
              <SectionReveal key={post.slug} delay={i * 80}>
                <Link to={`/blog/${post.slug}`} className="block h-full">
                  <article className="card-hover bg-white rounded-2xl border border-forest/8 p-7 h-full flex flex-col group cursor-pointer">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-xs font-medium bg-dew text-bark px-3 py-1 rounded-full">{post.category}</span>
                      <span className="text-xs text-moss/50">{post.readTime}</span>
                    </div>
                    <h3 className="text-base font-semibold text-forest mb-3 group-hover:text-leaf transition-colors duration-200">
                      {post.title}
                    </h3>
                    <p className="text-sm text-moss leading-relaxed flex-1">
                      {post.excerpt}
                    </p>
                    <div className="mt-5 pt-4 border-t border-mist flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <img src={config.ownerPhoto || "/rahul-portrait.jpg"} alt={config.ownerName} className="w-6 h-6 rounded-full object-cover" />
                        <span className="text-xs text-moss/60">by {config.ownerName.split(' ')[0]} · {post.date}</span>
                      </div>
                      <span className="text-sm font-medium text-leaf group-hover:gap-2 inline-flex items-center gap-1 transition-all duration-200">
                        Read <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </article>
                </Link>
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Blog CTA */}
      <section className="bg-mist py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <SectionReveal>
            <div className="bg-white rounded-2xl border border-forest/8 p-8 sm:p-10 text-center">
              <h3 className="text-lg font-semibold text-forest mb-3">
                If this resonated with you
              </h3>
              <p className="text-sm text-moss leading-relaxed max-w-lg mx-auto mb-6">
                I offer a free 30-minute conversation — no commitment, just an honest chat about where you are and how I might help.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <WhatsAppCTA whatsappNumber={config.whatsappNumber} />
                <Link
                  to="/book"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-forest border border-forest/20 rounded-full px-6 py-3 hover:bg-forest hover:text-white transition-all duration-200"
                >
                  Book a Free Call <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </SectionReveal>
        </div>
      </section>
    </>
  )
}
