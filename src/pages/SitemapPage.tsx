import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'

const sitePages = [
  {
    section: 'Main Pages',
    links: [
      { label: 'Home', to: '/', description: 'Welcome to ReLeaf — Sobriety Coaching by Rahul Seth' },
      { label: 'My Story', to: '/my-story', description: 'Rahul Seth\'s personal journey of recovery and sobriety' },
      { label: 'How I Help', to: '/how-i-help', description: 'Sobriety coaching services and how I support your recovery' },
      { label: 'Recovery Stories', to: '/stories', description: 'Real stories from people who transformed their lives' },
      { label: 'Blog', to: '/blog', description: 'Articles on sobriety, addiction recovery, and wellness' },
      { label: 'Book a Session', to: '/book', description: 'Schedule a free 30-minute consultation' },
    ],
  },
  {
    section: 'Services',
    links: [
      { label: 'Sober Coaching', to: '/how-i-help/sober-coaching', description: 'One-on-one sobriety coaching sessions' },
      { label: 'Sober Companion', to: '/how-i-help/sober-companion', description: 'In-person sober companion support' },
      { label: 'Rehab Support', to: '/how-i-help/rehab-support', description: 'Pre and post rehabilitation support' },
      { label: 'Sessions', to: '/how-i-help/sessions', description: 'Individual and group coaching sessions' },
    ],
  },
  {
    section: 'Blog Articles',
    links: [
      { label: 'Healing Beyond Rehab', to: '/blog/healing-beyond-rehab', description: 'Why recovery doesn\'t end when rehab does' },
      { label: 'Addiction Isn\'t Just About the Substance', to: '/blog/addiction-isnt-just-about-the-substance', description: 'Understanding the deeper roots of addiction' },
      { label: 'Top 5 Challenges of Staying Sober in Mumbai', to: '/blog/top-5-challenges-of-staying-sober-in-mumbai', description: 'Navigating sobriety in Mumbai\'s social landscape' },
      { label: 'Why Sobriety Coaching is the Best Alternative to Rehab in Mumbai', to: '/blog/why-sobriety-coaching-is-the-best-alternative-to-rehab-in-mumbai', description: 'Comparing coaching vs. traditional rehabilitation' },
      { label: 'Finding Freedom — How Rahul Seth Helped Me Break Free', to: '/blog/finding-freedom-how-rahul-seth-helped-me-break-free-from-addiction', description: 'A client\'s story of breaking free from addiction' },
      { label: 'How Rahul Seth Helped Me Find Myself Again', to: '/blog/how-rahul-seth-helped-me-find-myself-again', description: 'Rediscovering identity through sobriety coaching' },
      { label: 'A Letter of Gratitude to Rahul Seth and ReLeaf', to: '/blog/a-letter-of-gratitude-to-rahul-seth-and-releaf', description: 'A heartfelt thank-you from a recovering client' },
      { label: 'How Rahul Seth Helped Me Reclaim My Life', to: '/blog/how-rahul-seth-helped-me-reclaim-my-life', description: 'Reclaiming purpose and meaning through recovery' },
      { label: '10 Motivational Steps to Recovery from Addiction', to: '/blog/10-motivational-steps-to-recovery-from-addiction', description: 'Practical steps for starting your recovery journey' },
      { label: 'From Relapse to Resilience — Rahul Seth\'s Journey', to: '/blog/from-relapse-to-resilience-the-inspiring-journey-of-rahul-seth', description: 'How relapse became a stepping stone to lasting recovery' },
      { label: 'Motivation to Achieve Sobriety', to: '/blog/motivation-to-achieve-sobriety-your-path-to-a-healthier-happier-life', description: 'Finding the motivation to begin your sobriety path' },
      { label: 'Unlock a Healthier, Happier Life', to: '/blog/unlock-a-healthier-happier-life-sobriety-and-life-coaching-consultations', description: 'How coaching consultations can transform your life' },
    ],
  },
]

export default function SitemapPage() {
  return (
    <>
      <Helmet>
        <title>Sitemap | ReLeaf — Sobriety Coaching by Rahul Seth</title>
        <meta name="description" content="Browse all pages on ReLeaf — sobriety coaching, recovery stories, blog articles, and more by Rahul Seth." />
      </Helmet>

      <section className="min-h-screen bg-white pt-28 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-serif text-3xl md:text-4xl text-stone-800 mb-2">Sitemap</h1>
          <p className="text-stone-500 mb-10">All pages on releaf.co.in</p>

          {sitePages.map((group) => (
            <div key={group.section} className="mb-10">
              <h2 className="font-serif text-xl text-stone-700 border-b border-stone-200 pb-2 mb-4">
                {group.section}
              </h2>
              <ul className="space-y-3">
                {group.links.map((link) => (
                  <li key={link.to}>
                    <Link
                      to={link.to}
                      className="text-emerald-700 hover:text-emerald-900 font-medium transition-colors"
                    >
                      {link.label}
                    </Link>
                    <p className="text-sm text-stone-400 mt-0.5">{link.description}</p>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}
