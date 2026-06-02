import { Helmet } from 'react-helmet-async'
import { useParams, Link } from 'react-router-dom'
import { useState } from 'react'
import { ArrowRight, ChevronDown, ChevronUp } from 'lucide-react'
import WhatsAppCTA from '../components/WhatsAppCTA'
import SectionReveal from '../components/SectionReveal'

/* ── Condition Data ── */
interface ConditionData {
  title: string
  slug: string
  seoTitle: string
  metaDesc: string
  opening: string
  noteFromRahul: string
  understanding: string[]
  howIHelp: string[]
  testimonial: { quote: string; name: string; detail: string } | null
  faqs: { q: string; a: string }[]
}

const conditions: Record<string, ConditionData> = {
  alcohol: {
    title: 'Alcohol Addiction',
    slug: 'alcohol',
    seoTitle: 'Alcohol Addiction Help in Mumbai & India | Releaf — Rahul Seth',
    metaDesc: 'Struggling with alcohol? I\'ve been there. Personal sobriety coaching from someone who understands — 8 years sober, certified CBT coach. Free 30-min call.',
    opening: 'Alcohol doesn\'t announce itself as a problem. It creeps in — one extra drink, one more reason to open the bottle, one more morning you wish you hadn\'t.',
    noteFromRahul: 'I know what alcohol dependency feels like from the inside — not from a textbook. I spent years believing I had it under control, even as my life told a different story. When I finally got help, I found that the shame I felt was the biggest barrier, not the alcohol itself. That experience is now at the heart of how I work with anyone going through the same thing.',
    understanding: [
      'Drinking more than you planned to, more often than you expected',
      'Using alcohol to manage stress, anxiety, or social situations',
      'Morning regret that doesn\'t stop the evening cycle',
      'Hiding how much you drink from people who care about you',
      'Feeling like you\'ve "tried to stop" but can\'t make it stick',
    ],
    howIHelp: [
      'Understanding your personal relationship with alcohol through CBT techniques',
      'Building a personalised sobriety plan that fits your life — not a generic programme',
      'Daily check-ins and accountability during the early weeks',
      'Strategies for navigating social situations, triggers, and cravings',
      'Connecting you with medical professionals if detox support is needed',
    ],
    testimonial: {
      quote: 'Rahul didn\'t just help me stop drinking — he helped me understand why I started. That changed everything.',
      name: 'A.K.',
      detail: '42, Mumbai — 14 months sober',
    },
    faqs: [
      { q: 'Is this medically supervised?', a: 'No. I am a sobriety coach and certified counsellor, not a medical professional. If you need medical support for detox, I will connect you with trusted medical practitioners and support you through the process.' },
      { q: 'Can I do this alongside therapy or rehab?', a: 'Absolutely. Many of my clients work with me alongside medical professionals or therapists. My coaching complements clinical treatment — it doesn\'t replace it.' },
      { q: 'How long does coaching typically last?', a: 'Every journey is different. Some clients work with me for 3 months, others for over a year. We\'ll talk about what makes sense for you in our free consultation.' },
      { q: 'Do I need to be completely sober before we start?', a: 'No. You come as you are. We start from wherever you are right now and work from there.' },
      { q: 'Is everything confidential?', a: 'Yes, completely. Nothing you share with me goes to anyone else — not family, not employers, not anyone.' },
    ],
  },
  'drug-addiction': {
    title: 'Drug Addiction',
    slug: 'drug-addiction',
    seoTitle: 'Drug Addiction Support in Mumbai & India | Releaf — Rahul Seth',
    metaDesc: 'Drug addiction coaching from someone with lived experience. CBT & REBT certified. Personal, confidential support across India. Free consultation.',
    opening: 'Drug addiction doesn\'t discriminate. It can happen to anyone — professionals, students, parents. And reaching out for help is one of the hardest things you\'ll ever do.',
    noteFromRahul: 'I know what drug dependency feels like from the inside — not from a textbook. I lived it. The secrecy, the shame, the feeling that nobody could understand. When I finally got help, I found that having someone who genuinely understood — not from training, but from experience — was the thing that made the difference. That experience is now at the heart of how I work with anyone going through the same thing.',
    understanding: [
      'Feeling unable to stop despite wanting to',
      'Building your life around the next fix or score',
      'Lying to people you love about what\'s happening',
      'Physical and emotional withdrawal when you try to stop',
      'Losing interest in things that used to matter',
    ],
    howIHelp: [
      'Personal coaching rooted in lived experience and CBT/REBT training',
      'Building a recovery plan that addresses your specific substances and triggers',
      'Daily accountability and support during early recovery',
      'Sober companion services for high-risk situations',
      'Referral to medical and rehab professionals when needed',
    ],
    testimonial: {
      quote: 'After three failed rehab attempts, I\'d given up on myself. Rahul hadn\'t. His consistent support kept me going when I wanted to quit.',
      name: 'R.M.',
      detail: '35, Pune — 9 months sober',
    },
    faqs: [
      { q: 'Is this medically supervised?', a: 'No. I am a sobriety coach, not a medical professional. If detox or medical support is needed, I will connect you with trusted practitioners and support you through the process.' },
      { q: 'Do you work with all types of substance dependency?', a: 'Yes. I work with clients dealing with a range of substances. Each person\'s situation is unique, and we approach it accordingly.' },
      { q: 'What if I\'m not ready to stop completely?', a: 'That\'s okay. We start from wherever you are. Many of my clients weren\'t "ready" when they first called — they were just willing to have a conversation.' },
      { q: 'Can family members reach out on behalf of a loved one?', a: 'Absolutely. I work with families too. Sometimes the person struggling isn\'t ready yet, but the family is — and that\'s a valid starting point.' },
    ],
  },
  anxiety: {
    title: 'Anxiety',
    slug: 'anxiety',
    seoTitle: 'Anxiety Support & Coaching in Mumbai | Releaf — Rahul Seth',
    metaDesc: 'Anxiety coaching from someone who understands from experience. CBT & REBT trained. Personalised support for managing anxiety. Free 30-min consultation.',
    opening: 'Anxiety can feel like a prison you carry with you everywhere. It\'s exhausting, isolating, and often misunderstood by the people around you.',
    noteFromRahul: 'I know what anxiety feels like from the inside — not from a textbook. During my years of active addiction, anxiety was both a symptom and a trigger. When I finally got help, I found that addressing the anxiety was just as important as addressing the substance use. That experience is now at the heart of how I work with anyone going through the same thing.',
    understanding: [
      'Constant worry that feels impossible to switch off',
      'Physical symptoms: racing heart, tight chest, sleeplessness',
      'Avoiding situations, places, or people because of fear',
      'Feeling overwhelmed by things that others seem to handle easily',
      'Using substances to cope with anxious thoughts and feelings',
    ],
    howIHelp: [
      'CBT techniques specifically designed for anxiety management',
      'Identifying and challenging the thought patterns that fuel your anxiety',
      'Building practical coping strategies for daily life',
      'Addressing the connection between anxiety and substance use if relevant',
      'Regular sessions and check-ins to maintain progress',
    ],
    testimonial: null,
    faqs: [
      { q: 'Is this therapy?', a: 'I am a certified counsellor trained in CBT and REBT, not a psychiatrist. I provide coaching and therapeutic techniques. If medication is needed, I\'ll refer you to a medical professional.' },
      { q: 'Do I need to have an addiction to work with you?', a: 'No. While my primary expertise is in sobriety coaching, I also work with clients on anxiety, depression, and related challenges — especially where they intersect with substance use.' },
      { q: 'How quickly will I see results?', a: 'Everyone is different. Many clients notice shifts within the first few sessions, but lasting change takes ongoing work. We\'ll set realistic goals together.' },
    ],
  },
  depression: {
    title: 'Depression',
    slug: 'depression',
    seoTitle: 'Depression Support & Coaching in Mumbai | Releaf — Rahul Seth',
    metaDesc: 'Depression coaching from someone with lived experience. Certified CBT & REBT counsellor. Personal, confidential support. Free 30-min consultation.',
    opening: 'Depression lies to you. It tells you nothing will get better, that you\'re a burden, that reaching out is pointless. I\'m here to tell you: it\'s wrong.',
    noteFromRahul: 'I know what depression feels like from the inside — not from a textbook. During my darkest years, depression and addiction fed each other in a cycle that felt impossible to break. When I finally got help, I found that addressing both together — not one at a time — was the key. That experience is now at the heart of how I work with anyone going through the same thing.',
    understanding: [
      'Feeling empty, numb, or disconnected from life',
      'Loss of interest in things that used to bring joy',
      'Persistent fatigue that sleep doesn\'t fix',
      'Withdrawing from people and relationships',
      'Difficulty imagining that things could ever change',
    ],
    howIHelp: [
      'REBT and CBT techniques to challenge depressive thought patterns',
      'Building small, achievable routines that create momentum',
      'Addressing the link between depression and substance use if relevant',
      'Regular accountability and genuine human connection',
      'Referral to medical professionals for medication if needed',
    ],
    testimonial: null,
    faqs: [
      { q: 'Is this a replacement for medication?', a: 'No. If medication is part of your treatment, that continues. My coaching works alongside medical treatment, not instead of it.' },
      { q: 'What if I don\'t feel like talking?', a: 'That\'s completely normal. We go at your pace. Some sessions might be shorter, some might be harder. There\'s no pressure to perform.' },
      { q: 'Can depression coaching help with addiction too?', a: 'Yes. Depression and addiction often go hand in hand. I address both together when relevant.' },
    ],
  },
  cocaine: {
    title: 'Cocaine Addiction',
    slug: 'cocaine',
    seoTitle: 'Cocaine Addiction Help in Mumbai & India | Releaf — Rahul Seth',
    metaDesc: 'Cocaine dependency coaching from someone with lived experience. Confidential, personal support. CBT & REBT certified. Free 30-min call.',
    opening: 'Cocaine makes you feel invincible — until it doesn\'t. The highs get shorter, the lows get deeper, and the cycle feels impossible to break.',
    noteFromRahul: 'I know what cocaine dependency feels like from the inside — not from a textbook. The energy, the confidence, the crash. I lived that cycle. When I finally got help, I found that understanding the psychological triggers was more important than willpower alone. That experience is now at the heart of how I work with anyone going through the same thing.',
    understanding: [
      'Needing more each time to feel the same effect',
      'Using cocaine to perform, socialise, or cope with pressure',
      'Crashes that bring extreme fatigue, anxiety, and paranoia',
      'Financial impact that you\'re hiding from others',
      'Promising yourself "this is the last time" — repeatedly',
    ],
    howIHelp: [
      'Understanding the specific psychological patterns behind cocaine use',
      'CBT techniques for managing cravings and triggers',
      'Building alternative coping mechanisms for the situations that lead to use',
      'Sober companion support for social environments where cocaine is present',
      'Connecting with medical support when needed',
    ],
    testimonial: null,
    faqs: [
      { q: 'Is cocaine physically addictive?', a: 'Cocaine is primarily psychologically addictive, which means the cravings and behavioural patterns are the main challenge. My coaching addresses exactly this — the mental and emotional side of dependency.' },
      { q: 'Do I need rehab first?', a: 'Not necessarily. Many cocaine users benefit from coaching without formal rehab. We\'ll assess your situation in our free consultation.' },
      { q: 'Is this confidential?', a: 'Absolutely. Everything we discuss stays between us.' },
    ],
  },
}

/* ── FAQ Accordion Item ── */
function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="border-b border-forest/8 last:border-b-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-5 text-left group"
        aria-expanded={open}
      >
        <span className="text-sm font-semibold text-forest pr-4 group-hover:text-leaf transition-colors">{q}</span>
        {open ? (
          <ChevronUp className="w-4 h-4 text-sage shrink-0" />
        ) : (
          <ChevronDown className="w-4 h-4 text-sage shrink-0" />
        )}
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ${
          open ? 'max-h-96 pb-5' : 'max-h-0'
        }`}
      >
        <p className="text-sm text-moss leading-relaxed">{a}</p>
      </div>
    </div>
  )
}

export default function ConditionPage() {
  const { condition } = useParams<{ condition: string }>()
  const data = conditions[condition || '']

  if (!data) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl text-forest mb-4">Page not found</h1>
          <Link to="/" className="text-leaf font-medium hover:text-forest transition-colors">
            Go back home
          </Link>
        </div>
      </div>
    )
  }

  // FAQPage Schema
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: data.faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.a,
      },
    })),
  }

  return (
    <>
      <Helmet>
        <title>{data.seoTitle}</title>
        <meta name="description" content={data.metaDesc} />
        <meta property="og:title" content={data.seoTitle} />
        <meta property="og:url" content={`https://releaf.co.in/what-i-treat/${data.slug}/`} />
        <link rel="canonical" href={`https://releaf.co.in/what-i-treat/${data.slug}/`} />
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      </Helmet>

      {/* Hero */}
      <section className="bg-forest text-white py-20 sm:py-28">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 hero-stagger">
          <p className="eyebrow text-sage/60 mb-4">What I Treat</p>
          <h1 className="text-white mb-6 text-3xl sm:text-4xl">{data.title}</h1>
          <p className="text-lg text-white/60 font-light max-w-2xl leading-relaxed">
            {data.opening}
          </p>
        </div>
      </section>

      {/* Note from Rahul */}
      <section className="py-16 bg-mist">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionReveal>
            <div className="bg-white rounded-2xl border border-forest/8 p-8 sm:p-10">
              <div className="flex items-center gap-3 mb-5">
                <img
                  src="/rahul-portrait.jpg"
                  alt="Rahul Seth"
                  className="w-10 h-10 rounded-full object-cover border border-sage/20"
                />
                <div>
                  <p className="text-sm font-semibold text-forest">A note from Rahul</p>
                  <p className="text-xs text-moss/60">Certified Guidance Counsellor · CBT & REBT · Sober since 28 Nov 2016</p>
                </div>
              </div>
              <p className="text-moss leading-relaxed italic">"{data.noteFromRahul}"</p>
            </div>
          </SectionReveal>
        </div>
      </section>

      {/* Understanding */}
      <section className="py-20 sm:py-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionReveal>
            <h2 className="mb-8">What this can look like in daily life</h2>
            <div className="space-y-4">
              {data.understanding.map((item, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div className="w-1.5 h-1.5 rounded-full bg-leaf mt-2.5 shrink-0" />
                  <p className="text-moss leading-relaxed">{item}</p>
                </div>
              ))}
            </div>
            <p className="text-sm text-moss/70 mt-6 italic">
              If any of this sounds familiar — you're not alone. And you don't have to figure it out by yourself.
            </p>
          </SectionReveal>
        </div>
      </section>

      {/* How I Help */}
      <section className="bg-mist py-20 sm:py-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionReveal>
            <h2 className="mb-8">How I help with {data.title.toLowerCase()}</h2>
            <div className="space-y-4">
              {data.howIHelp.map((item, i) => (
                <div key={i} className="flex items-start gap-4 bg-white rounded-xl p-5 border border-forest/5">
                  <span className="text-sm font-bold text-leaf shrink-0 w-6">{(i + 1).toString().padStart(2, '0')}</span>
                  <p className="text-sm text-moss leading-relaxed">{item}</p>
                </div>
              ))}
            </div>
          </SectionReveal>
        </div>
      </section>

      {/* Testimonial */}
      {data.testimonial && (
        <section className="py-16">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionReveal>
              <div className="bg-forest rounded-2xl p-8 sm:p-10 text-center">
                <blockquote className="font-display text-lg sm:text-xl text-white italic leading-relaxed mb-5">
                  "{data.testimonial.quote}"
                </blockquote>
                <p className="text-sm text-sage font-medium">{data.testimonial.name}</p>
                <p className="text-xs text-white/40">{data.testimonial.detail}</p>
                <p className="text-[10px] text-white/20 mt-3">Name and identifying details changed with permission.</p>
              </div>
            </SectionReveal>
          </div>
        </section>
      )}

      {/* FAQs */}
      <section className="py-20 sm:py-24 bg-mist">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionReveal>
            <h2 className="mb-8">Frequently asked questions</h2>
            <div className="bg-white rounded-2xl border border-forest/8 p-6 sm:p-8">
              {data.faqs.map((faq, i) => (
                <FAQItem key={i} q={faq.q} a={faq.a} />
              ))}
            </div>
          </SectionReveal>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-forest py-20 sm:py-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <SectionReveal>
            <h2 className="text-white mb-4">Ready to take the next step?</h2>
            <p className="text-base text-white/60 mb-8 max-w-lg mx-auto">
              The first call is free. 30 minutes. No commitment. Just an honest conversation.
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
