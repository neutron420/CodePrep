import Link from "next/link";

export interface KodePrepLogoProps {
  className?: string;
  imageClassName?: string;
}

export function KodePrepLogo({ className, imageClassName }: KodePrepLogoProps) {
  return (
    <Link
      href="/"
      className={`inline-flex items-center group select-none ${className ?? ""}`}
    >
      <img
        src="/logo.jpeg"
        alt="Logo"
        className={`h-8 sm:h-9 w-auto object-contain rounded-lg group-hover:scale-105 transition-transform ${imageClassName ?? ""}`}
      />
    </Link>
  );
}

export function KodePrepLogoIcon({ className }: { className?: string }) {
  return (
    <img
      src="/logo.jpeg"
      alt="Logo Icon"
      className={`size-7 sm:size-8 object-contain rounded-md ${className ?? ""}`}
    />
  );
}
