import { useEffect, useState } from 'react';
import { Package, CheckCircle2, FileText } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import type { DashboardStats } from '@/lib/db/dashboard';

const cards = [
  { label: 'Productos totales', value: 'totalProductos', icon: Package },
  { label: 'Publicados', value: 'publicados', icon: CheckCircle2 },
  { label: 'En borrador', value: 'borradores', icon: FileText },
] as const;

export default function StatsCards() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let active = true;

    fetch('/api/dashboard')
      .then((res) => {
        if (!res.ok) throw new Error('error');
        return res.json();
      })
      .then((data) => {
        if (active) setStats(data.stats);
      })
      .catch(() => {
        if (active) setError(true);
      });

    return () => {
      active = false;
    };
  }, []);

  if (error) {
    return null;
  }

  if (!stats) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="flex items-center justify-between gap-x-4 rounded-xl border border-border p-5"
          >
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-7 w-12" />
            </div>
            <Skeleton className="size-5" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {cards.map((card) => (
        <div
          key={card.value}
          className="flex items-center justify-between gap-x-4 rounded-xl border border-border p-5"
        >
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">{card.label}</p>
            <p className="text-2xl font-mono font-medium">{stats[card.value]}</p>
          </div>
          <card.icon className="size-5 text-muted-foreground" />
        </div>
      ))}
    </div>
  );
}