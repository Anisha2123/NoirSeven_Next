export interface SubService {
  title: string;
  items: string[];
}

export interface Service {
  id: number;
  slug: string;
  abbr: string;
  title: string;
  tagline: string;
  heroImage: string;
  cardImage: string;
  color: string;
  description: string;
  whyChooseUs: string;
  subServices: SubService[];
  highlights: string[];
}

export const SERVICES: Service[] = [
  {
    id: 1,
    slug: "seo",
    abbr: "SEO",
    title: "Search Engine Optimization",
    tagline: "Rank. Grow. Dominate.",
    heroImage: "https://images.unsplash.com/photo-1562577309-4932fdd64cd1?w=1200&q=80",
    cardImage: "https://images.unsplash.com/photo-1571171637578-41bc2dd41cd2?w=800&q=80",
    color: "#B9375D",
    description:
      "NoirSevenDigital&SoftwareSolution provides complete SEO services. From content ranking to growing, we are with you at every stage. Our simple goal is to help you increase the quality of your content. More than 90% of people prefer to click on first-page results — we put you there and keep you there.",
    whyChooseUs:
      "Choosing NoirSevenDigitalSolution means choosing your long-term partner that understands SEO as a growth engine, not just a ranking tactic. We ensure your data is not only written, but discovered, ranked, and converted into measurable business growth.",
    highlights: ["Discovery & Market Understanding", "SEO Audit & Opportunity Mapping", "Personalized Growth Blueprint", "Strategic Implementation", "Continuous Monitoring & Scaling"],
    subServices: [
      { title: "SEO Strategy & Keyword Research", items: ["Competitor keyword analysis", "Search intent research", "Long-tail keyword targeting", "SEO roadmap creation"] },
      { title: "On-Page SEO Optimization", items: ["Title tags & meta descriptions", "Internal linking & URL structure", "Page speed & image optimization", "Schema markup & heading structure"] },
      { title: "Technical SEO", items: ["Core Web Vitals optimization", "SSL implementation", "XML sitemap creation", "Broken links & crawl error resolution"] },
      { title: "Off-Page SEO", items: ["Press releases & guest blogging", "Influencer outreach", "Backlink building", "Online reputation management"] },
      { title: "Local SEO", items: ["Business profile optimization", "Review management strategy", "Local keyword targeting", "Location-based landing pages"] },
      { title: "E-Commerce SEO", items: ["Product page SEO", "Category page optimization", "Shopping feed optimization", "Structured data for products"] },
      { title: "SEO Content Strategy", items: ["Content gap analysis", "Pillar content creation", "Evergreen content strategy", "SEO blog writing"] },
      { title: "SEO Reporting", items: ["Keyword performance tracking", "Organic traffic data", "Backlink profile reports", "Competitor comparison"] },
    ],
  },
  {
    id: 2,
    slug: "smm",
    abbr: "SMM",
    title: "Social Media Marketing",
    tagline: "Build. Engage. Convert.",
    heroImage: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=1200&q=80",
    cardImage: "https://images.unsplash.com/photo-1432888622747-4eb9a8efeb07?w=800&q=80",
    color: "#C04060",
    description:
      "We don't only post content — we ensure a consistent brand voice, value-driven content, platform-friendly campaigns, and meaningful audience relationships across Instagram, Facebook, LinkedIn, YouTube, X, and more.",
    whyChooseUs:
      "With NoirSevenDigitalSolution, you are not hiring a posting team — you are choosing a strategic growth partner. We strike a balance between creativity and data-driven decision-making, focused on brand positioning and sustainable growth.",
    highlights: ["Strategy-first approach", "Platform-specific content", "Data-driven creativity", "Community building", "Brand authority"],
    subServices: [
      { title: "Social Media Strategy Development", items: ["Define content pillars", "Audience & competitor research", "Platform selection", "Monthly growth roadmap"] },
      { title: "Content Planning & Calendar", items: ["Launch strategy planning", "Festive & trend mapping", "Campaign planning", "Gen-Z special creativity"] },
      { title: "Content Creation & Designing", items: ["Reels scripting & direction", "Carousels & infographics", "Branded templates", "Story content"] },
      { title: "Caption & Hashtag Strategy", items: ["SEO-friendly captions", "Hook-based captions", "CTA integration", "Trending hashtag analysis"] },
      { title: "Community Management", items: ["Comment replies & DM handling", "Lead qualification", "Audience engagement", "Query resolution"] },
      { title: "Paid Social Advertising", items: ["Instagram, YouTube, LinkedIn, Facebook Ads", "Lead generation campaigns", "A/B testing", "Google & Meta Ads"] },
    ],
  },
  {
    id: 3,
    slug: "performance-marketing",
    abbr: "PPC",
    title: "Performance Marketing",
    tagline: "Precision. Speed. ROI.",
    heroImage: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=80",
    cardImage: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80",
    color: "#B9375D",
    description:
      "Where SEO takes time, PPC puts your business on top instantly. Performance marketing at NoirSevenDigitalSolution is treated as a revenue-generating system based on proper strategy, precision, and accountability.",
    whyChooseUs:
      "We differentiate through strategy, precision, and transparency. We make clear goals: cost per acquisition, return on ad spend, lead quality, and revenue targets. We align paid campaigns to ensure traffic converts effectively, not just increases.",
    highlights: ["Clear CPA & ROAS goals", "Funnel-mapped campaigns", "Competitor ad intelligence", "A/B tested creatives", "Transparent reporting"],
    subServices: [
      { title: "PPC Strategy & Campaign Planning", items: ["Business objective analysis", "Funnel-based campaign structure", "Budget planning & allocation"] },
      { title: "Keyword & Audience Research", items: ["High-converting keyword research", "Negative keyword strategy", "Advanced audience targeting", "Competitor ad analysis"] },
      { title: "Ad Copy & Creative Development", items: ["High-impact ad headlines", "Banner & display ad creatives", "Video scripting", "Conversion-focused descriptions"] },
      { title: "Campaign Setup & Integration", items: ["Google Ads & Meta Ads setup", "Conversion tracking & Pixel integration", "Landing page alignment"] },
      { title: "Campaign Optimization & Scaling", items: ["Bid management", "Cost-per-click control", "Retargeting campaigns", "Scaling high-performing ads"] },
      { title: "Analytics & Reporting", items: ["CTR, CPC, CPA tracking", "ROAS management", "Conversion rate monitoring", "Monthly performance reports"] },
    ],
  },
  {
    id: 4,
    slug: "content-marketing",
    abbr: "CM",
    title: "Content Marketing",
    tagline: "Authority. Trust. Growth.",
    heroImage: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=1200&q=80",
    cardImage: "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&q=80",
    color: "#C04060",
    description:
      "People don't buy from businesses — they buy from brands they trust. At NoirSevenDigitalSolution we consider content a strategic business asset, not a creative formality. We act as growth partners, not vendors.",
    whyChooseUs:
      "We don't just write content. We focus on the target audience, in-depth research, and growth-oriented strategies. Every piece of content is SEO-focused from the foundation, with a proper strategy and audience impact ensured.",
    highlights: ["SEO-focused from foundation", "Audience-first approach", "Strategic content roadmap", "Multi-channel coverage", "Long-term authority building"],
    subServices: [
      { title: "Content Strategy & Planning", items: ["Buyer persona research", "Competitor content analysis", "Content calendar creation", "Funnel-based planning (TOFU, MOFU, BOFU)"] },
      { title: "Blog & Article Writing", items: ["SEO-optimized blog writing", "Long-form pillar content", "Thought-leadership articles", "Case study writing"] },
      { title: "Website Content Creation", items: ["Homepage & about us content", "Service page copy", "Landing page copy", "Mission & vision statements"] },
      { title: "Social Media Content", items: ["Post caption writing", "Reels script writing", "Carousel content", "Platform-specific content"] },
      { title: "Video Content Marketing", items: ["Script writing for YouTube", "Podcast story writing", "Explainer scripts"] },
      { title: "E-mail Content Marketing", items: ["Welcome email writing", "Sales email writing", "Newsletter writing", "Promotional emails"] },
    ],
  },
  {
    id: 5,
    slug: "website-design-development",
    abbr: "WD",
    title: "Website Design & Development",
    tagline: "Design. Build. Perform.",
    heroImage: "https://images.unsplash.com/photo-1547658719-da2b51169166?w=1200&q=80",
    cardImage: "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=800&q=80",
    color: "#B9375D",
    description:
      "Your website is your brand's foundation, sales engine, and trust builder. NoirSevenDigitalSolution designs and develops high-performance websites that are visually appealing, technically strong, and strategically built for conversions.",
    whyChooseUs:
      "Choosing NOIRSEVEN means choosing someone who makes websites not for existence, but for performance. We start by understanding your requirements, industry, target audience, and long-term goals. Every layout detail is crafted with user impression in mind.",
    highlights: ["Strategy-driven approach", "Growth-oriented structure", "SEO-ready framework", "Cross-service integration", "Ongoing maintenance & support"],
    subServices: [
      { title: "Website Design (Front-end)", items: ["Custom UX/UI design", "Responsive design (Mobile, Laptop)", "Landing page design", "Branding-based layout"] },
      { title: "Website Development (Back-end)", items: ["WordPress development", "Shopify development", "Custom-coded websites", "CMS integration"] },
      { title: "Business-Type Specific Design", items: ["Corporate & portfolio websites", "E-commerce websites", "Blog & news websites", "Educational & service websites"] },
      { title: "Advanced Add-ons", items: ["SEO-friendly structure", "Lead capture forms", "Payment gateway integration", "Security setup (SSL, Firewall)"] },
    ],
  },
  {
    id: 6,
    slug: "email-marketing",
    abbr: "EM",
    title: "E-mail Marketing",
    tagline: "Nurture. Retain. Revenue.",
    heroImage: "https://images.unsplash.com/photo-1596526131083-e8c633c948d2?w=1200&q=80",
    cardImage: "https://images.unsplash.com/photo-1557200134-90327ee9fafa?w=800&q=80",
    color: "#C04060",
    description:
      "E-mail marketing is not only about sending emails — it is about building relationships, nurturing leads, and creating a predictable revenue system. We design strategic, data-driven emails that increase engagement and drive measurable sales growth.",
    whyChooseUs:
      "Choosing NOIRSEVEN means you get email systems that are well organised, delivering results you can measure. Not emails that get lost in a crowded inbox. We ensure a strategy-first approach, transparent reporting, and long-term growth partnership.",
    highlights: ["Strategy-first approach", "Audience segmentation", "Automated drip systems", "A/B tested campaigns", "Transparent reporting"],
    subServices: [
      { title: "E-mail Strategy & Planning", items: ["Audience segmentation", "Customer journey mapping", "Funnel planning", "Campaign calendar creation"] },
      { title: "Campaign Creation & Management", items: ["Promotional campaigns", "Newsletter campaigns", "Educational email series", "Re-engagement campaigns"] },
      { title: "E-mail Automation & Drip System", items: ["Welcome email series", "Lead nurturing sequences", "Abandoned cart recovery", "Behaviour trigger emails"] },
      { title: "Technical Setup & Deliverability", items: ["Mailchimp, Klaviyo setup", "Domain authentication", "List hygiene & cleaning", "Spam prevention strategy"] },
    ],
  },
  {
    id: 7,
    slug: "branding-strategy",
    abbr: "BS",
    title: "Branding Strategy",
    tagline: "Identity. Perception. Legacy.",
    heroImage: "https://images.unsplash.com/photo-1614332287897-cdc485fa562d?w=1200&q=80",
    cardImage: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&q=80",
    color: "#B9375D",
    description:
      "Branding strategy is not just a logo, color, or tagline — it's the perception people build about your business. At NOIRSEVEN, we design strategic brand foundations that drive long-term growth, not just make things look nice.",
    whyChooseUs:
      "A strong brand doesn't just look professional — it helps people understand what you do, makes them trust you, and helps them choose you. Our approach starts with research: your industry, competitors, audience, and market gaps.",
    highlights: ["Research-backed positioning", "Visual & verbal identity", "Market differentiation", "Brand story framework", "Long-term brand equity"],
    subServices: [
      { title: "Brand Discovery & Research", items: ["Market research", "Competitor analysis", "Target audience research", "Industry position analysis"] },
      { title: "Brand Positioning Strategy", items: ["Unique value proposition", "Brand differentiation strategy", "Niche identification", "Brand story framework"] },
      { title: "Brand Identity Development", items: ["Logo design", "Color palette & typography system", "Visual guidelines & brand style guide", "Brand voice & tagline creation"] },
      { title: "Brand Communication Strategy", items: ["Content direction strategy", "Social media brand voice", "Website messaging structure", "Campaign theme development"] },
    ],
  },
  {
    id: 8,
    slug: "conversion-rate-optimization",
    abbr: "CRO",
    title: "Conversion Rate Optimization",
    tagline: "Traffic. Optimize. Convert.",
    heroImage: "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=1200&q=80",
    cardImage: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80",
    color: "#C04060",
    description:
      "CRO is the process of improving your website, landing pages, ads, and funnels to increase the percentage of visitors who take a desired action. Traffic by itself does not grow a business — conversions do.",
    whyChooseUs:
      "At NOIRSEVEN, we see CRO as a performance discipline, not a guess. We make your existing traffic more profitable through data-driven analysis. Our process starts with understanding user behaviour, drop-off points, and conversion barriers.",
    highlights: ["Data-driven decisions", "Funnel optimization", "UX improvement focus", "Revenue-tracked results", "Systematic A/B testing"],
    subServices: [
      { title: "Landing Page Optimization", items: ["Conversion-focused design", "CTA strategy", "Lead magnet integration", "Trust signal addition"] },
      { title: "Mobile CRO Optimization", items: ["Touch-friendly CTA", "Mobile speed optimization", "Simplified mobile forms", "Mobile layout testing"] },
      { title: "Copy & Messaging Optimization", items: ["Drop-off point analysis", "Checkout flow optimization", "Form simplification", "Payment gateway testing"] },
      { title: "E-commerce CRO", items: ["Product page optimization", "Cart abandonment reduction", "Checkout redesign", "Upsell strategy implementation"] },
      { title: "Premium CRO Retainer", items: ["Continuous testing", "Funnel optimization", "UX improvement", "Revenue tracking & reporting"] },
    ],
  },
  {
    id: 9,
    slug: "digital-reputation-management",
    abbr: "DRM",
    title: "Digital Reputation Management",
    tagline: "Monitor. Control. Authority.",
    heroImage: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=1200&q=80",
    cardImage: "https://images.unsplash.com/photo-1573164713988-8665fc963095?w=800&q=80",
    color: "#B9375D",
    description:
      "Digital Reputation & Authority Management is the strategic process of monitoring what people say about a brand online, managing reviews, public perception, and protecting the brand from negative publicity.",
    whyChooseUs:
      "At NOIRSEVEN, we take care of your reputation proactively — not just when something goes wrong. We create long-term credibility plans that fit your industry, audience expectations, and business goals.",
    highlights: ["Proactive reputation monitoring", "Review growth strategy", "Digital PR & media outreach", "Authority content development", "Crisis management protocol"],
    subServices: [
      { title: "Review Growth & Management", items: ["Review response management", "Automated review request system", "Rating improvement campaign", "Negative review handling"] },
      { title: "Online Reputation Audit", items: ["Brand sentiment analysis", "Google search result analysis", "Authority gap identification", "Competitor reputation benchmarking"] },
      { title: "Digital PR & Media Outreach", items: ["Industry blog placements", "Media pitch creation", "Guest posting strategy", "Brand feature placements"] },
      { title: "Authority Content Development", items: ["Thought leadership articles", "LinkedIn personal branding", "Case studies & whitepapers", "Founder storytelling"] },
      { title: "Reputation Protection", items: ["SEO-based reputation repair", "Negative content management", "Brand monitoring", "Public response drafting"] },
    ],
  },
  {
    id: 10,
    slug: "video-editing",
    abbr: "VE",
    title: "Video Editing Services",
    tagline: "Story. Emotion. Impact.",
    heroImage: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=1200&q=80",
    cardImage: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=800&q=80",
    color: "#C04060",
    description:
      "Video carries emotion, psychology, branding, relationship strategy, and sales storytelling. At NOIRSEVEN, we don't consider video editing a task — we treat it as a strategic growth tool planned for purpose, audience, and measurable impact.",
    whyChooseUs:
      "Where most video editors focus only on visual appeal, we focus on performance too. Our process is structured and data-aware. We analyse user watch time, comments, and content preferences. When you connect with NOIRSEVEN, you receive content designed to improve engagement and brand perception.",
    highlights: ["Strategic intent in every edit", "Performance-first approach", "Multi-format expertise", "Data-aware editing process", "Brand perception enhancement"],
    subServices: [
      { title: "Social Media Video Editing", items: ["Reels, Shorts & short clips", "Promotional clips & product demos", "BTS & UGC content", "Live streaming support"] },
      { title: "Promotional & Advertising Videos", items: ["Product launches", "Brand awareness ads", "Paid ad campaigns", "Brand opening videos"] },
      { title: "Corporate & Business Videos", items: ["Company introduction", "Vision & mission videos", "Founder's introduction", "Investor presentations"] },
      { title: "E-Commerce Product Videos", items: ["Product style videos", "Demo & feature highlight videos", "Comparison videos"] },
      { title: "Motion Graphics & Animation", items: ["Infographics", "Animated logos", "UX/UI design animations", "Title sequences"] },
      { title: "Documentary Video Editing", items: ["Strategic storyline development", "Archival footage incorporation", "Interview editing"] },
    ],
  },
];