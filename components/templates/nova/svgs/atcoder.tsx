import type { SVGProps } from "react";

const AtCoder = (props: SVGProps<SVGSVGElement>) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="AtCoder">
    <circle cx="12" cy="12" r="10.5" fill="#000" />
    <path
      d="M12 5.5 6.2 17.2h2.6l1-2.1h4.4l1 2.1h2.6zm0 3.4 1.5 3.2h-3z"
      fill="#fff"
    />
  </svg>
);

export { AtCoder };
