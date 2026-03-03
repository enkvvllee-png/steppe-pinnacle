'use client';

import React, { useMemo, useCallback, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import Head from 'next/head';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

interface CalendarItem {
  day: string;
  title: string;
  detail: string;
  category: 'awareness' | 'consideration' | 'conversion' | 'retention';
  kpis?: string[];
  tags?: string[];
}

interface FrameworkPillar {
  title: string;
  description: string;
  details: string;
  icon?: React.ReactNode;
}

interface SEOConfig {
  title: string;
  description: string;
  keywords: string[];
  ogImage: string;
  canonical: string;
}

// ============================================================================
// MOTION VARIANTS (Memoized for Performance)
// ============================================================================

const MOTION_VARIANTS = {
  fadeUp: {
    hidden: { opacity: 0, y: 60 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
  },
  fadeIn: {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.8 } }
  },
  scaleIn: {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } }
  },
  slideInLeft: {
    hidden: { opacity: 0, x: -40 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.6 } }
  },
  slideInRight: {
    hidden: { opacity: 0, x: 40 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.6 } }
  },
  stagger: {
    visible: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } }
  }
} as const;

// ============================================================================
// DATA CONSTANTS
// ============================================================================

const MARKETING_CALENDAR: CalendarItem[] = [
  {
    day: 'Day 1',
    title: 'Brand Authority Launch',
    detail: 'Founder vision video + cinematic brand reel. FB/IG reach campaign.',
    category: 'awareness',
    kpis: ['CPM < target', '50% video view rate'],
    tags: ['video', 'brand', 'paid-social']
  },
  {
    day: 'Day 2',
    title: 'Premium Positioning Content',
    detail: 'Luxury интерьер reel + үнэ-чанарын positioning carousel. Engagement campaign.',
    category: 'awareness',
    tags: ['carousel', 'luxury', 'engagement']
  },
  {
    day: 'Day 3',
    title: 'Technology Education',
    detail: 'Smart system demo + short explainer video. Traffic objective to website.',
    category: 'consideration',
    tags: ['education', 'video', 'traffic']
  },
  {
    day: 'Day 4',
    title: 'Safety Trust Builder',
    detail: 'Safety breakdown graphic + long caption storytelling. Facebook primary push.',
    category: 'consideration',
    tags: ['trust', 'graphics', 'facebook']
  },
  {
    day: 'Day 5',
    title: 'Монгол нөхцөл баталгаа',
    detail: '-30° cold start cinematic proof. TikTok native viral format.',
    category: 'awareness',
    tags: ['tiktok', 'viral', 'proof']
  },
  {
    day: 'Day 6',
    title: 'Competitor Comparison',
    detail: 'Үнэ + feature transparent comparison table. Authority positioning.',
    category: 'consideration',
    tags: ['comparison', 'authority']
  },
  {
    day: 'Day 7',
    title: 'Live Showroom Stream',
    detail: 'Luxury walkthrough live. Lead comment trigger automation.',
    category: 'conversion',
    tags: ['live', 'leads', 'showroom']
  },
  {
    day: 'Day 8',
    title: 'Customer Persona Target Push',
    detail: 'Business owner angle creative. Custom audience testing.',
    category: 'conversion',
    tags: ['targeting', 'persona', 'custom-audience']
  },
  {
    day: 'Day 9',
    title: 'Fuel Efficiency Demo',
    detail: 'Real usage scenario content. Retargeting video viewers.',
    category: 'consideration',
    tags: ['demo', 'retargeting']
  },
  {
    day: 'Day 10',
    title: 'Finance Education',
    detail: 'Зээлийн нөхцөл infographic + FAQ carousel. Conversion prep.',
    category: 'conversion',
    tags: ['finance', 'education', 'faq']
  },
  {
    day: 'Day 11',
    title: 'Off‑Road Authority',
    detail: 'Монгол замын туршилт. SUV performance highlight.',
    category: 'awareness',
    tags: ['performance', 'suv', 'authority']
  },
  {
    day: 'Day 12',
    title: 'Luxury Interior Deep Dive',
    detail: 'Premium material macro shots + cinematic transitions.',
    category: 'consideration',
    tags: ['luxury', 'interior', 'visual']
  },
  {
    day: 'Day 13',
    title: 'Influencer Collaboration',
    detail: 'Business influencer credibility build. Story ads amplification.',
    category: 'awareness',
    tags: ['influencer', 'partnership']
  },
  {
    day: 'Day 14',
    title: 'Remarketing Funnel Launch',
    detail: 'Website visitors + 50% video viewers retargeting. CPL optimization start.',
    category: 'conversion',
    kpis: ['CPL optimization'],
    tags: ['retargeting', 'funnel']
  },
  {
    day: 'Day 15',
    title: 'Campaign Reminder',
    detail: 'Luxury countdown creative. Scarcity messaging.',
    category: 'conversion',
    tags: ['scarcity', 'cta']
  },
  {
    day: 'Day 16',
    title: 'Family Safety Focus',
    detail: 'Persona 2 angle creative. Facebook lead form test.',
    category: 'conversion',
    tags: ['safety', 'leads']
  },
  {
    day: 'Day 17',
    title: 'Feature Breakdown Series',
    detail: 'Carousel education series. Save/share CTA.',
    category: 'consideration',
    tags: ['education', 'carousel']
  },
  {
    day: 'Day 18',
    title: 'Lead Scaling Phase',
    detail: 'Best performing creative duplication + budget scale 20%.',
    category: 'conversion',
    tags: ['scaling', 'optimization']
  },
  {
    day: 'Day 19',
    title: 'Owner Storytelling',
    detail: 'Real customer interview clip. Trust reinforcement.',
    category: 'consideration',
    tags: ['testimonial', 'trust']
  },
  {
    day: 'Day 20',
    title: 'TikTok Viral Hook Batch',
    detail: '3 hook variation тест. Comment trigger funnel.',
    category: 'awareness',
    tags: ['tiktok', 'viral', 'ab-test']
  },
  {
    day: 'Day 21',
    title: 'Luxury Visual Push',
    detail: 'High-end drone cinematic exterior video.',
    category: 'awareness',
    tags: ['video', 'luxury', 'drone']
  },
  {
    day: 'Day 22',
    title: 'PR Amplification',
    detail: 'Авто блог хамтрал + backlink SEO support.',
    category: 'awareness',
    tags: ['pr', 'seo']
  },
  {
    day: 'Day 23',
    title: 'Google Review Campaign',
    detail: 'Customer follow-up automation + review incentive.',
    category: 'retention',
    tags: ['reviews', 'automation']
  },
  {
    day: 'Day 24',
    title: 'Conversion Creative Refresh',
    detail: 'New hook intro test. A/B headline variation.',
    category: 'conversion',
    tags: ['ab-test', 'creative']
  },
  {
    day: 'Day 25',
    title: 'UGC Push',
    detail: 'User generated content repost + story ads.',
    category: 'awareness',
    tags: ['ugc', 'social-proof']
  },
  {
    day: 'Day 26',
    title: 'Comparison Short',
    detail: 'Quick spec vs competitor vertical short.',
    category: 'consideration',
    tags: ['comparison', 'short-form']
  },
  {
    day: 'Day 27',
    title: 'Internal Performance Review',
    detail: 'ROAS, CPL, CTR full audit. Budget reallocation.',
    category: 'conversion',
    kpis: ['ROAS', 'CPL', 'CTR'],
    tags: ['analytics', 'audit']
  },
  {
    day: 'Day 28',
    title: 'Influencer Live Luxury Edition',
    detail: 'Premium studio style livestream.',
    category: 'awareness',
    tags: ['live', 'influencer', 'luxury']
  },
  {
    day: 'Day 29',
    title: 'Final Scarcity Push',
    detail: 'Limited slot messaging + remarketing усиление.',
    category: 'conversion',
    tags: ['scarcity', 'urgency']
  },
  {
    day: 'Day 30',
    title: 'Steppe Drive Day',
    detail: 'Luxury launch event + media + live stream coverage.',
    category: 'retention',
    tags: ['event', 'launch', 'media']
  }
];

const FRAMEWORK_PILLARS: FrameworkPillar[] = [
  {
    title: 'Brand Positioning',
    description: 'Affordable Luxury + Smart Technology + Монгол нөхцөл баталгаа.',
    details: 'Chinese origin perception → Premium innovation leader.'
  },
  {
    title: 'Performance Marketing',
    description: 'Full Funnel Strategy: Awareness → Consideration → Conversion → Retention.',
    details: 'KPI: CPM, CTR, CPL, ROAS, Cost per Sale.'
  },
  {
    title: 'Digital Asset System',
    description: 'Website SEO optimized, Pixel tracking, CRM integration, Retargeting automation.',
    details: 'Complete infrastructure for scalable digital marketing.'
  }
];

// ============================================================================
// SEO CONFIGURATION
// ============================================================================

const SEO_CONFIG: SEOConfig = {
  title: 'Steppe Pinnacle – Luxury Automotive Marketing System for Mongolia',
  description: 'Strategic 30-day marketing framework for BYD, Jetour, and Changan in Mongolia. Performance marketing, brand positioning, and digital asset system.',
  keywords: [
    'Steppe Pinnacle',
    'automotive marketing Mongolia',
    'BYD Mongolia',
    'Jetour Mongolia',
    'Changan Mongolia',
    'luxury automotive',
    'digital marketing strategy',
    'performance marketing',
    'Улаанбаатар car sales'
  ],
  ogImage: 'https://steppepinnacle.com/og-image.png',
  canonical: 'https://steppepinnacle.com'
};

// ============================================================================
// COMPONENTS
// ============================================================================

// Hero Section Component
const HeroSection: React.FC = () => (
  <section className="relative min-h-screen flex flex-col justify-center items-center text-center px-6 overflow-hidden">
    {/* Gradient Background */}
    <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-950 to-black -z-10" />
    <div className="absolute top-0 right-0 w-96 h-96 bg-blue-900/10 rounded-full blur-3xl -z-10" />
    <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-900/10 rounded-full blur-3xl -z-10" />

    <motion.div
      initial="hidden"
      whileInView="visible"
      variants={MOTION_VARIANTS.stagger}
      viewport={{ once: true, amount: 0.3 }}
      className="max-w-5xl"
    >
      <motion.h1
        variants={MOTION_VARIANTS.fadeUp}
        className="text-6xl md:text-8xl font-black tracking-[0.4em] text-white drop-shadow-lg"
      >
        STEPPE
        <br />
        PINNACLE
      </motion.h1>

      <motion.p
        variants={MOTION_VARIANTS.fadeUp}
        className="mt-8 text-xl md:text-3xl text-gray-300 max-w-4xl mx-auto font-light leading-relaxed"
      >
        Luxury Automotive Marketing System
        <br />
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
          BYD • Jetour • Changan
        </span>
      </motion.p>

      <motion.button
        variants={MOTION_VARIANTS.fadeUp}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="mt-12 px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold rounded-lg hover:shadow-2xl transition-shadow"
      >
        Explore Campaign
      </motion.button>
    </motion.div>
  </section>
);

// Framework Section Component
const FrameworkSection: React.FC = () => (
  <section className="py-32 px-6 bg-gradient-to-b from-gray-950 to-black">
    <div className="max-w-7xl mx-auto">
      <motion.h2
        initial="hidden"
        whileInView="visible"
        variants={MOTION_VARIANTS.fadeUp}
        viewport={{ once: true }}
        className="text-5xl md:text-7xl font-bold text-center mb-24 text-white"
      >
        Strategic Growth Framework
      </motion.h2>

      <motion.div
        initial="hidden"
        whileInView="visible"
        variants={MOTION_VARIANTS.stagger}
        viewport={{ once: true }}
        className="grid md:grid-cols-3 gap-8"
      >
        {FRAMEWORK_PILLARS.map((pillar, index) => (
          <motion.div
            key={index}
            variants={MOTION_VARIANTS.scaleIn}
            className="group bg-gradient-to-br from-gray-900 to-gray-950 p-8 rounded-2xl border border-gray-800 hover:border-blue-600 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-900/50"
          >
            <h3 className="font-bold text-xl mb-4 text-white group-hover:text-blue-400 transition">
              {pillar.title}
            </h3>
            <p className="text-gray-300 mb-4 leading-relaxed">{pillar.description}</p>
            <p className="text-gray-500 text-sm">{pillar.details}</p>
          </motion.div>
        ))}
      </motion.div>
    </div>
  </section>
);

// Calendar Card Component
interface CalendarCardProps {
  item: CalendarItem;
  index: number;
}

const CalendarCard: React.FC<CalendarCardProps> = ({ item, index }) => {
  const categoryColors = {
    awareness: 'from-blue-600 to-blue-800',
    consideration: 'from-purple-600 to-purple-800',
    conversion: 'from-emerald-600 to-emerald-800',
    retention: 'from-orange-600 to-orange-800'
  };

  return (
    <motion.div
      variants={MOTION_VARIANTS.fadeUp}
      className="group h-full bg-gradient-to-br from-gray-900 to-gray-950 p-6 rounded-xl border border-gray-800 hover:border-gray-600 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
    >
      <div className="flex items-start justify-between mb-3">
        <span className={`text-xs font-bold px-3 py-1 rounded-full bg-gradient-to-r ${categoryColors[item.category]} text-white`}>
          {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
        </span>
        <span className="text-xs text-gray-500">{index + 1}/30</span>
      </div>

      <p className="text-gray-500 text-xs uppercase tracking-wider mb-2">{item.day}</p>
      <h3 className="font-bold text-base text-white mb-3 group-hover:text-blue-400 transition">
        {item.title}
      </h3>
      <p className="text-gray-400 text-sm mb-4 leading-relaxed">{item.detail}</p>

      {item.kpis && (
        <div className="pt-4 border-t border-gray-800 space-y-1">
          <p className="text-xs text-gray-600 font-semibold">KPIs:</p>
          <div className="flex flex-wrap gap-1">
            {item.kpis.map((kpi, i) => (
              <span key={i} className="text-xs bg-gray-800 text-gray-300 px-2 py-1 rounded">
                {kpi}
              </span>
            ))}
          </div>
        </div>
      )}

      {item.tags && (
        <div className="pt-3 flex flex-wrap gap-1">
          {item.tags.map((tag, i) => (
            <span key={i} className="text-xs bg-gray-800/50 text-gray-400 px-2 py-1 rounded-full">
              #{tag}
            </span>
          ))}
        </div>
      )}
    </motion.div>
  );
};

// Calendar Section Component
const CalendarSection: React.FC = () => (
  <section className="py-32 px-6 bg-black">
    <div className="max-w-7xl mx-auto">
      <motion.h2
        initial="hidden"
        whileInView="visible"
        variants={MOTION_VARIANTS.fadeUp}
        viewport={{ once: true }}
        className="text-5xl md:text-7xl font-bold text-center mb-24 text-white"
      >
        30 Day Executive <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">Marketing Calendar</span>
      </motion.h2>

      <motion.div
        initial="hidden"
        whileInView="visible"
        variants={MOTION_VARIANTS.stagger}
        viewport={{ once: true, amount: 0.1 }}
        className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {MARKETING_CALENDAR.map((item, index) => (
          <CalendarCard key={index} item={item} index={index} />
        ))}
      </motion.div>
    </div>
  </section>
);

// SEO Section Component
const SEOSection: React.FC = () => (
  <section className="py-32 px-6 bg-gradient-to-b from-gray-950 to-black">
    <div className="max-w-6xl mx-auto">
      <motion.h2
        initial="hidden"
        whileInView="visible"
        variants={MOTION_VARIANTS.fadeUp}
        viewport={{ once: true }}
        className="text-5xl md:text-7xl font-bold text-center mb-24 text-white"
      >
        Advanced SEO Architecture
      </motion.h2>

      <motion.div
        initial="hidden"
        whileInView="visible"
        variants={MOTION_VARIANTS.stagger}
        viewport={{ once: true }}
        className="grid md:grid-cols-2 gap-8"
      >
        <motion.div variants={MOTION_VARIANTS.slideInLeft} className="bg-gradient-to-br from-gray-900 to-gray-950 p-10 rounded-2xl border border-gray-800">
          <h3 className="font-bold text-2xl mb-6 text-white">Technical SEO</h3>
          <ul className="space-y-4 text-gray-300">
            <li className="flex items-start gap-3">
              <span className="text-blue-400 font-bold">✓</span>
              <span>Mobile-first indexing & Core Web Vitals optimization</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-blue-400 font-bold">✓</span>
              <span>Schema markup (Vehicle, Product, Organization)</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-blue-400 font-bold">✓</span>
              <span>XML sitemap & Google Search Console monitoring</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-blue-400 font-bold">✓</span>
              <span>Structured data for rich snippets</span>
            </li>
          </ul>
        </motion.div>

        <motion.div variants={MOTION_VARIANTS.slideInRight} className="bg-gradient-to-br from-gray-900 to-gray-950 p-10 rounded-2xl border border-gray-800">
          <h3 className="font-bold text-2xl mb-6 text-white">Content & Local SEO</h3>
          <ul className="space-y-4 text-gray-300">
            <li className="flex items-start gap-3">
              <span className="text-cyan-400 font-bold">✓</span>
              <span>Keyword clusters: "BYD Монгол үнэ", "Jetour Улаанбаатар"</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-cyan-400 font-bold">✓</span>
              <span>Google Business Profile optimization</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-cyan-400 font-bold">✓</span>
              <span>Review management automation</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-cyan-400 font-bold">✓</span>
              <span>Backlink strategy & PR amplification</span>
            </li>
          </ul>
        </motion.div>
      </motion.div>
    </div>
  </section>
);

// Meta Business Suite Section
const MetaBusinessSection: React.FC = () => (
  <section className="py-32 px-6 bg-black">
    <div className="max-w-6xl mx-auto">
      <motion.h2
        initial="hidden"
        whileInView="visible"
        variants={MOTION_VARIANTS.fadeUp}
        viewport={{ once: true }}
        className="text-5xl md:text-7xl font-bold text-center mb-24 text-white"
      >
        Meta Business Suite <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">Professional Workflow</span>
      </motion.h2>

      <motion.div
        initial="hidden"
        whileInView="visible"
        variants={MOTION_VARIANTS.fadeUp}
        viewport={{ once: true }}
        className="bg-gradient-to-br from-gray-900 to-gray-950 p-12 rounded-2xl border border-gray-800"
      >
        <div className="grid md:grid-cols-2 gap-8 text-gray-300">
          {[
            { num: '1', title: 'Business Manager Setup', desc: 'Ad Account, Page, Pixel properly connected' },
            { num: '2', title: 'Conversion Tracking', desc: 'Pixel + Conversion API implementation' },
            { num: '3', title: 'Custom Audiences', desc: 'Website visitors (30/60/90 days), Video viewers 50%+, Engagers' },
            { num: '4', title: 'Lookalike Audiences', desc: '1%-3% Mongolia LAA targeting' },
            { num: '5', title: 'Campaign Structure', desc: 'CBO scaling strategy with budget allocation' },
            { num: '6', title: 'KPI Dashboard', desc: 'Weekly monitoring: CPL, CTR, Frequency, ROAS' },
            { num: '7', title: 'Creative Testing', desc: 'Matrix testing: Hook × Offer × Visual combinations' },
            { num: '8', title: 'Performance Audit', desc: 'Weekly optimization & budget reallocation' }
          ].map((item, index) => (
            <motion.div
              key={index}
              variants={MOTION_VARIANTS.fadeUp}
              className="p-6 bg-gray-950/50 rounded-lg border border-gray-800 hover:border-blue-600 transition"
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-gradient-to-br from-blue-600 to-cyan-600">
                    <span className="font-bold text-white">{item.num}</span>
                  </div>
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-white mb-2">{item.title}</h4>
                  <p className="text-sm text-gray-400">{item.desc}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  </section>
);

// Event Section Component
const EventSection: React.FC = () => (
  <section className="relative py-40 px-6 overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-black to-cyan-900/20 -z-10" />
    <div className="absolute top-0 right-0 w-96 h-96 bg-blue-900/20 rounded-full blur-3xl -z-10" />
    <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-900/20 rounded-full blur-3xl -z-10" />

    <div className="max-w-4xl mx-auto text-center">
      <motion.h2
        initial="hidden"
        whileInView="visible"
        variants={MOTION_VARIANTS.fadeUp}
        viewport={{ once: true }}
        className="text-6xl md:text-8xl font-black tracking-tight text-white mb-8"
      >
        Steppe Drive Day
      </motion.h2>

      <motion.p
        initial="hidden"
        whileInView="visible"
        variants={MOTION_VARIANTS.fadeUp}
        viewport={{ once: true }}
        className="text-xl md:text-2xl text-gray-300 mb-12 font-light"
      >
        Luxury Edition Launch Event
      </motion.p>

      <motion.div
        initial="hidden"
        whileInView="visible"
        variants={MOTION_VARIANTS.stagger}
        viewport={{ once: true }}
        className="flex flex-wrap justify-center gap-6 text-gray-400"
      >
        {['Coffee Lounge', 'DJ Set', 'Influencer Coverage', 'Media PR', 'Live Stream Production'].map((item, i) => (
          <motion.div key={i} variants={MOTION_VARIANTS.fadeUp} className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-gradient-to-r from-blue-400 to-cyan-400" />
            <span>{item}</span>
          </motion.div>
        ))}
      </motion.div>
    </div>
  </section>
);

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function SteppePinnacle(): React.ReactElement {
  return (
    <>
      <Head>
        <title>{SEO_CONFIG.title}</title>
        <meta name="description" content={SEO_CONFIG.description} />
        <meta name="keywords" content={SEO_CONFIG.keywords.join(', ')} />
        <meta property="og:title" content={SEO_CONFIG.title} />
        <meta property="og:description" content={SEO_CONFIG.description} />
        <meta property="og:image" content={SEO_CONFIG.ogImage} />
        <meta property="og:type" content="website" />
        <link rel="canonical" href={SEO_CONFIG.canonical} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="language" content="en" />
        <meta name="robots" content="index, follow" />
      </Head>

      <main className="bg-black text-white font-sans scroll-smooth overflow-x-hidden">
        <HeroSection />
        <FrameworkSection />
        <CalendarSection />
        <SEOSection />
        <MetaBusinessSection />
        <EventSection />
      </main>
    </>
  );
}