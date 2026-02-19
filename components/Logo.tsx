import clsx from 'clsx';
import Image from 'next/image';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'icon' | 'full' | 'adaptive';
  className?: string;
}

const responsiveSizes = {
  sm: {
    icon: 'h-7 w-7 sm:h-8 sm:w-8',
    iconSizeHint: '(max-width: 640px) 28px, 32px',
    full: 'w-[110px] sm:w-[130px]',
    fullSizeHint: '(max-width: 640px) 110px, 130px',
  },
  md: {
    icon: 'h-9 w-9 sm:h-10 sm:w-10',
    iconSizeHint: '(max-width: 640px) 36px, 40px',
    full: 'w-[140px] sm:w-[160px]',
    fullSizeHint: '(max-width: 640px) 140px, 160px',
  },
  lg: {
    icon: 'h-12 w-12 sm:h-14 sm:w-14',
    iconSizeHint: '(max-width: 640px) 48px, 56px',
    full: 'w-[180px] sm:w-[220px]',
    fullSizeHint: '(max-width: 640px) 180px, 220px',
  },
} as const;

export default function Logo({ size = 'md', variant = 'full', className = '' }: LogoProps) {
  const config = responsiveSizes[size];

  if (variant === 'icon') {
    return (
      <div className={clsx('relative shrink-0', config.icon, className)}>
        <Image src="/favicon.svg" alt="RecordBridge logo" fill sizes={config.iconSizeHint} className="object-contain" priority />
      </div>
    );
  }

  if (variant === 'adaptive') {
    return (
      <div className={clsx('relative shrink-0', className)}>
        <div className={clsx('relative sm:hidden', config.icon)}>
          <Image src="/favicon.svg" alt="RecordBridge logo" fill sizes={config.iconSizeHint} className="object-contain" priority />
        </div>
        <div className={clsx('relative hidden sm:block', config.full)}>
          <Image
            src="/logo.svg"
            alt="RecordBridge"
            width={280}
            height={92}
            sizes={config.fullSizeHint}
            className="h-auto w-full"
            priority
          />
        </div>
      </div>
    );
  }

  return (
    <div className={clsx('relative shrink-0', config.full, className)}>
      <Image
        src="/logo.svg"
        alt="RecordBridge"
        width={280}
        height={92}
        sizes={config.fullSizeHint}
        className="h-auto w-full"
        priority
      />
    </div>
  );
}
