import type { SVGProps } from "react";

const HackerRank = (props: SVGProps<SVGSVGElement>) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="HackerRank">
    <path
      d="M12 0c1.29 0 8.36 4.08 9.01 5.2.65 1.12.65 9.28 0 10.4C20.36 16.72 13.29 20.8 12 20.8s-8.36-4.08-9.01-5.2c-.65-1.12-.65-9.28 0-10.4C3.64 4.08 10.71 0 12 0z"
      fill="#00EA64"
      transform="translate(0 1.6)"
    />
    <path
      d="M9.1 7.4h1.36v3.2h3.08V7.4h1.36v9.2h-1.36v-4.2h-3.08v4.2H9.1z"
      fill="#fff"
    />
  </svg>
);

export { HackerRank };
