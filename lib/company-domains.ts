// Hardcoded direct logo paths or direct icon URLs for companies
export const HARDCODED_LOGOS: Record<string, string> = {
  tcs: "/logos/tcs.png",
  "tata-consultancy-services": "/logos/tcs.png",
  hcl: "/logos/hcl.png",
  "hcl-technologies": "/logos/hcl.png",
  bytedance: "/logos/bytedance.png",
  "walmart-labs": "https://www.google.com/s2/favicons?domain=walmart.com&sz=128",
  walmart: "https://www.google.com/s2/favicons?domain=walmart.com&sz=128",
};

// Mapping company slugs & names to official domains for fetching real company logos
export const COMPANY_DOMAINS: Record<string, string> = {
  // User Requested Companies
  nutanix: "nutanix.com",
  "palo-alto-networks": "paloaltonetworks.com",
  "paloalto-networks": "paloaltonetworks.com",
  "media-net": "media.net",
  "media.net": "media.net",
  "josh-technology-group": "joshtechnology.com",
  "josh-technology": "joshtechnology.com",
  "ola-cabs": "olacabs.com",
  ola: "olacabs.com",
  bny: "bnymellon.com",
  "bny-mellon": "bnymellon.com",
  zoho: "zoho.com",
  "booking-com": "booking.com",
  "booking.com": "booking.com",
  booking: "booking.com",
  dream11: "dream11.com",
  ozon: "ozon.ru",
  juspay: "juspay.in",
  "graviton-research-capital": "gravitonresearch.com",
  graviton: "gravitonresearch.com",
  "info-edge": "infoedge.in",
  infoedge: "infoedge.in",
  "millennium-management": "mlp.com",
  millennium: "mlp.com",
  dunzo: "dunzo.com",
  liftoff: "liftoff.io",
  "aquila-capital-management": "aquila-capital.de",
  "aquila-capital": "aquila-capital.de",
  "works-applications": "worksap.co.jp",
  tusimple: "tusimple.com",
  gameskraft: "gameskraft.com",
  airbus: "airbus.com",
  "mckinsey-company": "mckinsey.com",
  "mckinsey-and-company": "mckinsey.com",
  mckinsey: "mckinsey.com",
  ltimindtree: "ltimindtree.com",
  "lti-mindtree": "ltimindtree.com",
  "ge-digital": "ge.com",
  ge: "ge.com",
  deltax: "deltax.com",
  teradata: "teradata.com",
  cohesity: "cohesity.com",
  hilabs: "hilabs.com",
  "hi-labs": "hilabs.com",
  "iit-bombay": "iitb.ac.in",
  iitb: "iitb.ac.in",
  hiver: "hiverhq.com",
  cred: "cred.club",
  "national-payments-corporation-of-india-npci": "npci.org.in",
  "national-payments-corporation-of-india": "npci.org.in",
  npci: "npci.org.in",
  netease: "163.com",
  soti: "soti.net",
  bp: "bp.com",
  "lendingkart-technologies": "lendingkart.com",
  lendingkart: "lendingkart.com",
  fastenal: "fastenal.com",
  "scale-ai": "scale.com",
  scale: "scale.com",
  "cult-fit": "cult.fit",
  "cure-fit": "cult.fit",
  cultfit: "cult.fit",
  synopsys: "synopsys.com",
  optum: "optum.com",
  shopee: "shopee.com",
  confluent: "confluent.io",
  blackrock: "blackrock.com",

  // FAANG & Big Tech
  google: "google.com",
  meta: "meta.com",
  facebook: "meta.com",
  amazon: "amazon.com",
  apple: "apple.com",
  netflix: "netflix.com",
  microsoft: "microsoft.com",
  bytedance: "bytedance.com",
  adobe: "adobe.com",
  linkedin: "linkedin.com",
  salesforce: "salesforce.com",
  nvidia: "nvidia.com",

  // HFT & Quant
  citadel: "citadel.com",
  "jane-street": "janestreet.com",
  "two-sigma": "twosigma.com",
  "hudson-river-trading": "hudsonrivertrading.com",
  "jump-trading": "jumptrading.com",
  optiver: "optiver.com",
  drw: "drw.com",
  sig: "sig.com",
  "tower-research-capital": "tower-research.com",
  "akuna-capital": "akunacapital.com",
  "squarepoint-capital": "squarepoint-capital.com",

  // Service Based Tech & IT Consultancies
  tcs: "tcs.com",
  "tata-consultancy-services": "tcs.com",
  hcl: "hcltech.com",
  "hcl-technologies": "hcltech.com",
  "walmart-labs": "walmart.com",
  walmart: "walmart.com",
  infosys: "infosys.com",
  wipro: "wipro.com",
  accenture: "accenture.com",
  cognizant: "cognizant.com",
  capgemini: "capgemini.com",
  "tech-mahindra": "techmahindra.com",
  "epam-systems": "epam.com",
  deloitte: "deloitte.com",

  // Fintech & Product Unicorns
  uber: "uber.com",
  airbnb: "airbnb.com",
  stripe: "stripe.com",
  coinbase: "coinbase.com",
  doordash: "doordash.com",
  "door-dash": "doordash.com",
  robinhood: "robinhood.com",
  databricks: "databricks.com",
  snowflake: "snowflake.com",
  atlassian: "atlassian.com",
  "palantir-technologies": "palantir.com",
  snap: "snap.com",
  pinterest: "pinterest.com",
  "goldman-sachs": "goldmansachs.com",
  "j.p.-morgan": "jpmorgan.com",
  "jpmorgan": "jpmorgan.com",
  "morgan-stanley": "morganstanley.com",
  paypal: "paypal.com",
  spotify: "spotify.com",
  twilio: "twilio.com",
  x: "x.com",
  twitter: "x.com",
  ibm: "ibm.com",
  oracle: "oracle.com",
  cisco: "cisco.com",
  intel: "intel.com",
  amd: "amd.com",
  qualcomm: "qualcomm.com",
  samsung: "samsung.com",
  swiggy: "swiggy.com",
  zomato: "zomato.com",
  paytm: "paytm.com",
  phonepe: "phonepe.com",
  flipkart: "flipkart.com",
  meesho: "meesho.com",
  razorpay: "razorpay.com",
  "urban-company": "urbancompany.com",
  nykaa: "nykaa.com",
  zepto: "zepto.com",
  blinkit: "blinkit.com",
  "make-my-trip": "makemytrip.com",
  makemytrip: "makemytrip.com",
};

export function getCompanyDomain(nameOrSlug: string): string {
  const rawLower = nameOrSlug.toLowerCase().trim();

  // If raw string already has a domain extension like "Booking.com" or "Media.net"
  if (rawLower.includes(".com") || rawLower.includes(".net") || rawLower.includes(".in") || rawLower.includes(".fit") || rawLower.includes(".io")) {
    const parts = rawLower.split(" ");
    const domainPart = parts.find((p) => p.includes("."));
    if (domainPart) return domainPart.replace(/[^a-z0-9.-]/g, "");
  }

  const normalized = rawLower.replace(/[^a-z0-9]+/g, "-");
  if (COMPANY_DOMAINS[normalized]) {
    return COMPANY_DOMAINS[normalized];
  }

  // Handle common patterns
  if (normalized.includes("tata-consultancy") || normalized === "tcs") return "tcs.com";
  if (normalized.includes("hcl")) return "hcltech.com";
  if (normalized.includes("palo-alto")) return "paloaltonetworks.com";
  if (normalized.includes("mckinsey")) return "mckinsey.com";
  if (normalized.includes("npci")) return "npci.org.in";
  if (normalized.includes("lendingkart")) return "lendingkart.com";
  if (normalized.includes("cult")) return "cult.fit";
  if (normalized.includes("curefit")) return "cult.fit";
  if (normalized.includes("juspay")) return "juspay.in";
  if (normalized.includes("info-edge") || normalized.includes("infoedge")) return "infoedge.in";

  // Fallback guess domain: e.g. "Bloomberg" -> "bloomberg.com"
  const cleanName = rawLower.replace(/[^a-z0-9]/g, "");
  return `${cleanName}.com`;
}
