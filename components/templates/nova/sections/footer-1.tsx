import Link from 'next/link'

const Logo = ({ className }: { className?: string }) => (
    <svg
        className={`text-foreground size-6 ${className ?? ""}`}
        viewBox="0 0 28 28"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="KodePrep logo">
        <rect x="0.75" y="0.75" width="26.5" height="26.5" rx="5.25" stroke="currentColor" strokeWidth="1.5" />
        <path d="M8 7.5v13M8 14l6.5-6.5M8 14l7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const links = {
    product: [
        { label: 'Features', href: '#features' },
        { label: 'Topics', href: '#topics' },
        { label: 'Pricing', href: '#pricing' },
        { label: 'FAQs', href: '#faqs' },
    ],
    platforms: [
        { label: 'LeetCode', href: 'https://leetcode.com' },
        { label: 'Codeforces', href: 'https://codeforces.com' },
        { label: 'CodeChef', href: 'https://codechef.com' },
        { label: 'CSES', href: 'https://cses.fi' },
    ],
    resources: [
        { label: 'Companies', href: '#features' },
        { label: 'Topics', href: '#topics' },
        { label: 'Pricing', href: '#pricing' },
        { label: 'Support', href: '#faqs' },
    ],
    legal: [
        { label: 'Privacy', href: '#' },
        { label: 'Terms', href: '#' },
    ],
}

export default function Footer() {
    return (
        <footer className="bg-background @container border-t py-12">
            <div className="mx-auto max-w-2xl px-6">
                <div className="@sm:grid-cols-3 grid grid-cols-2 gap-8">
                    <div className="col-span-full">
                        <Link
                            href="/"
                            className="flex items-center gap-2">
                            <Logo className="size-6" />
                            <span className="text-foreground font-serif text-lg font-medium">KodePrep</span>
                        </Link>
                        <p className="text-muted-foreground mt-4 max-w-xs text-sm">Company-wise coding interview prep. Practice real questions, track your progress.</p>
                    </div>
                    <div>
                        <h3 className="text-foreground mb-3 text-sm font-medium">Product</h3>
                        <ul className="space-y-2">
                            {links.product.map((link) => (
                                <li key={link.label}>
                                    <Link
                                        href={link.href}
                                        className="text-muted-foreground hover:text-foreground text-sm transition-colors">
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-foreground mb-3 text-sm font-medium">Platforms</h3>
                        <ul className="space-y-2">
                            {links.platforms.map((link) => (
                                <li key={link.label}>
                                    <Link
                                        href={link.href}
                                        className="text-muted-foreground hover:text-foreground text-sm transition-colors">
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-foreground mb-3 text-sm font-medium">Resources</h3>
                        <ul className="space-y-2">
                            {links.resources.map((link) => (
                                <li key={link.label}>
                                    <Link
                                        href={link.href}
                                        className="text-muted-foreground hover:text-foreground text-sm transition-colors">
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
                <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t pt-8">
                    <p className="text-muted-foreground text-sm">&copy; {2026} KodePrep. All rights reserved.</p>
                    <div className="flex gap-4">
                        {links.legal.map((link) => (
                            <Link
                                key={link.label}
                                href={link.href}
                                className="text-muted-foreground hover:text-foreground text-sm transition-colors">
                                {link.label}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    )
}
