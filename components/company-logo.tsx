"use client";

import { useState, useMemo } from "react";
import { getCompanyDomain, HARDCODED_LOGOS } from "@/lib/company-domains";

import { CompanyTooltip } from "@/components/company-tooltip";

interface CompanyLogoProps {
  name: string;
  className?: string;
  showTooltip?: boolean;
  problemCount?: number;
}

function stringToColor(str: string) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = Math.abs(hash) % 360;
  return `hsl(${hue}, 65%, 45%)`;
}

function nameToSlug(name: string): string {
  return name.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-");
}

export function CompanyLogo({ name, className = "size-5", showTooltip = false, problemCount }: CompanyLogoProps) {
  const [sourceIndex, setSourceIndex] = useState(0);

  const domain = useMemo(() => getCompanyDomain(name), [name]);
  const slug = useMemo(() => nameToSlug(name), [name]);

  const logoSources = useMemo(() => {
    const sources: string[] = [];

    // Check hardcoded logos first (guaranteed to work for TCS, HCL, ByteDance etc.)
    const hardcoded = HARDCODED_LOGOS[slug];
    if (hardcoded) {
      sources.push(hardcoded);
    }

    // 1. Unavatar (Vector and HD logos)
    sources.push(`https://unavatar.io/${domain}`);

    // 2. Clearbit Logo API (High res brand logos)
    sources.push(`https://logo.clearbit.com/${domain}`);

    // 3. Google S2 Favicons (128px HD)
    sources.push(`https://www.google.com/s2/favicons?domain=${domain}&sz=128`);

    // 4. Icon Horse API
    sources.push(`https://icon.horse/icon/${domain}`);

    return sources;
  }, [domain, slug]);

  const initial = name.charAt(0).toUpperCase();
  const bgColor = useMemo(() => stringToColor(name), [name]);

  const currentSource = logoSources[sourceIndex];

  const logoElement = (!currentSource || sourceIndex >= logoSources.length) ? (
    <div
      className={`rounded-2xl font-bold text-white flex items-center justify-center shrink-0 uppercase shadow-2xs select-none ${className}`}
      style={{ backgroundColor: bgColor }}
    >
      {initial}
    </div>
  ) : (
    <div className={`relative flex items-center justify-center rounded-2xl overflow-hidden bg-white shrink-0 border border-border/40 ${className}`}>
      <img
        key={`${domain}-${sourceIndex}`}
        src={currentSource}
        alt={`${name} logo`}
        onError={() => setSourceIndex((prev) => prev + 1)}
        className="size-full object-contain p-1 rounded-xl"
        loading="lazy"
      />
    </div>
  );

  if (showTooltip) {
    return <CompanyTooltip name={name} problemCount={problemCount}>{logoElement}</CompanyTooltip>;
  }

  return logoElement;
}
