import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { ArrowRight, Award, Calendar, Shield, BookOpen, Heart } from 'lucide-react'
import WhatsAppCTA from '../components/WhatsAppCTA'
import SectionReveal from '../components/SectionReveal'

function SobrietyCounter() {
  const sobrietyDate = new Date(2016, 10, 28) // Nov 28, 2016
  const now = new Date()
  const diff = now.getTime() - sobrietyDate.getTime()
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const years = Math.floor(days / 365)
  const remainingDays = days % 365
  const months = Math.floor(remainingDays / 30)
  const d = remainingDays % 30

  return (
    <div className="inline-flex items-center gap-3 bg-sage/15 border border-sage/20 rounded-full px-5 py-2.5">
      <Calendar className="w-4 h-4 text-sage" />
      <span className="text-sm text-white/70 font-medium">
        Sober since 28 November 2016 — <span className="text-sage font-bold">{years} years, {months} months, {d} days</span>
      </span>
    </div>
  )
}

export default function MyStoryPage() {
  return (
    <>
      <Helmet>
        <title>My Story — Rahul Seth, 8 Years Sober | Sobriety Coach India | Releaf</title>
        <meta
          name="description"
          content="On 28 November 2016, I chose sobriety. Today, 8 years later, I help others find the same freedom. Read Rahul Seth's personal recovery story and how it shaped Releaf."
        />
        <meta property="og:title" content="My Story — Rahul Seth, 8 Years Sober | Sobriety Coach India" />
        <meta property="og:url" content="https://releaf.co.in/my-story/" />
        <link rel="canonical" href="https://releaf.co.in/my-story/" />
      </Helmet>

      {/* Hero */}
      <section className="bg-forest text-white py-20 sm:py-28">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 hero-stagger">
          <p className="eyebrow text-sage/60 mb-4">My Story</p>
          <h1 className="text-white mb-6">
            On 28 November 2016,{' '}
            <em className="font-display italic text-sage">I chose sobriety.</em>
          </h1>
          <p className="text-lg text-white/60 font-light max-w-2xl mb-8 leading-relaxed">
            Today, 8 years later, I help others find the same freedom. This is my story — the real one.
          </p>
          <SobrietyCounter />
        </div>
      </section>

      {/* Story Content */}
      <section className="py-20 sm:py-28">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionReveal>
            <div className="flex justify-center mb-12">
              <img
                src="/rahul-portrait.jpg"
                alt="Rahul Seth"
                className="w-32 h-32 rounded-2xl object-cover border-2 border-sage/20"
              />
            </div>
          </SectionReveal>

          <SectionReveal delay={100}>
            <div className="prose prose-lg max-w-none">
              <h2 className="font-display text-2xl text-leaf mb-6">The beginning nobody sees</h2>
              <p className="text-moss leading-relaxed mb-6">
                I didn't plan to become an addict. Nobody does. It started the way it starts for most people — socially, casually, harmlessly. A drink here, a substance there. I was young, ambitious, and convinced I had it under control.
              </p>
              <p className="text-moss leading-relaxed mb-6">
                I didn't. By my late twenties, I was dependent on both alcohol and drugs. My relationships were falling apart. My health was deteriorating. I was living a double life — performing normalcy on the outside while spiraling on the inside.
              </p>

              <h2 className="font-display text-2xl text-leaf mb-6 mt-12">The turning point</h2>
              <p className="text-moss leading-relaxed mb-6">
                On 28 November 2016, I hit bottom. Not the dramatic kind you see in movies — the quiet kind. The kind where you're sitting alone at 3 AM and you know, with absolute clarity, that you cannot continue like this.
              </p>
              <p className="text-moss leading-relaxed mb-6">
                That night, I made a decision. Not a resolution. Not a "I'll try to cut back." A decision. I chose sobriety. And I've held that line every single day since.
              </p>

              <h2 className="font-display text-2xl text-leaf mb-6 mt-12">Why I do this work</h2>
              <p className="text-moss leading-relaxed mb-6">
                Recovery isn't easy. Some days it still isn't. But what I found on the other side — clarity, genuine connection, peace — was worth every difficult moment.
              </p>
              <p className="text-moss leading-relaxed mb-6">
                I became a certified Guidance Counsellor and trained in CBT and REBT because I wanted to combine what I'd learned through experience with what works in clinical practice. Not one or the other — both.
              </p>
              <p className="text-moss leading-relaxed mb-6">
                Today, I work as a sobriety coach and sober companion across India. I work with people who are where I was — struggling, ashamed, uncertain. And I walk alongside them because I know the road.
              </p>
            </div>
          </SectionReveal>
        </div>
      </section>

      {/* Credentials */}
      <section className="bg-mist py-20 sm:py-28">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionReveal>
            <p className="eyebrow mb-3">Credentials & Training</p>
            <h2 className="mb-10">Qualifications</h2>
          </SectionReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
              { icon: <Award className="w-6 h-6" />, title: 'Certified Guidance Counsellor', desc: 'Professional certification for therapeutic guidance and counselling.' },
              { icon: <BookOpen className="w-6 h-6" />, title: 'CBT Trained', desc: 'Cognitive Behavioural Therapy — evidence-based approach to changing patterns.' },
              { icon: <Shield className="w-6 h-6" />, title: 'REBT Trained', desc: 'Rational Emotive Behaviour Therapy — addressing irrational beliefs that fuel addiction.' },
              { icon: <Heart className="w-6 h-6" />, title: '8+ Years Personal Recovery', desc: 'Lived experience with both alcohol and drug addiction. Sober since 28 November 2016.' },
            ].map((cred, i) => (
              <SectionReveal key={i} delay={i * 80}>
                <div className="card-hover bg-white rounded-2xl border border-forest/8 p-7">
                  <div className="w-12 h-12 rounded-xl bg-leaf/10 flex items-center justify-center text-leaf mb-4">
                    {cred.icon}
                  </div>
                  <h3 className="text-base font-semibold text-forest mb-2">{cred.title}</h3>
                  <p className="text-sm text-moss leading-relaxed">{cred.desc}</p>
                </div>
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-forest py-20 sm:py-28">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <SectionReveal>
            <h2 className="text-white mb-4">
              If you're ready — or even if you're just wondering — reach out.
            </h2>
            <p className="text-base text-white/60 mb-8 max-w-lg mx-auto">
              I promise: no judgment, no pressure. Just an honest conversation.
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
            <p className="text-xs text-white/30">Completely confidential. No pressure to commit.</p>
          </SectionReveal>
        </div>
      </section>
    </>
  )
}
