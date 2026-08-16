import type { ComponentProps, ReactNode } from 'react';
import {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
  EmptyContent,
  EmptyMedia,
} from '@/components/ui/empty';
import { cn } from '@/lib/utils';

export interface EmptyStateProps extends Omit<ComponentProps<typeof Empty>, 'title'> {
  icon?: ReactNode;
  mediaClassName?: string;
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
}

export default function EmptyState({
  icon,
  mediaClassName,
  title,
  description,
  action,
  className,
  ...props
}: EmptyStateProps) {
  return (
    <Empty className={className} {...props}>
      <EmptyHeader>
        {icon ? <EmptyMedia variant="icon" className={cn('size-10', mediaClassName)}>
          {icon}
        </EmptyMedia> : null}
        <EmptyTitle className="text-base">{title}</EmptyTitle>
      </EmptyHeader>
      <EmptyContent>
        {description ? <EmptyDescription>{description}</EmptyDescription> : null}
      </EmptyContent>
      {action ? <div>{action}</div> : null}
    </Empty>
  );
}