import Image from 'next/image';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'icon' | 'full';
  className?: string;
}

const sizes = {
  sm: { icon: 28, full: { width: 130, height: 32 } },
  md: { icon: 36, full: { width: 160, height: 38 } },
  lg: { icon: 56, full: { width: 220, height: 52 } },
};

export default function Logo({ size = 'md', variant = 'full', className = '' }: LogoProps) {
  const dim = sizes[size];

  if (variant === 'icon') {
    return (
      <Image
        src="/favicon.svg"
        alt="RecordBridge logo"
        width={dim.icon}
        height={dim.icon}
        className={className}
        priority
      />
    );
  }

  return (
    <Image
      src="/logo.svg"
      alt="RecordBridge"
      width={dim.full.width}
      height={dim.full.height}
      className={className}
      priority
    />
  );
}
