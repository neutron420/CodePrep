// Hardcoded direct logo paths for companies whose logos don't resolve via Clearbit/favicon APIs
// These use local images stored in /public/logos/
export const HARDCODED_LOGOS: Record<string, string> = {
  tcs: "/logos/tcs.png",
  "tata-consultancy-services": "/logos/tcs.png",
  hcl: "/logos/hcl.png",
  "hcl-technologies": "/logos/hcl.png",
  bytedance: "/logos/bytedance.png",
  "walmart-labs": "https://www.google.com/s2/favicons?domain=walmart.com&sz=128",
  walmart: "https://www.google.com/s2/favicons?domain=walmart.com&sz=128",
};

// Mapping company slugs to official domains for fetching real company logos
export const COMPANY_DOMAINS: Record<string, string> = {
  // FAANG & Big Tech
  google: "google.com",
  meta: "meta.com",
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
  "morgan-stanley": "morganstanley.com",
  paypal: "paypal.com",
  spotify: "spotify.com",
  twilio: "twilio.com",
  x: "x.com",
  ibm: "ibm.com",
  oracle: "oracle.com",
  cisco: "cisco.com",
  intel: "intel.com",
  amd: "amd.com",
  qualcomm: "qualcomm.com",
  samsung: "samsung.com",
};

export function getCompanyDomain(nameOrSlug: string): string {
  const normalized = nameOrSlug.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-");
  if (COMPANY_DOMAINS[normalized]) {
    return COMPANY_DOMAINS[normalized];
  }

  // Handle common names
  if (normalized === "tcs" || normalized.includes("tata-consultancy")) return "tataconsultancy.com";
  if (normalized === "hcl" || normalized.includes("hcl")) return "hcltech.com";

  // Fallback guess domain: e.g. "Bloomberg" -> "bloomberg.com"
  const cleanName = nameOrSlug.toLowerCase().replace(/[^a-z0-9]/g, "");
  return `${cleanName}.com`;
}
