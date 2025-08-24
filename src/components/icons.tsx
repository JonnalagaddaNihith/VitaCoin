import type { SVGProps } from 'react';
import Image from 'next/image';

interface VitaCoinLogoProps extends Omit<SVGProps<SVGSVGElement>, 'width' | 'height'> {
    width?: number | `${number}`;
    height?: number | `${number}`;
}

export function VitaCoinLogo({ width = 128, height = 128, ...props }: VitaCoinLogoProps) {
    return (
        <Image
            src="/VitaCoin.png"
            alt="VitaCoin Logo"
            width={width}
            height={height}
            className={props.className}
            style={{ objectFit: 'contain' }}
            priority={true}
            quality={95}
        />
    );
}
