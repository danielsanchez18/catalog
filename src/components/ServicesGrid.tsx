import { useEffect, useState } from 'react';
import ServiceCard from '@/components/ServiceCard';
import { Skeleton } from '@/components/ui/skeleton';
import type { Service } from '@/lib/types';

interface Props {
  services?: Service[];
}

export default function ServicesGrid({ services }: Props) {
  const [list, setList] = useState<Service[] | undefined>(services);

  useEffect(() => {
    if (services !== undefined) return;
    let active = true;

    fetch('/api/publico/servicios')
      .then((res) => {
        if (!res.ok) throw new Error('error');
        return res.json();
      })
      .then((data) => {
        if (active) setList(data as Service[]);
      })
      .catch(() => {
        if (active) setList([]);
      });

    return () => {
      active = false;
    };
  }, [services]);

  const loading = list === undefined;

  if (loading) {
    return (
      <section className="grid sm:grid-cols-2 gap-3">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="border border-border rounded-lg p-3 space-y-3">
            <Skeleton className="h-60 min-h-60 rounded-md" />
            <div className="space-y-2 px-1">
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-3/4" />
            </div>
            <Skeleton className="h-9 rounded-full" />
          </div>
        ))}
      </section>
    );
  }

  if (list.length === 0) {
    return (
      <p className="text-sm text-muted-foreground text-center py-10">
        Aún no hay servicios publicados.
      </p>
    );
  }

  return (
    <section className="grid sm:grid-cols-2 gap-3">
      {list.map((service) => (
        <ServiceCard key={service.id} service={service} />
      ))}
    </section>
  );
}