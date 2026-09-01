import type { SVGProps } from "react";

const CSES = (props: SVGProps<SVGSVGElement>) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="CSES">
    <rect x="1.5" y="3.5" width="21" height="17" rx="2.5" fill="#2C5F8D" />
    <path
      d="M7.4 9.2c-.9 0-1.6.7-1.6 1.6v2.4c0 .9.7 1.6 1.6 1.6h1.3v-1.5H7.6c-.2 0-.3-.1-.3-.3v-2c0-.2.1-.3.3-.3h1.1V9.2z"
      fill="#fff"
    />
    <path
      d="M11.2 9.2c-.8 0-1.5.6-1.5 1.4 0 .7.4 1.2 1.1 1.4l1 .3c.2.1.3.2.3.4 0 .2-.2.4-.5.4h-1.7v1.3h1.8c.9 0 1.6-.6 1.6-1.5 0-.7-.4-1.2-1.1-1.4l-1-.3c-.2-.1-.3-.2-.3-.4 0-.2.2-.3.4-.3h1.6V9.2z"
      fill="#fff"
    />
    <path d="M14.6 9.2v5.6h3.9v-1.4h-2.4v-.9h2.1v-1.3h-2.1v-.7h2.4V9.2z" fill="#fff" />
  </svg>
);

export { CSES };
