import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { Sparkles, ArrowRight } from 'lucide-react'
import WhatsAppCTA from '../components/WhatsAppCTA'
import SectionReveal from '../components/SectionReveal'

const stories = [
  {
    quote: "Rahul didn't just help me stop drinking — he helped me understand why I started. That changed everything. For the first time in years, I feel like I'm actually living, not just surviving.",
    name: 'A.K.',
    detail: '42, Mumbai — 14 months sober',
    condition: 'Alcohol dependency',
  },
  {
    quote: "After three failed rehab attempts, I'd given up on myself. Rahul hadn't. His consistent, patient support — the daily check-ins, the honest conversations — kept me going when I wanted to quit.",
    name: 'R.M.',
    detail: '35, Pune — 9 months sober',
    condition: 'Drug & alcohol dependency',
  },
  {
    quote: "Having someone who genuinely understood what I was going through made all the difference. Not from a textbook — from experience. That trust was everything.",
    name: 'S.P.',
    detail: '29, Delhi — 18 months sober',
    condition: 'Substance abuse',
  },
  {
    quote: "What struck me was Rahul's honesty. He never promised easy answers. He told me recovery would be hard — and then he walked through it with me. That respect meant the world.",
    name: 'N.D.',
    detail: '38, Bangalore — 11 months sober',
    condition: 'Alcohol dependency',
  },
  {
    quote: "I came to Rahul not for myself, but for my son. He helped me understand what my son was going through and showed me how to support him without enabling him.",
    name: 'P.S.',
    detail: '56, Mumbai — family support',
    condition: 'Family coaching',
  },
  {
    quote: "The sober companion service was a game-changer. Having Rahul with me at a family wedding — a situation I'd have used as an excuse before — gave me the confidence to stay the course.",
    name: 'V.K.',
    detail: '31, Mumbai — 7 months sober',
    condition: 'Sober companion',
  },
]

export default function StoriesPage() {
  return (
    <>
      <Helmet>
        <title>Recovery Stories — Real Journeys | Releaf — Rahul Seth</title>
        <meta
          name="description"
          content="Real stories from real people. Read about the recovery journeys I've had the privilege of walking alongside. Names changed for privacy."
        />
        <meta property="og:title" content="Recovery Stories — Real Journeys | Releaf" />
        <meta property="og:url" content="https://releaf.co.in/stories/" />
        <link rel="canonical" href="https://releaf.co.in/stories/" />
      </Helmet>

      {/* Hero */}
      <section className="bg-forest text-white py-20 sm:py-28">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 hero-stagger">
          <p className="eyebrow text-sage/60 mb-4">Stories</p>
          <h1 className="text-white mb-6 text-3xl sm:text-4xl">
            Here are some of the journeys I've had the{' '}
            <em className="font-display italic text-sage">privilege</em> of walking alongside.
          </h1>
          <p className="text-lg text-white/60 font-light max-w-2xl leading-relaxed">
            Every story is shared with permission. Names and identifying details have been changed for privacy.
          </p>
        </div>
      </section>

      {/* Stories Grid */}
      <section className="py-20 sm:py-28">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {stories.map((story, i) => (
              <SectionReveal key={i} delay={i * 80}>
                <div className="card-hover bg-white rounded-2xl border border-forest/8 p-8 h-full flex flex-col">
                  <Sparkles className="w-5 h-5 text-amber mb-4 shrink-0" />
                  <blockquote className="text-moss leading-relaxed flex-1 italic">
                    "{story.quote}"
                  </blockquote>
                  <div className="mt-6 pt-5 border-t border-mist flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-forest">{story.name}</p>
                      <p className="text-xs text-moss/60">{story.detail}</p>
                    </div>
                    <span className="text-xs font-medium bg-dew text-bark px-3 py-1 rounded-full">
                      {story.condition}
                    </span>
                  </div>
                  <p className="text-[10px] text-moss/40 mt-3">Name and identifying details changed with permission.</p>
                </div>
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Share Your Story */}
      <section className="bg-mist py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <SectionReveal>
            <h2 className="mb-4">Share your story</h2>
            <p className="text-moss max-w-lg mx-auto mb-6 leading-relaxed">
              If your journey with Releaf has made a difference and you'd like to share it — I'd be honoured to include it here.
            </p>
            <WhatsAppCTA label="Share Your Story" />
          </SectionReveal>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-forest py-20 sm:py-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <SectionReveal>
            <h2 className="text-white mb-4">Ready to write your own story?</h2>
            <p className="text-white/60 mb-8">
              The first call is free. 30 minutes. No commitment.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-3">
              <WhatsAppCTA size="lg" />
              <Link
                to="/book"
                className="inline-flex items-center gap-2 text-sm font-semibold text-white border border-white/30 rounded-full px-7 py-3.5 hover:bg-white hover:text-forest transition-all duration-200"
              >
                Book a Free Call <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <p className="text-xs text-white/30">Confidential. I reply within 24 hours.</p>
          </SectionReveal>
        </div>
      </section>
    </>
  )
}
