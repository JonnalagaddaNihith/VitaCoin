import type { SVGProps } from 'react';
import Image from 'next/image';

export function VitaDashLogo(props: SVGProps<SVGSVGElement>) {
    return (
        <Image
            src="/VitaCoin.png"
            alt="VitaCoin Logo"
            width={props.width || 24}
            height={props.height || 24}
            className={props.className}
            style={{ objectFit: 'contain' }}
        />
    );
}
