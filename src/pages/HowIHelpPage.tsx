import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { ArrowRight, MessageCircle, Users, Shield, BookOpen } from 'lucide-react'
import WhatsAppCTA from '../components/WhatsAppCTA'
import SectionReveal from '../components/SectionReveal'

export default function HowIHelpPage() {
  const services = [
    {
      icon: <MessageCircle className="w-8 h-8" />,
      title: 'Sober Coaching',
      slug: 'sober-coaching',
      desc: 'Ongoing guidance and support through every stage of recovery. We work together — through the hard days, the temptations, the breakthroughs — to build the life you want, sober.',
      best: 'Anyone at any stage of their recovery journey',
      includes: ['Weekly 1-on-1 sessions', 'Daily check-ins via WhatsApp', 'CBT & REBT techniques', 'Relapse prevention planning', 'Life skills coaching'],
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: 'Sober Companion',
      slug: 'sober-companion',
      desc: "Real-world accompaniment through the moments that matter. I'm with you at social events, during travel, through triggers — providing in-person support when you need it most.",
      best: 'Those navigating high-risk situations or social environments',
      includes: ['In-person accompaniment', 'Social event support', 'Travel companionship', 'Trigger management', 'Real-time crisis support'],
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: 'Rehab Transition Support',
      slug: 'rehab-support',
      desc: "The days after rehab are the most vulnerable. I help you bridge the gap between structured treatment and real life — because that's where most people struggle.",
      best: 'Anyone leaving a rehab facility or completing a treatment programme',
      includes: ['Post-rehab life planning', 'Daily accountability', 'Family communication coaching', 'Facility referral network', 'Structured re-entry support'],
    },
    {
      icon: <BookOpen className="w-8 h-8" />,
      title: '1-on-1 Sessions',
      slug: 'sessions',
      desc: 'Private deep-work sessions focused on the specific challenges you\'re facing right now. Combining CBT & REBT techniques with the understanding of someone who has been there.',
      best: 'Those wanting structured, therapeutic coaching for specific issues',
      includes: ['60-minute focused sessions', 'CBT & REBT frameworks', 'Personalised action plans', 'Online or in-person (Mumbai)', 'Flexible scheduling'],
    },
  ]

  return (
    <>
      <Helmet>
        <title>How I Help — Sobriety Coaching Services | Releaf — Rahul Seth</title>
        <meta
          name="description"
          content="Recovery looks different for everyone. Sober coaching, sober companion services, rehab transition support, and 1-on-1 sessions. Find the right support for where you are."
        />
        <meta property="og:title" content="How I Help — Sobriety Coaching Services | Releaf" />
        <meta property="og:url" content="https://releaf.co.in/how-i-help/" />
        <link rel="canonical" href="https://releaf.co.in/how-i-help/" />
      </Helmet>

      {/* Hero */}
      <section className="bg-forest text-white py-20 sm:py-28">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 hero-stagger">
          <p className="eyebrow text-sage/60 mb-4">Services</p>
          <h1 className="text-white mb-6">
            Recovery looks different for{' '}
            <em className="font-display italic text-sage">everyone.</em>
          </h1>
          <p className="text-lg text-white/60 font-light max-w-2xl leading-relaxed">
            Here's how I can support you at each stage. Not sure which is right? That's okay — we'll figure it out together.
          </p>
        </div>
      </section>

      {/* Service Cards */}
      <section className="py-20 sm:py-28">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          {services.map((s, i) => (
            <SectionReveal key={i} delay={i * 80}>
              <div className="card-hover bg-white rounded-2xl border border-forest/8 p-8 sm:p-10">
                <div className="flex flex-col sm:flex-row gap-8">
                  <div className="shrink-0">
                    <div className="w-16 h-16 rounded-2xl bg-leaf/10 flex items-center justify-center text-leaf">
                      {s.icon}
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-forest mb-3">{s.title}</h3>
                    <p className="text-moss leading-relaxed mb-5">{s.desc}</p>

                    <p className="text-xs font-bold tracking-widest uppercase text-sage mb-3">Best for</p>
                    <p className="text-sm text-moss mb-5">{s.best}</p>

                    <p className="text-xs font-bold tracking-widest uppercase text-sage mb-3">What's included</p>
                    <div className="flex flex-wrap gap-2 mb-6">
                      {s.includes.map((item, j) => (
                        <span key={j} className="text-xs font-medium bg-dew text-bark px-3 py-1.5 rounded-full border border-bark/10">
                          {item}
                        </span>
                      ))}
                    </div>

                    <Link
                      to="/book"
                      className="inline-flex items-center gap-2 text-sm font-semibold text-leaf hover:text-forest transition-colors duration-200"
                    >
                      Book a free consultation <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            </SectionReveal>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-forest py-20 sm:py-28">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <SectionReveal>
            <h2 className="text-white mb-4">
              Not sure which is right for you?
            </h2>
            <p className="text-base text-white/60 mb-8">
              Message me and we'll figure it out together. No commitment required.
            </p>
            <WhatsAppCTA size="lg" />
            <p className="text-xs text-white/30 mt-3">Completely confidential. No pressure to commit.</p>
          </SectionReveal>
        </div>
      </section>
    </>
  )
}
