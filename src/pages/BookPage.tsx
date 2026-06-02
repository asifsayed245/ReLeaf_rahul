import { Helmet } from 'react-helmet-async'
import { useState } from 'react'
import { Check, Phone, Clock, Send } from 'lucide-react'
import WhatsAppCTA from '../components/WhatsAppCTA'
import SectionReveal from '../components/SectionReveal'

export default function BookPage() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    message: '',
    timeSlot: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')
    
    try {
      const formParams = new URLSearchParams()
      formParams.append('name', formData.name)
      formParams.append('phone', formData.phone)
      formParams.append('email', formData.email)
      formParams.append('message', formData.message)
      formParams.append('timeSlot', formData.timeSlot)

      await fetch('https://script.google.com/macros/s/AKfycbyjEWM2acwvVl6Ipnhg2dwjV-PAH6fmF0-zdxzH1C1PkOL4ZIa4cCXfjxDjXfOGG9lA/exec', {
        method: 'POST',
        mode: 'no-cors',
        body: formParams,
      })
      
      setSubmitted(true)
    } catch (err) {
      setError('Something went wrong. Please try again or message me on WhatsApp.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const pricing = [
    { label: 'Start Here', title: 'Free 30-min Call', price: 'Free', desc: 'An honest conversation about where you are.', highlight: true },
    { label: 'Per Session', title: 'Individual Session', price: '₹6,000', desc: '60-minute one-on-one coaching.' },
    { label: 'Monthly Plan', title: '5 Sessions + Check-ins', price: '₹30,000', desc: '5 sessions + daily WhatsApp check-ins.' },
    { label: '6-Month Plan', title: 'Sustained Support', price: '20% off', desc: 'DM on WhatsApp to discuss.' },
  ]

  return (
    <>
      <Helmet>
        <title>Book a Free Consultation — Sobriety Coach Rahul Seth | Releaf</title>
        <meta
          name="description"
          content="Book a free 30-minute consultation with Rahul Seth, sobriety coach in Mumbai. Confidential, no commitment. WhatsApp or book a call."
        />
        <meta property="og:title" content="Book a Free Consultation — Sobriety Coach Rahul Seth | Releaf" />
        <meta property="og:url" content="https://releaf.co.in/book/" />
        <link rel="canonical" href="https://releaf.co.in/book/" />
      </Helmet>

      {/* Hero */}
      <section className="bg-forest text-white py-16 sm:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 hero-stagger">
          <p className="eyebrow text-sage/60 mb-4">Get in Touch</p>
          <h1 className="text-white text-3xl sm:text-4xl mb-4">
            Let's have an honest conversation.
          </h1>
          <p className="text-lg text-white/60 font-light max-w-2xl leading-relaxed">
            I personally read every message and reply within 24 hours.
          </p>
        </div>
      </section>

      {/* Pricing Summary */}
      <section className="py-14 bg-mist">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionReveal>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {pricing.map((p, i) => (
                <div
                  key={i}
                  className={`card-hover rounded-2xl p-5 text-center ${
                    p.highlight ? 'bg-forest text-white' : 'bg-white border border-forest/8'
                  }`}
                >
                  <p className={`text-[10px] font-bold tracking-widest uppercase mb-2 ${p.highlight ? 'text-sage/60' : 'text-sage'}`}>
                    {p.label}
                  </p>
                  <p className={`font-display text-xl mb-1 ${p.highlight ? 'text-white' : 'text-forest'}`}>
                    {p.price}
                  </p>
                  <p className={`text-xs ${p.highlight ? 'text-white/60' : 'text-moss/70'}`}>
                    {p.desc}
                  </p>
                </div>
              ))}
            </div>
          </SectionReveal>
        </div>
      </section>

      {/* Contact Form + WhatsApp */}
      <section className="py-20 sm:py-28">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            {/* Left: Form */}
            <SectionReveal>
              <div>
                <h2 className="mb-2">Book your free call</h2>
                <p className="text-sm text-moss mb-8">
                  30 minutes, free. I'll explain exactly how I can help.
                </p>

                {submitted ? (
                  <div className="bg-dew rounded-2xl p-10 text-center">
                    <div className="w-14 h-14 rounded-full bg-leaf/10 flex items-center justify-center text-leaf mx-auto mb-4">
                      <Check className="w-7 h-7" />
                    </div>
                    <h3 className="text-lg font-semibold text-forest mb-2">Message sent!</h3>
                    <p className="text-sm text-moss">
                      Thank you for reaching out. I'll reply within 24 hours. If it's urgent, message me on WhatsApp.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                      <label htmlFor="name" className="block text-xs font-bold tracking-widest uppercase text-sage mb-2">
                        First Name
                      </label>
                      <input
                        id="name"
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-3 bg-mist border border-forest/10 rounded-xl text-forest text-sm focus:outline-none focus:ring-2 focus:ring-leaf/30 focus:border-leaf transition-all"
                        placeholder="Your first name"
                      />
                    </div>

                    <div>
                      <label htmlFor="phone" className="block text-xs font-bold tracking-widest uppercase text-sage mb-2">
                        Phone
                      </label>
                      <input
                        id="phone"
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-4 py-3 bg-mist border border-forest/10 rounded-xl text-forest text-sm focus:outline-none focus:ring-2 focus:ring-leaf/30 focus:border-leaf transition-all"
                        placeholder="+91 98XXX XXXXX"
                      />
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-xs font-bold tracking-widest uppercase text-sage mb-2">
                        Email
                      </label>
                      <input
                        id="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-3 bg-mist border border-forest/10 rounded-xl text-forest text-sm focus:outline-none focus:ring-2 focus:ring-leaf/30 focus:border-leaf transition-all"
                        placeholder="your@email.com"
                      />
                    </div>

                    <div>
                      <label htmlFor="message" className="block text-xs font-bold tracking-widest uppercase text-sage mb-2">
                        What's been on your mind lately?
                      </label>
                      <textarea
                        id="message"
                        rows={4}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        className="w-full px-4 py-3 bg-mist border border-forest/10 rounded-xl text-forest text-sm focus:outline-none focus:ring-2 focus:ring-leaf/30 focus:border-leaf transition-all resize-none"
                        placeholder="Share whatever feels right. There's no wrong answer."
                      />
                    </div>

                    <div>
                      <label htmlFor="timeSlot" className="block text-xs font-bold tracking-widest uppercase text-sage mb-2">
                        Preferred Time
                      </label>
                      <select
                        id="timeSlot"
                        value={formData.timeSlot}
                        onChange={(e) => setFormData({ ...formData, timeSlot: e.target.value })}
                        className="w-full px-4 py-3 bg-mist border border-forest/10 rounded-xl text-forest text-sm focus:outline-none focus:ring-2 focus:ring-leaf/30 focus:border-leaf transition-all"
                      >
                        <option value="">Select a preference</option>
                        <option value="morning">Morning (9am – 12pm)</option>
                        <option value="afternoon">Afternoon (12pm – 5pm)</option>
                        <option value="evening">Evening (5pm – 8pm)</option>
                      </select>
                    </div>

                    {error && (
                      <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg border border-red-100">
                        {error}
                      </div>
                    )}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full flex items-center justify-center gap-2 bg-forest text-white font-semibold text-sm rounded-full py-3.5 cta-hover shadow-md shadow-forest/20 hover:bg-canopy disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          Send my message
                        </>
                      )}
                    </button>
                    <p className="text-xs text-moss/50 text-center">
                      Everything you share is completely confidential. I reply personally within 24 hours.
                    </p>
                  </form>
                )}
              </div>
            </SectionReveal>

            {/* Right: WhatsApp + Info */}
            <SectionReveal delay={200}>
              <div className="space-y-8">
                {/* WhatsApp Block */}
                <div className="bg-dew rounded-2xl p-8 border border-leaf/10">
                  <h3 className="text-lg font-semibold text-forest mb-3">
                    Prefer to message directly?
                  </h3>
                  <p className="text-sm text-moss mb-6 leading-relaxed">
                    That works too. Many of my clients prefer WhatsApp — it's quick, easy, and you can reach me anytime.
                  </p>
                  <WhatsAppCTA size="lg" className="w-full justify-center" />
                  <p className="text-xs text-moss/50 mt-3 text-center">
                    Completely confidential. No pressure to commit.
                  </p>
                </div>

                {/* Info Cards */}
                <div className="space-y-4">
                  <div className="flex items-start gap-4 bg-mist rounded-xl p-5">
                    <Phone className="w-5 h-5 text-leaf shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-forest">Free first call</p>
                      <p className="text-xs text-moss">30 minutes. No commitment. I'll listen and explain exactly how I can help.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 bg-mist rounded-xl p-5">
                    <Clock className="w-5 h-5 text-leaf shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-forest">Quick response</p>
                      <p className="text-xs text-moss">I personally respond to every message within 24 hours.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 bg-mist rounded-xl p-5">
                    <Check className="w-5 h-5 text-leaf shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-forest">100% confidential</p>
                      <p className="text-xs text-moss">Your details stay private. Everything we discuss is between us.</p>
                    </div>
                  </div>
                </div>

                {/* Limited Availability */}
                <div className="bg-amber/5 border border-amber/20 rounded-xl p-5">
                  <p className="text-sm text-forest leading-relaxed">
                    <span className="font-semibold">A note on availability:</span> I work with a limited number of clients at a time to ensure I can give each person the attention they deserve. If you're ready to start, I'd suggest reaching out soon.
                  </p>
                </div>
              </div>
            </SectionReveal>
          </div>
        </div>
      </section>
    </>
  )
}
