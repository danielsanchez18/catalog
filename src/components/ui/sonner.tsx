import { Toaster as Sonner, toast as sonnerToast, type ToasterProps } from 'sonner';
import { BadgeCheck, BadgeInfo, CircleX } from 'lucide-react';
import type { CSSProperties } from 'react';
import { cn } from '@/lib/utils';

const toastStyle = {
  '--normal-bg': 'var(--popover)',
  '--normal-text': 'var(--popover-foreground)',
  '--normal-border': 'var(--border)',
  '--success-bg': 'var(--popover)',
  '--success-text': 'var(--popover-foreground)',
  '--success-border': 'var(--border)',
  '--error-bg': 'var(--popover)',
  '--error-text': 'var(--popover-foreground)',
  '--error-border': 'var(--destructive)',
  '--info-bg': 'var(--popover)',
  '--info-text': 'var(--popover-foreground)',
  '--info-border': 'var(--border)',
} as CSSProperties;

const Toaster = ({ className, ...props }: ToasterProps) => (
  <Sonner
    className={cn('toaster group font-sans', className)}
    position="bottom-right"
    gap={8}
    toastOptions={{
      classNames: {
        toast:
          'group toast flex items-start! gap-x-3 rounded-xl border bg-popover p-4 font-sans text-popover-foreground shadow-lg',
        title: 'font-sans text-sm font-semibold',
        description: 'font-sans text-sm text-muted-foreground',
        icon: 'shrink-0 [&_svg]:size-4.5 mt-1',
        content: 'min-w-0 flex-1 space-y-1',
      },
    }}
    icons={{
      success: <BadgeCheck className="size-4 text-primary" />,
      error: <CircleX className="size-4 text-destructive" />,
      info: <BadgeInfo className="size-4 text-primary" />,
    }}
    style={toastStyle}
    {...props}
  />
);

export { Toaster, sonnerToast as toast };
