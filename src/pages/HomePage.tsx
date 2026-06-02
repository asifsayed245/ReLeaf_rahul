import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { ArrowRight, Shield, Award, Clock, Users, Heart, MessageCircle, BookOpen, Sparkles } from 'lucide-react'
import WhatsAppCTA from '../components/WhatsAppCTA'
import SectionReveal from '../components/SectionReveal'

/* ═══════════════════════════ HERO ═══════════════════════════ */
function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-forest">
      {/* Video Background */}
      <div className="absolute inset-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          poster="/rahul-portrait.jpg"
        >
          <source src="/hero-video.mp4" type="video/mp4" />
        </video>
        {/* Adjusted overlay for text contrast while making video more visible */}
        <div className="absolute inset-0 bg-gradient-to-t from-forest via-forest/65 to-forest/50 z-10" />
        <div className="absolute inset-0 bg-forest/20 z-10" />
      </div>

      <div className="relative z-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center hero-stagger">
        {/* Eyebrow */}
        <p className="text-xs sm:text-sm font-medium tracking-widest uppercase text-sage/80 mb-6">
          Certified Guidance Counsellor · CBT & REBT · Sober since 2016
        </p>

        {/* H1 */}
        <h1 className="text-white mb-6 max-w-4xl mx-auto">
          There is a way through.{' '}
          <em className="font-display italic text-sage">I know because I've walked it.</em>
        </h1>

        {/* Sub-copy */}
        <p className="text-lg sm:text-xl text-white/60 font-light max-w-2xl mx-auto mb-10 leading-relaxed">
          Sobriety coaching from someone who has been exactly where you are.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
          <WhatsAppCTA size="lg" />
          <Link
            to="/my-story"
            className="inline-flex items-center gap-2 text-white/70 hover:text-white font-medium transition-colors duration-200"
          >
            Read my story <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Bottom identity */}
        <div className="flex items-center justify-center gap-3">
          <img
            src="/rahul-portrait.jpg"
            alt="Rahul Seth - Sobriety Coach"
            className="w-12 h-12 rounded-full object-cover border-2 border-sage/30"
          />
          <div className="text-left">
            <p className="text-white text-sm font-medium">Rahul Seth</p>
            <p className="text-white/50 text-xs">8 years sober · Certified CBT coach</p>
          </div>
        </div>
      </div>

      {/* Micro-copy under hero */}
      <p className="absolute bottom-6 left-0 right-0 text-center text-xs text-white/30">
        Completely confidential. No pressure to commit.
      </p>
    </section>
  )
}

/* ═══════════════════════════ TRUST STRIP ═══════════════════════════ */
function TrustStrip() {
  const facts = [
    { icon: <Clock className="w-5 h-5" />, text: '8 Years Sober' },
    { icon: <Award className="w-5 h-5" />, text: 'Certified CBT & REBT' },
    { icon: <Users className="w-5 h-5" />, text: 'Online Across India' },
  ]

  return (
    <section className="bg-canopy border-y border-white/5">
      <div className="max-w-5xl mx-auto px-4 py-5 flex flex-wrap items-center justify-center gap-6 sm:gap-12">
        {facts.map((fact, i) => (
          <div key={i} className="flex items-center gap-2.5 text-white/80">
            <span className="text-sage">{fact.icon}</span>
            <span className="text-sm font-medium tracking-wide">{fact.text}</span>
          </div>
        ))}
      </div>
    </section>
  )
}

/* ═══════════════════════════ STORY INTRO ═══════════════════════════ */
function StoryIntro() {
  return (
    <section className="bg-mist">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
        <SectionReveal>
          <div className="flex flex-col md:flex-row items-center gap-10 md:gap-16">
            <img
              src="/rahul-portrait.jpg"
              alt="Rahul Seth"
              className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover shrink-0 border-2 border-sage/20"
            />
            <div>
              <blockquote className="font-display text-xl sm:text-2xl text-leaf leading-relaxed italic mb-6">
                "On 28 November 2016, I made a decision that changed my life. I chose sobriety. Today, 8 years later, I help others find the same freedom."
              </blockquote>
              <Link
                to="/my-story"
                className="inline-flex items-center gap-2 text-forest font-semibold hover:text-leaf transition-colors duration-200"
              >
                Read my full story <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </SectionReveal>
      </div>
    </section>
  )
}

/* ═══════════════════════════ SELF SELECTION ═══════════════════════════ */
function SelfSelection() {
  const options = [
    {
      icon: <Heart className="w-8 h-8" />,
      title: "I'm struggling and need support",
      desc: 'Whether it\'s alcohol, drugs, or both — I\'ll help you find your path to sobriety with personal coaching.',
      link: '/how-i-help',
      color: 'from-leaf/10 to-sage/5',
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "I've finished rehab and need accountability",
      desc: 'Post-rehab life is hard. I provide ongoing support, daily check-ins, and real-world companion support.',
      link: '/how-i-help',
      color: 'from-amber/10 to-amber/5',
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "I'm worried about someone I love",
      desc: 'If you\'re here for a family member or partner, I can help you understand the best path forward.',
      link: '/how-i-help',
      color: 'from-sky/10 to-sky/5',
    },
  ]

  return (
    <section className="py-20 sm:py-28">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionReveal>
          <div className="text-center mb-14">
            <p className="eyebrow mb-3">Find Your Path</p>
            <h2>Where are you right now?</h2>
          </div>
        </SectionReveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {options.map((opt, i) => (
            <SectionReveal key={i} delay={i * 100}>
              <Link
                to={opt.link}
                className={`card-hover block rounded-2xl border border-forest/8 p-8 bg-gradient-to-br ${opt.color} group`}
              >
                <div className="text-leaf mb-4 group-hover:scale-110 transition-transform duration-200">
                  {opt.icon}
                </div>
                <h3 className="text-lg font-semibold text-forest mb-3">{opt.title}</h3>
                <p className="text-sm text-moss leading-relaxed">{opt.desc}</p>
                <span className="inline-flex items-center gap-1 mt-4 text-sm font-medium text-leaf group-hover:gap-2 transition-all duration-200">
                  Learn more <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </Link>
            </SectionReveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ═══════════════════════════ SERVICES ═══════════════════════════ */
function ServicesOverview() {
  const services = [
    {
      icon: <MessageCircle className="w-6 h-6" />,
      title: 'Sober Coaching',
      desc: 'Ongoing guidance through every stage of recovery. We work together to build the life you want, sober.',
      best: 'Anyone at any stage of their recovery journey',
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: 'Sober Companion',
      desc: 'Real-world accompaniment — social events, triggers, transitions. I\'m with you in the moments that matter.',
      best: 'Those navigating high-risk situations or social environments',
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: 'Rehab Transition Support',
      desc: 'The days after rehab are the most vulnerable. I help you bridge the gap between treatment and real life.',
      best: 'Anyone leaving a rehab facility',
    },
    {
      icon: <BookOpen className="w-6 h-6" />,
      title: '1-on-1 Sessions',
      desc: 'Private deep-work sessions. CBT & REBT techniques for the specific challenges you\'re facing right now.',
      best: 'Those wanting structured, therapeutic coaching',
    },
  ]

  return (
    <section className="bg-mist py-20 sm:py-28">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionReveal>
          <div className="text-center mb-14">
            <p className="eyebrow mb-3">Services</p>
            <h2>How I can help</h2>
          </div>
        </SectionReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {services.map((s, i) => (
            <SectionReveal key={i} delay={i * 80}>
              <div className="card-hover bg-white rounded-2xl border border-forest/8 p-7 h-full">
                <div className="w-12 h-12 rounded-xl bg-leaf/10 flex items-center justify-center text-leaf mb-5">
                  {s.icon}
                </div>
                <h3 className="text-lg font-semibold text-forest mb-2">{s.title}</h3>
                <p className="text-sm text-moss leading-relaxed mb-4">{s.desc}</p>
                <p className="text-xs text-sage font-medium">
                  <span className="font-bold text-leaf">Best for:</span> {s.best}
                </p>
                <div className="mt-5 flex items-center gap-3">
                  <Link to="/how-i-help" className="text-sm font-medium text-leaf hover:text-forest transition-colors duration-200 inline-flex items-center gap-1">
                    Learn more <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </SectionReveal>
          ))}
        </div>

        <SectionReveal delay={400}>
          <div className="text-center mt-10">
            <WhatsAppCTA />
            <p className="text-xs text-moss/60 mt-2">Completely confidential. No pressure to commit.</p>
          </div>
        </SectionReveal>
      </div>
    </section>
  )
}

/* ═══════════════════════════ TESTIMONIALS ═══════════════════════════ */
function Testimonials() {
  const testimonials = [
    {
      quote: "Rahul didn't just help me stop drinking — he helped me understand why I started. That changed everything.",
      name: 'A.K.',
      detail: '42, Mumbai — 14 months sober',
    },
    {
      quote: "Having someone who genuinely understood what I was going through made all the difference. Rahul has been there. He gets it.",
      name: 'R.M.',
      detail: '35, Pune — 9 months sober',
    },
    {
      quote: "After rehab, I felt lost. Rahul's ongoing support was the bridge between treatment and actually living my life again.",
      name: 'S.P.',
      detail: '29, Delhi — 18 months sober',
    },
  ]

  return (
    <section className="py-20 sm:py-28">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionReveal>
          <div className="text-center mb-14">
            <p className="eyebrow mb-3">Real Stories</p>
            <h2>Some of the journeys I've been privileged to walk alongside</h2>
          </div>
        </SectionReveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <SectionReveal key={i} delay={i * 120}>
              <div className="card-hover bg-white rounded-2xl border border-forest/8 p-7 h-full flex flex-col">
                <Sparkles className="w-5 h-5 text-amber mb-4" />
                <blockquote className="text-sm text-moss leading-relaxed flex-1 italic">
                  "{t.quote}"
                </blockquote>
                <div className="mt-5 pt-5 border-t border-mist">
                  <p className="text-sm font-semibold text-forest">{t.name}</p>
                  <p className="text-xs text-moss/60">{t.detail}</p>
                </div>
                <p className="text-[10px] text-moss/40 mt-2">Name and identifying details changed with permission.</p>
              </div>
            </SectionReveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ═══════════════════════════ CREDENTIALS ═══════════════════════════ */
function Credentials() {
  const points = [
    { label: 'Sober Since', value: '28 November 2016 — 8+ years of personal recovery' },
    { label: 'Certifications', value: 'Certified Guidance Counsellor · CBT & REBT Therapist' },
    { label: 'Experience', value: 'Personal experience with both alcohol and drug addiction' },
    { label: 'Approach', value: 'Evidence-based coaching combined with lived experience' },
    { label: 'Availability', value: 'In-person in Mumbai · Online across all of India' },
  ]

  return (
    <section className="bg-forest text-white py-20 sm:py-28">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionReveal>
          <div className="flex flex-col md:flex-row items-start gap-12 md:gap-16">
            <div className="shrink-0">
              <img
                src="/rahul-portrait.jpg"
                alt="Rahul Seth - Sobriety Coach"
                className="w-28 h-28 rounded-2xl object-cover border-2 border-sage/20"
              />
            </div>
            <div>
              <p className="eyebrow text-sage/60 mb-3">Why Me</p>
              <h2 className="text-white mb-8">What makes working with me different</h2>
              <div className="space-y-5">
                {points.map((p, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="w-1 bg-sage/30 rounded-full shrink-0" />
                    <div>
                      <p className="text-xs font-bold tracking-widest uppercase text-sage/60 mb-1">{p.label}</p>
                      <p className="text-sm text-white/80 leading-relaxed">{p.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </SectionReveal>
      </div>
    </section>
  )
}

/* ═══════════════════════════ PRICING PREVIEW ═══════════════════════════ */
function PricingPreview() {
  const steps = [
    { label: 'Start Here', title: 'Free 30-min Call', price: 'Free', desc: 'An honest conversation about where you are.' },
    { label: 'Per Session', title: 'Individual Session', price: '₹6,000', desc: 'One-on-one coaching, CBT & REBT.' },
    { label: 'Monthly', title: 'Monthly Plan', price: '₹30,000', desc: '5 sessions + daily check-ins.' },
    { label: 'Best Value', title: '6-Month Plan', price: '20% off', desc: 'Sustained support for lasting change.' },
  ]

  return (
    <section className="py-20 sm:py-28">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionReveal>
          <div className="text-center mb-14">
            <p className="eyebrow mb-3">Investment in Yourself</p>
            <h2>How it works</h2>
            <p className="text-sm text-moss/70 mt-4 max-w-xl mx-auto">
              Pricing is designed to make ongoing support accessible. The first call is always free — no commitment, just a conversation.
            </p>
          </div>
        </SectionReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {steps.map((s, i) => (
            <SectionReveal key={i} delay={i * 80}>
              <div className={`card-hover rounded-2xl p-6 text-center h-full ${i === 0 ? 'bg-forest text-white' : 'bg-mist border border-forest/5'}`}>
                <p className={`text-[10px] font-bold tracking-widest uppercase mb-3 ${i === 0 ? 'text-sage/60' : 'text-sage'}`}>
                  {s.label}
                </p>
                <p className={`font-display text-2xl mb-1 ${i === 0 ? 'text-white' : 'text-forest'}`}>
                  {s.price}
                </p>
                <p className={`text-sm font-semibold mb-2 ${i === 0 ? 'text-sage' : 'text-leaf'}`}>
                  {s.title}
                </p>
                <p className={`text-xs leading-relaxed ${i === 0 ? 'text-white/60' : 'text-moss/70'}`}>
                  {s.desc}
                </p>
              </div>
            </SectionReveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ═══════════════════════════ BLOG PREVIEW ═══════════════════════════ */
function BlogPreview() {
  const posts = [
    {
      title: 'The First 30 Days: What Nobody Tells You About Early Sobriety',
      excerpt: 'The hardest part isn\'t quitting — it\'s learning to live differently. Here\'s what I wish someone had told me.',
      date: 'May 2026',
    },
    {
      title: 'Why Recovery Coaching is Not the Same as Therapy',
      excerpt: 'Understanding the difference can help you choose the right support for where you are right now.',
      date: 'April 2026',
    },
    {
      title: 'Navigating Social Events When You\'re Sober',
      excerpt: 'Practical strategies from someone who has been to every party, wedding, and dinner sober.',
      date: 'March 2026',
    },
  ]

  return (
    <section className="bg-mist py-20 sm:py-28">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionReveal>
          <div className="text-center mb-14">
            <p className="eyebrow mb-3">From My Desk</p>
            <h2>Latest thoughts</h2>
          </div>
        </SectionReveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {posts.map((post, i) => (
            <SectionReveal key={i} delay={i * 100}>
              <Link to="/blog" className="card-hover block bg-white rounded-2xl border border-forest/8 p-7 h-full group">
                <p className="text-xs text-sage font-medium mb-3">{post.date} · by Rahul</p>
                <h3 className="text-base font-semibold text-forest mb-3 group-hover:text-leaf transition-colors duration-200">
                  {post.title}
                </h3>
                <p className="text-sm text-moss leading-relaxed">{post.excerpt}</p>
                <span className="inline-flex items-center gap-1 mt-4 text-sm font-medium text-leaf group-hover:gap-2 transition-all duration-200">
                  Read article <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </Link>
            </SectionReveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ═══════════════════════════ FINAL CTA ═══════════════════════════ */
function FinalCTA() {
  return (
    <section className="bg-forest py-20 sm:py-28">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
        <SectionReveal>
          <h2 className="font-display text-3xl sm:text-4xl text-white mb-4">
            Ready to take the first step?
          </h2>
          <p className="text-base text-white/60 mb-10 max-w-lg mx-auto leading-relaxed">
            The first call is free. 30 minutes. No commitment. Just an honest conversation about where you are and how I can help.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-4">
            <WhatsAppCTA size="lg" />
            <Link
              to="/book"
              className="inline-flex items-center gap-2 text-sm font-semibold text-white border border-white/30 rounded-full px-7 py-3.5 hover:bg-white hover:text-forest transition-all duration-200"
            >
              Book a Free Call
            </Link>
          </div>
          <p className="text-xs text-white/30">
            Confidential. I reply within 24 hours.
          </p>
        </SectionReveal>
      </div>
    </section>
  )
}

/* ═══════════════════════════ HOME PAGE ═══════════════════════════ */
export default function HomePage() {
  return (
    <>
      <Helmet>
        <title>Sober Coach in Mumbai & Online India | Releaf — Rahul Seth</title>
        <meta
          name="description"
          content="I've been where you are. 8 years sober, certified CBT coach. Personalised sobriety coaching, sober companion support, and rehab transition guidance across India. Free 30-min consultation."
        />
        <meta property="og:title" content="Sober Coach in Mumbai & Online India | Releaf — Rahul Seth" />
        <meta property="og:description" content="Sobriety coaching from someone who has been exactly where you are. 8 years sober, certified CBT & REBT coach." />
        <meta property="og:url" content="https://releaf.co.in/" />
        <link rel="canonical" href="https://releaf.co.in/" />
      </Helmet>

      <HeroSection />
      <TrustStrip />
      <StoryIntro />
      <SelfSelection />
      <ServicesOverview />
      <Testimonials />
      <Credentials />
      <PricingPreview />
      <BlogPreview />
      <FinalCTA />
    </>
  )
}
