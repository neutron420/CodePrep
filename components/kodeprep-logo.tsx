import Link from "next/link";

export interface KodePrepLogoProps {
  className?: string;
  imageClassName?: string;
}

export function KodePrepLogo({ className, imageClassName }: KodePrepLogoProps) {
  return (
    <Link
      href="/"
      className={`inline-flex items-center group select-none shrink-0 ${className ?? ""}`}
    >
      <img
        src="/codecraft-logo-tight.png"
        alt="CodeCraft"
        className={`h-7 sm:h-8 w-auto object-contain object-left group-hover:scale-105 transition-transform ${imageClassName ?? ""}`}
      />
    </Link>
  );
}

export function KodePrepLogoIcon({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      className={`inline-flex items-center group select-none shrink-0 ${className ?? ""}`}
    >
      <img
        src="/codecraft-logo-tight.png"
        alt="CodeCraft Icon"
        className={`h-6 sm:h-7 w-auto object-contain object-left group-hover:scale-105 transition-transform ${className ?? ""}`}
      />
    </Link>
  );
}


