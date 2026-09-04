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
      <span className="h-10 sm:h-12 w-[150px] sm:w-[180px] overflow-hidden inline-flex items-center justify-start">
        <img
          src="/kodeprep-site-logo.png"
          alt="CodeCraft"
          className={`h-[110px] sm:h-[130px] w-auto object-contain object-center group-hover:scale-105 transition-transform ${imageClassName ?? ""}`}
        />
      </span>
    </Link>
  );
}

export function KodePrepLogoIcon({ className }: { className?: string }) {
  return (
    <span className={`h-9 w-[130px] overflow-hidden inline-flex items-center justify-start ${className ?? ""}`}>
      <img
        src="/kodeprep-site-logo.png"
        alt="CodeCraft Icon"
        className="h-[100px] w-auto object-contain object-center"
      />
    </span>
  );
}


