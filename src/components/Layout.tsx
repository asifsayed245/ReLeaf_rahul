import { useState, useEffect, useCallback } from 'react'
import { Link, useLocation, Outlet } from 'react-router-dom'
import { Menu, X, Phone } from 'lucide-react'
import WhatsAppCTA from './WhatsAppCTA'

/* ═══════════════════════════ NAVBAR ═══════════════════════════ */
function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close drawer on route change
  useEffect(() => {
    setIsOpen(false)
  }, [location])

  // Prevent body scroll when drawer is open
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  const navLinks = [
    { label: 'My Story', to: '/my-story' },
    { label: 'How I Help', to: '/how-i-help' },
    { label: 'Stories', to: '/stories' },
    { label: 'Blog', to: '/blog' },
  ]

  const isActive = useCallback((path: string) => location.pathname === path, [location.pathname])

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-white/90 backdrop-blur-md shadow-sm'
            : 'bg-white/70 backdrop-blur-sm'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center group">
              <img
                src="/releaf-logo.png"
                alt="Releaf - Sober since 28 Nov 2016"
                className="h-12 md:h-14 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
              />
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`text-sm font-medium transition-colors duration-200 hover:text-leaf ${
                    isActive(link.to) ? 'text-leaf' : 'text-moss'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Desktop CTAs */}
            <div className="hidden md:flex items-center gap-3">
              <Link
                to="/book"
                className="text-sm font-semibold text-forest border border-forest/20 rounded-full px-5 py-2 hover:bg-forest hover:text-white transition-all duration-200"
              >
                Book Free Call
              </Link>
              <WhatsAppCTA size="sm" />
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(true)}
              className="md:hidden p-2 text-forest"
              aria-label="Open menu"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer */}
      <div
        className={`drawer-overlay fixed inset-0 z-[60] bg-black/40 ${isOpen ? 'open pointer-events-auto' : 'pointer-events-none'}`}
        onClick={() => setIsOpen(false)}
      />
      <div
        className={`drawer-panel fixed top-0 right-0 bottom-0 z-[70] w-80 max-w-[85vw] bg-white shadow-2xl flex flex-col ${isOpen ? 'open' : ''}`}
      >
        <div className="flex items-center justify-between p-5 border-b border-mist">
          <div className="flex items-center">
            <img src="/releaf-logo.png" alt="Releaf" className="h-10 w-auto object-contain" />
          </div>
          <button onClick={() => setIsOpen(false)} className="p-2 text-moss" aria-label="Close menu">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 py-6 px-5 space-y-1">
          {navLinks.map((link, i) => (
            <Link
              key={link.to}
              to={link.to}
              className={`drawer-link block py-3 text-lg font-medium transition-colors duration-200 ${
                isActive(link.to) ? 'text-leaf' : 'text-forest hover:text-leaf'
              } ${isOpen ? 'visible' : ''}`}
              style={{ transitionDelay: isOpen ? `${150 + i * 70}ms` : '0ms' }}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="p-5 space-y-3 border-t border-mist">
          <WhatsAppCTA className="w-full justify-center" />
          <Link
            to="/book"
            className="flex items-center justify-center gap-2 w-full text-sm font-semibold text-forest border border-forest/20 rounded-full px-5 py-3 hover:bg-forest hover:text-white transition-all duration-200"
          >
            <Phone className="w-4 h-4" />
            Book a Free Call
          </Link>
        </div>
      </div>
    </>
  )
}

/* ═══════════════════════════ FOOTER ═══════════════════════════ */
function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-forest text-white/60">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center mb-4">
              <img src="/releaf-logo.png" alt="Releaf" className="h-12 w-auto object-contain brightness-0 invert" />
            </div>
            <p className="text-sm leading-relaxed mb-4">
              Sobriety coaching from someone who has walked this road. I'm Rahul Seth — 10 years sober, certified CBT & REBT therapist.
            </p>
            <WhatsAppCTA size="sm" />
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold tracking-widest uppercase text-sage mb-4">Navigate</h4>
            <ul className="space-y-2">
              {[
                { label: 'My Story', to: '/my-story' },
                { label: 'How I Help', to: '/how-i-help' },
                { label: 'Book a Free Call', to: '/book' },
                { label: 'Stories', to: '/stories' },
                { label: 'Blog', to: '/blog' },
              ].map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="text-sm hover:text-white transition-colors duration-200">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* What I Treat */}
          <div>
            <h4 className="text-xs font-bold tracking-widest uppercase text-sage mb-4">What I Treat</h4>
            <ul className="space-y-2">
              {[
                { label: 'Alcohol Addiction', to: '/what-i-treat/alcohol' },
                { label: 'Drug Addiction', to: '/what-i-treat/drug-addiction' },
                { label: 'Anxiety', to: '/what-i-treat/anxiety' },
                { label: 'Depression', to: '/what-i-treat/depression' },
                { label: 'Cocaine', to: '/what-i-treat/cocaine' },
              ].map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="text-sm hover:text-white transition-colors duration-200">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-xs font-bold tracking-widest uppercase text-sage mb-4">Get in Touch</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <span className="text-white/40 block text-xs uppercase tracking-wider mb-1">WhatsApp</span>
                <a href="https://wa.me/919820281442" className="hover:text-white transition-colors">+91 98202 81442</a>
              </li>
              <li>
                <span className="text-white/40 block text-xs uppercase tracking-wider mb-1">Location</span>
                Mumbai, India · Online across India
              </li>
              <li>
                <span className="text-white/40 block text-xs uppercase tracking-wider mb-1">Free Consultation</span>
                30 minutes, no commitment
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-white/30">
            © {currentYear} Releaf. All rights reserved.
          </p>
          <p className="text-xs text-white/30">
            Rahul Seth · Certified Guidance Counsellor · CBT & REBT Therapist
          </p>
        </div>
      </div>

      {/* Schema.org Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Person',
            name: 'Rahul Seth',
            jobTitle: 'Sobriety Coach & Certified Guidance Counsellor',
            description: 'Sobriety coach with 10 years of personal recovery experience. Certified CBT & REBT therapist helping individuals across India.',
            url: 'https://releaf.co.in',
            image: 'https://releaf.co.in/rahul-portrait.jpg',
            telephone: '+919820281442',
            address: {
              '@type': 'PostalAddress',
              addressLocality: 'Mumbai',
              addressRegion: 'Maharashtra',
              addressCountry: 'IN',
            },
            knowsAbout: [
              'Sobriety Coaching',
              'Addiction Recovery',
              'Sober Companion Services',
              'Cognitive Behavioural Therapy (CBT)',
              'Rational Emotive Behaviour Therapy (REBT)',
              'Relapse Prevention',
              'Rehab Transition Support',
              'Mental Health Counselling',
            ],
            sameAs: ['https://wa.me/919820281442'],
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'ProfessionalService',
            name: 'Releaf — Sobriety Coaching by Rahul Seth',
            description: 'Personalised sobriety coaching, sober companion support, and rehab transition guidance across India. Founded by Rahul Seth, 10 years sober.',
            url: 'https://releaf.co.in',
            image: 'https://releaf.co.in/rahul-portrait.jpg',
            telephone: '+919820281442',
            address: {
              '@type': 'PostalAddress',
              addressLocality: 'Mumbai',
              addressRegion: 'Maharashtra',
              addressCountry: 'IN',
            },
            areaServed: [
              { '@type': 'City', name: 'Mumbai' },
              { '@type': 'Country', name: 'India' },
            ],
            priceRange: '₹6,000 - ₹30,000',
            openingHours: 'Mo-Sa 09:00-20:00',
            hasOfferCatalog: {
              '@type': 'OfferCatalog',
              name: 'Sobriety Coaching Services',
              itemListElement: [
                {
                  '@type': 'Offer',
                  itemOffered: {
                    '@type': 'Service',
                    name: 'Sober Coaching',
                    description: 'Ongoing 1-on-1 sobriety coaching with weekly sessions, daily check-ins, CBT & REBT techniques, and relapse prevention planning.',
                  },
                },
                {
                  '@type': 'Offer',
                  itemOffered: {
                    '@type': 'Service',
                    name: 'Sober Companion',
                    description: 'In-person accompaniment through social events, travel, and high-risk situations for real-time support.',
                  },
                },
                {
                  '@type': 'Offer',
                  itemOffered: {
                    '@type': 'Service',
                    name: 'Rehab Transition Support',
                    description: 'Post-rehab life planning, daily accountability, and structured re-entry support for those leaving treatment facilities.',
                  },
                },
              ],
            },
          }),
        }}
      />
    </footer>
  )
}

/* ═══════════════════════════ LAYOUT ═══════════════════════════ */
export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-16 md:pt-20">
        <Outlet />
      </main>
      <Footer />

      {/* Sticky Mobile WhatsApp FAB */}
      <a
        href="https://wa.me/919820281442"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 md:hidden bg-whatsapp text-white p-4 rounded-full shadow-lg shadow-whatsapp/30 hover:scale-110 transition-transform duration-200"
        aria-label="Message on WhatsApp"
      >
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
      </a>
    </div>
  )
}
