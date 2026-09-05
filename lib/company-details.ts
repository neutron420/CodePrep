// Rich company metadata and details for company interview dashboard

export interface CompanyDetail {
  description: string;
  hq?: string;
  founded?: string;
  type?: string;
}

export const CURATED_COMPANY_DETAILS: Record<string, CompanyDetail> = {
  "zeta": {
    description: "Modern banking tech and card-issuance platform empowering leading financial institutions globally.",
    hq: "San Francisco, CA & Bengaluru, India",
    founded: "2015",
    type: "Fintech Unicorn",
  },
  "tower-research-capital": {
    description: "Pioneering algorithmic trading firm specializing in quantitative investment and high-frequency trading.",
    hq: "New York, NY",
    founded: "1998",
    type: "HFT & Quantitative Trading",
  },
  "tower-research": {
    description: "Pioneering algorithmic trading firm specializing in quantitative investment and high-frequency trading.",
    hq: "New York, NY",
    founded: "1998",
    type: "HFT & Quantitative Trading",
  },
  "google": {
    description: "Global technology leader specializing in search engines, cloud computing, AI, and consumer software.",
    hq: "Mountain View, CA",
    founded: "1998",
    type: "Big Tech (Alphabet)",
  },
  "meta": {
    description: "Pioneering social technology and AI company connecting billions across Facebook, Instagram, and WhatsApp.",
    hq: "Menlo Park, CA",
    founded: "2004",
    type: "Big Tech",
  },
  "amazon": {
    description: "Multinational technology company focused on e-commerce, cloud infrastructure (AWS), streaming, and AI.",
    hq: "Seattle, WA",
    founded: "1994",
    type: "Big Tech",
  },
  "apple": {
    description: "Consumer electronics and software powerhouse behind iPhone, Mac, iOS, and proprietary silicon chips.",
    hq: "Cupertino, CA",
    founded: "1976",
    type: "Big Tech",
  },
  "microsoft": {
    description: "Global computer software, enterprise cloud platform (Azure), gaming, and artificial intelligence giant.",
    hq: "Redmond, WA",
    founded: "1975",
    type: "Big Tech",
  },
  "netflix": {
    description: "Leading subscription streaming entertainment service and pioneer of distributed microservices architecture.",
    hq: "Los Gatos, CA",
    founded: "1997",
    type: "Big Tech & Entertainment",
  },
  "anthropic": {
    description: "AI safety and research company developing Claude, focused on steerable and interpretable AI systems.",
    hq: "San Francisco, CA",
    founded: "2021",
    type: "Generative AI Pioneer",
  },
  "deepmind": {
    description: "World-renowned artificial intelligence research laboratory creating transformative AI and AlphaFold.",
    hq: "London, UK",
    founded: "2010",
    type: "AI Research (Alphabet)",
  },
  "google-deepmind": {
    description: "World-renowned artificial intelligence research laboratory creating transformative AI and AlphaFold.",
    hq: "London, UK",
    founded: "2010",
    type: "AI Research (Alphabet)",
  },
  "citadel": {
    description: "Premier global alternative investment manager and market maker executing across major asset classes.",
    hq: "Miami, FL",
    founded: "1990",
    type: "HFT & Quant Hedge Fund",
  },
  "jane-street": {
    description: "Quantitative trading firm that uses sophisticated mathematical and OCaml-powered technological systems.",
    hq: "New York, NY",
    founded: "2000",
    type: "Proprietary Trading",
  },
  "two-sigma": {
    description: "Financial sciences company using machine learning and massive data analysis for systematic investing.",
    hq: "New York, NY",
    founded: "2001",
    type: "Quantitative Asset Manager",
  },
  "hudson-river-trading": {
    description: "High-frequency quantitative trading firm engineering ultra-low latency automated trading systems.",
    hq: "New York, NY",
    founded: "2002",
    type: "Quantitative Trading",
  },
  "hrt": {
    description: "High-frequency quantitative trading firm engineering ultra-low latency automated trading systems.",
    hq: "New York, NY",
    founded: "2002",
    type: "Quantitative Trading",
  },
  "uber": {
    description: "Global mobility and delivery platform providing ride-hailing, freight transportation, and food delivery.",
    hq: "San Francisco, CA",
    founded: "2009",
    type: "Public Tech",
  },
  "airbnb": {
    description: "Online marketplace for lodging, homestays, and vacation rentals operating across 220+ countries.",
    hq: "San Francisco, CA",
    founded: "2008",
    type: "Public Tech",
  },
  "stripe": {
    description: "Financial infrastructure platform building economic tools and payment APIs for the global internet.",
    hq: "San Francisco, CA & Dublin",
    founded: "2010",
    type: "Fintech Leader",
  },
  "databricks": {
    description: "Data and AI company offering a unified Lakehouse platform combining data engineering and ML.",
    hq: "San Francisco, CA",
    founded: "2013",
    type: "Enterprise Data Unicorn",
  },
  "snowflake": {
    description: "Cloud-native data platform enabling data warehousing, data lakes, and secure data sharing.",
    hq: "Bozeman, MT",
    founded: "2012",
    type: "Cloud Data Platform",
  },
  "salesforce": {
    description: "World leader in customer relationship management (CRM), cloud computing, and enterprise software.",
    hq: "San Francisco, CA",
    founded: "1999",
    type: "Enterprise Cloud",
  },
  "oracle": {
    description: "Multinational computer technology corporation famous for database software and enterprise cloud infrastructure.",
    hq: "Austin, TX",
    founded: "1977",
    type: "Enterprise Tech",
  },
  "nvidia": {
    description: "Pioneer in GPU design and accelerated computing fueling modern AI, gaming, and robotics.",
    hq: "Santa Clara, CA",
    founded: "1993",
    type: "Semiconductor & AI Hardware",
  },
  "adobe": {
    description: "Creative software powerhouse behind Photoshop, Illustrator, Acrobat, and digital experience cloud.",
    hq: "San Jose, CA",
    founded: "1982",
    type: "Creative & Enterprise Tech",
  },
  "atlassian": {
    description: "Software developer providing collaboration, development, and issue-tracking tools like Jira and Confluence.",
    hq: "Sydney, Australia",
    founded: "2002",
    type: "Enterprise Software",
  },
  "figma": {
    description: "Collaborative web-based design and prototyping platform revolutionizing product design teams.",
    hq: "San Francisco, CA",
    founded: "2012",
    type: "Design & Product Tech",
  },
  "canva": {
    description: "Global visual communications and graphic design platform empowering millions of creators worldwide.",
    hq: "Sydney, Australia",
    founded: "2013",
    type: "Product & Design Unicorn",
  },
  "github": {
    description: "World's largest developer platform and code repository hosting over 100M developers and repositories.",
    hq: "San Francisco, CA",
    founded: "2008",
    type: "Developer Platform (Microsoft)",
  },
  "goldman-sachs": {
    description: "Premier global investment banking, securities, and investment management firm with engineering excellence.",
    hq: "New York, NY",
    founded: "1869",
    type: "Investment Banking",
  },
  "jpmorgan": {
    description: "Leading financial services firm and one of the largest banking institutions in the United States.",
    hq: "New York, NY",
    founded: "1799",
    type: "Global Banking",
  },
  "morgan-stanley": {
    description: "Multinational investment bank and financial services company advising and managing wealth globally.",
    hq: "New York, NY",
    founded: "1935",
    type: "Investment Banking",
  },
  "flipkart": {
    description: "India's premier e-commerce marketplace offering retail consumer goods and digital payments.",
    hq: "Bengaluru, India",
    founded: "2007",
    type: "E-Commerce (Walmart)",
  },
  "zomato": {
    description: "Online restaurant search, dining discovery, food ordering, and grocery delivery service (Blinkit).",
    hq: "Gurugram, India",
    founded: "2008",
    type: "Public Consumer Tech",
  },
  "swiggy": {
    description: "On-demand convenience platform offering food ordering, grocery delivery (Instamart), and logistics.",
    hq: "Bengaluru, India",
    founded: "2014",
    type: "Public Consumer Tech",
  },
  "tcs": {
    description: "India's largest multinational IT services and consulting organization operating in 50+ countries.",
    hq: "Mumbai, India",
    founded: "1968",
    type: "IT & Global Consulting",
  },
  "infosys": {
    description: "Global leader in next-generation digital services, enterprise cloud consulting, and software development.",
    hq: "Bengaluru, India",
    founded: "1981",
    type: "IT & Consulting",
  },
  "wipro": {
    description: "Global information technology, consulting, and business process services company building cognitive solutions.",
    hq: "Bengaluru, India",
    founded: "1945",
    type: "IT & Consulting",
  },
  "de-shaw": {
    description: "Global investment and technology development firm renowned for quantitative modeling and mathematical rigor.",
    hq: "New York, NY",
    founded: "1988",
    type: "Quantitative Hedge Fund",
  },
  "optiver": {
    description: "Leading global market maker providing liquidity to financial markets through high-frequency trading systems.",
    hq: "Amsterdam, Netherlands",
    founded: "1986",
    type: "Market Maker & Proprietary Trading",
  },
  "jump-trading": {
    description: "Research-driven quantitative trading firm engineering ultra-low latency algorithmic architectures.",
    hq: "Chicago, IL",
    founded: "1999",
    type: "Quantitative Trading",
  },
  "spotify": {
    description: "World's largest audio streaming service pioneer in agile engineering, recommendation algorithms, and event streaming.",
    hq: "Stockholm, Sweden",
    founded: "2006",
    type: "Audio Streaming & Tech",
  },
  "walmart": {
    description: "Global retail powerhouse innovating at massive scale across e-commerce, cloud infrastructure, and logistics.",
    hq: "Bentonville, AR",
    founded: "1962",
    type: "Fortune 1 Retail & Cloud",
  },
  "walmart-labs": {
    description: "Technology and innovation engine powering Walmart's massive e-commerce and supply chain platforms.",
    hq: "Sunnyvale, CA & Bengaluru",
    founded: "2011",
    type: "Enterprise Cloud & Retail Tech",
  },
  "palantir": {
    description: "Public big data analytics company building Gotham, Foundry, and AIP for defense and enterprise decision making.",
    hq: "Denver, CO",
    founded: "2003",
    type: "Enterprise Data & AI",
  },
  "cisco": {
    description: "Worldwide leader in networking, telecommunications equipment, cloud security, and IoT infrastructure.",
    hq: "San Jose, CA",
    founded: "1984",
    type: "Networking & Security",
  },
  "intel": {
    description: "Global semiconductor pioneer designing microprocessors, silicon architectures, and data center chips.",
    hq: "Santa Clara, CA",
    founded: "1968",
    type: "Semiconductors",
  },
  "amd": {
    description: "High-performance and adaptive computing leader developing Ryzen CPUs, Radeon GPUs, and EPYC server chips.",
    hq: "Santa Clara, CA",
    founded: "1969",
    type: "Semiconductors",
  },
  "qualcomm": {
    description: "Global wireless technology innovator developing Snapdragon platforms, 5G modems, and edge computing chips.",
    hq: "San Diego, CA",
    founded: "1985",
    type: "Semiconductors & Wireless",
  },
  "paypal": {
    description: "Digital payment solutions pioneer facilitating electronic transactions and merchant processing worldwide.",
    hq: "San Jose, CA",
    founded: "1998",
    type: "Fintech Leader",
  },
  "square": {
    description: "Financial services and digital payments company (Block) empowering commerce for millions of sellers.",
    hq: "San Francisco, CA",
    founded: "2009",
    type: "Fintech & Commerce",
  },
  "block": {
    description: "Global technology company focused on financial services, comprising Square, Cash App, and TIDAL.",
    hq: "San Francisco, CA",
    founded: "2009",
    type: "Fintech Conglomerate",
  },
  "robinhood": {
    description: "Financial services platform pioneering commission-free stock and options trading for modern investors.",
    hq: "Menlo Park, CA",
    founded: "2013",
    type: "Fintech & Brokerage",
  },
  "coinbase": {
    description: "Leading secure online cryptocurrency exchange platform enabling individuals and institutions to trade crypto assets.",
    hq: "San Francisco, CA",
    founded: "2012",
    type: "Crypto & Blockchain Tech",
  },
  "doordash": {
    description: "On-demand local commerce platform connecting consumers with local businesses across 30+ countries.",
    hq: "San Francisco, CA",
    founded: "2013",
    type: "Mobility & Quick Commerce",
  },
  "instacart": {
    description: "Leading grocery technology company partnering with grocers to provide delivery, pickup, and enterprise retail tech.",
    hq: "San Francisco, CA",
    founded: "2012",
    type: "E-Commerce & Delivery",
  },
  "tesla": {
    description: "Electric vehicle, clean energy, and autonomous robotics leader engineering full self-driving neural networks.",
    hq: "Austin, TX",
    founded: "2003",
    type: "EV & Autonomous Systems",
  },
  "bytedance": {
    description: "Global internet technology company operating TikTok, Douyin, and cutting-edge content recommendation algorithms.",
    hq: "Beijing, China & Singapore",
    founded: "2012",
    type: "Global Consumer Tech",
  },
  "tiktok": {
    description: "Leading destination for short-form mobile video powered by advanced AI personalization and recommendation engines.",
    hq: "Los Angeles & Singapore",
    founded: "2016",
    type: "Social Video & Entertainment",
  },
  "snap": {
    description: "Camera and social technology company behind Snapchat, Bitmoji, and augmented reality developer platforms.",
    hq: "Santa Monica, CA",
    founded: "2011",
    type: "Social & AR Media",
  },
  "pinterest": {
    description: "Visual discovery engine and pinboard social platform helping over 500M users find inspiration and ideas.",
    hq: "San Francisco, CA",
    founded: "2010",
    type: "Social Discovery & AI",
  },
  "dropbox": {
    description: "Cloud storage, smart workspace, and file synchronization service used by over 700 million registered users.",
    hq: "San Francisco, CA",
    founded: "2007",
    type: "Cloud & Productivity Tech",
  },
  "slack": {
    description: "Leading AI-powered enterprise work productivity platform and team messaging tool (Salesforce).",
    hq: "San Francisco, CA",
    founded: "2009",
    type: "Enterprise Collaboration",
  },
  "zoom": {
    description: "Unified communications and cloud collaboration platform providing reliable video conferencing and chat.",
    hq: "San Jose, CA",
    founded: "2011",
    type: "Enterprise Video & Cloud",
  },
  "razorpay": {
    description: "India's leading full-stack financial solutions and payment gateway company powering internet businesses.",
    hq: "Bengaluru, India",
    founded: "2014",
    type: "Fintech Unicorn",
  },
  "phonepe": {
    description: "India's leading digital payments and financial services company processing billions of monthly UPI transactions.",
    hq: "Bengaluru, India",
    founded: "2015",
    type: "Fintech Leader (Walmart)",
  },
  "paytm": {
    description: "Pioneering Indian digital payments, QR code merchant transactions, and financial ecosystem company.",
    hq: "Noida, India",
    founded: "2010",
    type: "Fintech Leader",
  },
  "cred": {
    description: "Reward-based credit card payment platform and fintech community rewarding creditworthy individuals.",
    hq: "Bengaluru, India",
    founded: "2018",
    type: "Fintech Unicorn",
  },
  "zerodha": {
    description: "India's largest retail stockbroker known for Kite, zero-brokerage model, and lean high-performance engineering.",
    hq: "Bengaluru, India",
    founded: "2010",
    type: "Fintech & Stockbroking",
  },
  "groww": {
    description: "Rapidly growing investment platform making investing in stocks, mutual funds, and ETFs simple and accessible.",
    hq: "Bengaluru, India",
    founded: "2016",
    type: "Fintech Unicorn",
  },
  "meesho": {
    description: "Social e-commerce marketplace empowering small businesses and consumers across Tier-2+ Indian cities.",
    hq: "Bengaluru, India",
    founded: "2015",
    type: "E-Commerce Unicorn",
  },
  "browserstack": {
    description: "Global cloud web and mobile testing platform enabling developers to test on 3,000+ real devices and browsers.",
    hq: "Mumbai, India & Dublin",
    founded: "2011",
    type: "DevTools Unicorn",
  },
  "postman": {
    description: "World's leading API platform used by over 30 million developers to build, test, and collaborate on APIs.",
    hq: "San Francisco, CA & Bengaluru",
    founded: "2014",
    type: "DevTools Unicorn",
  },
  "freshworks": {
    description: "SaaS company delivering AI-driven customer service and IT service management software for businesses.",
    hq: "San Mateo, CA & Chennai",
    founded: "2010",
    type: "Public Enterprise SaaS",
  },
  "zoho": {
    description: "Pioneering bootstrapped software company offering an extensive suite of cloud business applications.",
    hq: "Chennai, India",
    founded: "1996",
    type: "Enterprise Cloud & SaaS",
  },
  "akuna-capital": {
    description: "Leading quantitative trading firm and liquidity provider specializing in derivatives market making.",
    hq: "Chicago, IL",
    founded: "2011",
    type: "Proprietary Trading & HFT",
  },
  "drw": {
    description: "Diversified principal trading firm innovating in quantitative modeling, real estate, and crypto assets.",
    hq: "Chicago, IL",
    founded: "1992",
    type: "Proprietary Trading",
  },
  "five-rings": {
    description: "Quantitative trading firm combining proprietary technology and mathematical insight to trade global markets.",
    hq: "New York, NY",
    founded: "2004",
    type: "Quantitative Trading",
  },
  "flow-traders": {
    description: "Leading global financial technology-enabled liquidity provider specializing in Exchange Traded Products.",
    hq: "Amsterdam & New York",
    founded: "2004",
    type: "Market Maker & HFT",
  },
  "graviton-research": {
    description: "Quantitative algorithmic trading firm building ultra-low latency execution engines.",
    hq: "Gurugram, India",
    founded: "2014",
    type: "Quantitative Trading",
  },
  "graviton-research-capital": {
    description: "Quantitative algorithmic trading firm building ultra-low latency execution engines.",
    hq: "Gurugram, India",
    founded: "2014",
    type: "Quantitative Trading",
  },
  "millennium-management": {
    description: "Global investment management firm operating a multi-strategy quantitative and fundamental hedge fund.",
    hq: "New York, NY",
    founded: "1989",
    type: "Hedge Fund & Quant",
  },
  "worldquant": {
    description: "Quantitative asset management firm developing predictive mathematical algorithms for financial markets.",
    hq: "Old Greenwich, CT",
    founded: "2007",
    type: "Quantitative Asset Management",
  },
  "datadog": {
    description: "Monitoring and security platform for cloud applications providing full-stack observability.",
    hq: "New York, NY",
    founded: "2010",
    type: "Cloud Observability SaaS",
  },
  "cloudflare": {
    description: "Global cloud network providing web performance, cybersecurity, and serverless edge computing (Workers).",
    hq: "San Francisco, CA",
    founded: "2009",
    type: "Cloud & Cybersecurity",
  },
  "confluent": {
    description: "Data streaming platform pioneer founded by the creators of Apache Kafka for real-time event streaming.",
    hq: "Mountain View, CA",
    founded: "2014",
    type: "Event Streaming Platform",
  },
  "twilio": {
    description: "Customer engagement and cloud communications platform providing SMS, voice, and video APIs.",
    hq: "San Francisco, CA",
    founded: "2008",
    type: "Cloud Communications API",
  },
  "crowdstrike": {
    description: "Global cybersecurity leader pioneering Falcon cloud-native endpoint protection and threat intelligence.",
    hq: "Austin, TX",
    founded: "2011",
    type: "Cybersecurity Leader",
  },
  "palo-alto-networks": {
    description: "Multinational cybersecurity company providing advanced firewalls and cloud-delivered security solutions.",
    hq: "Santa Clara, CA",
    founded: "2005",
    type: "Cybersecurity Leader",
  },
  "zscaler": {
    description: "Cloud security pioneer providing Zero Trust Exchange to securely connect users and applications.",
    hq: "San Jose, CA",
    founded: "2007",
    type: "Zero Trust Security",
  },
  "mongodb": {
    description: "Leading modern developer data platform built around a distributed, document-oriented database model.",
    hq: "New York, NY",
    founded: "2007",
    type: "Developer Data Platform",
  },
  "scale-ai": {
    description: "Data infrastructure company providing training data and evaluation benchmarks for generative AI models.",
    hq: "San Francisco, CA",
    founded: "2016",
    type: "AI Infrastructure Unicorn",
  },
  "reddit": {
    description: "Social news aggregation, content rating, and discussion website with millions of active communities.",
    hq: "San Francisco, CA",
    founded: "2005",
    type: "Public Social Media",
  },
  "discord": {
    description: "Voice, video, and text communication service used by hundreds of millions of people to connect.",
    hq: "San Francisco, CA",
    founded: "2015",
    type: "Consumer Communication",
  },
  "zepto": {
    description: "Fastest-growing 10-minute quick-commerce delivery platform in India delivering groceries and essentials.",
    hq: "Mumbai, India",
    founded: "2021",
    type: "Quick Commerce Unicorn",
  },
  "blinkit": {
    description: "Quick-commerce pioneer delivering groceries and everyday essentials in minutes (Zomato).",
    hq: "Gurugram, India",
    founded: "2013",
    type: "Quick Commerce Leader",
  },
  "ola": {
    description: "Leading Indian mobility and ride-hailing company expanding into electric vehicles (Ola Electric).",
    hq: "Bengaluru, India",
    founded: "2010",
    type: "Mobility & EV Tech",
  },
  "cognizant": {
    description: "Multinational IT services and enterprise consulting corporation driving digital transformation.",
    hq: "Teaneck, NJ",
    founded: "1994",
    type: "IT & Global Consulting",
  },
  "hcl": {
    description: "Leading global IT enterprise helping businesses reimagine their commerce through digital engineering.",
    hq: "Noida, India",
    founded: "1976",
    type: "IT Services & Technology",
  },
  "hcl-technologies": {
    description: "Leading global IT enterprise helping businesses reimagine their commerce through digital engineering.",
    hq: "Noida, India",
    founded: "1976",
    type: "IT Services & Technology",
  },
  "thoughtspot": {
    description: "AI-powered search and analytics company enabling natural-language business intelligence queries.",
    hq: "Sunnyvale, CA",
    founded: "2012",
    type: "Enterprise Data & AI",
  },
  "sprinklr": {
    description: "Unified Customer Experience Management (Unified-CXM) platform for enterprise customer care and marketing.",
    hq: "New York, NY",
    founded: "2009",
    type: "Customer Experience SaaS",
  },
  "affirm": {
    description: "Financial technology company providing transparent buy-now-pay-later payment networks.",
    hq: "San Francisco, CA",
    founded: "2012",
    type: "Fintech Leader",
  },
  "plaid": {
    description: "Financial services company that builds the data network powering the fintech ecosystem.",
    hq: "San Francisco, CA",
    founded: "2013",
    type: "Fintech Infrastructure",
  },
  "brex": {
    description: "AI-powered corporate credit card, spend management, and business banking platform for enterprises.",
    hq: "San Francisco, CA",
    founded: "2017",
    type: "Fintech Unicorn",
  },
};

const CATEGORY_DESCRIPTIONS: Record<string, string> = {
  "FAANG & Tech Giants":
    "Top-tier global technology leader shaping consumer applications, distributed cloud computing, and large-scale systems.",
  "AI, Machine Learning & Data":
    "Innovator in artificial intelligence, machine learning systems, data engineering, and modern analytical platforms.",
  "HFT & Quant Trading":
    "Specializes in quantitative finance, electronic markets, or high-frequency trading with emphasis on algorithmic efficiency.",
  "Banking & Fintech":
    "Pioneering digital financial infrastructure, modern payments, banking technology, and consumer financial services.",
  "Enterprise, SaaS & Cloud":
    "Delivers mission-critical business software, workflow automation, cloud infrastructure, and enterprise solutions.",
  "Cybersecurity & Identity":
    "Focuses on security infrastructure, identity verification, zero-trust architectures, and resilient cyber defense.",
  "Hardware & Semiconductors":
    "Designs cutting-edge silicon architectures, microprocessors, embedded systems, and accelerated computing hardware.",
  "E-Commerce & Retail Tech":
    "Powers modern digital commerce, high-throughput transaction processing, and intelligent supply chain systems.",
  "Automotive & Mobility":
    "Pioneering smart mobility platforms, autonomous systems, routing logistics, and transportation infrastructure.",
  "Food & Quick Commerce":
    "Operates high-throughput on-demand ordering platforms, delivery dispatch systems, and quick-commerce logistics.",
  "Social Media & Community":
    "Connects millions of global users through high-scale social networks, messaging protocols, and multimedia platforms.",
  "Gaming, Streaming & Media":
    "Develops interactive digital entertainment, real-time 3D graphics, game engines, and streaming multimedia.",
  "Healthcare & Biotech":
    "Applies software engineering and computational biology to modern healthcare systems, clinical data, and diagnostics.",
  "IT Consulting & Services":
    "Global enterprise consulting and digital engineering firm delivering software architecture at worldwide scale.",
  "EdTech & Careers":
    "Innovates educational technology, interactive learning experiences, career development, and digital instruction.",
  "Travel & Real Estate":
    "Engineers digital booking systems, global travel discovery engines, and property marketplaces.",
  "Telecom & Networks":
    "Provides telecommunications backbones, high-bandwidth networking, and modern digital media delivery.",
  "Energy, Industrial & Defense":
    "Builds mission-critical technology for clean energy, industrial automation, defense, and infrastructure.",
};

const CATEGORY_HUBS: Record<string, string> = {
  "FAANG & Tech Giants": "Silicon Valley & Global Tech Hubs",
  "AI, Machine Learning & Data": "San Francisco, CA & Global",
  "HFT & Quant Trading": "New York, Chicago & London",
  "Banking & Fintech": "New York, Bengaluru & Global",
  "Enterprise, SaaS & Cloud": "San Francisco Bay Area & Remote",
  "Cybersecurity & Identity": "California & Global Tech Hubs",
  "Hardware & Semiconductors": "Santa Clara, CA & Austin, TX",
  "E-Commerce & Retail Tech": "Seattle, Bengaluru & Global",
  "Automotive & Mobility": "San Francisco, CA & Global",
  "Food & Quick Commerce": "Global Metros & Delivery Hubs",
  "Social Media & Community": "San Francisco Bay Area & Global",
  "Gaming, Streaming & Media": "Los Angeles, Tokyo & Global",
  "Healthcare & Biotech": "Boston, San Francisco & Global",
  "IT Consulting & Services": "Bengaluru, Mumbai & Global",
  "EdTech & Careers": "Bengaluru, San Francisco & Remote",
  "Travel & Real Estate": "San Francisco, London & Global",
  "Telecom & Networks": "Dallas, Atlanta & Global",
  "Energy, Industrial & Defense": "Houston, Washington DC & Global",
};

export function getCompanyDetail(slugOrName: string, categoryName?: string): Required<CompanyDetail> {
  const norm = slugOrName.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-");

  const domain = categoryName || "Enterprise Technology";
  const defaultHub = CATEGORY_HUBS[domain] || "United States & Global";
  const defaultDesc = CATEGORY_DESCRIPTIONS[domain] || `Leading organization in ${domain}, recognized for challenging technical interviews and engineering standards.`;

  if (CURATED_COMPANY_DETAILS[norm]) {
    const curated = CURATED_COMPANY_DETAILS[norm];
    return {
      description: curated.description,
      hq: curated.hq || defaultHub,
      founded: curated.founded || "Active Tech Employer",
      type: curated.type || domain,
    };
  }

  return {
    description: defaultDesc,
    hq: defaultHub,
    founded: "Active Tech Employer",
    type: domain,
  };
}

