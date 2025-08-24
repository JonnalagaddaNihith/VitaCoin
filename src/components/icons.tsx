import type { SVGProps } from 'react';

export function VitaDashLogo(props: SVGProps<SVGSVGElement>) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
            <circle cx="12" cy="12" r="10" className="stroke-primary" />
            <path d="M8 14s1.5 2 4 2 4-2 4-2" className="stroke-primary" />
            <line x1="9" y1="9" x2="9.01" y2="9" className="stroke-primary" />
            <line x1="15" y1="9" x2="15.01" y2="9" className="stroke-primary" />
        </svg>
    )
}
