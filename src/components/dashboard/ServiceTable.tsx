import { useEffect, useMemo, useState } from 'react';
import { CalendarClock, SearchX } from 'lucide-react';
import Search from '@/components/dashboard/Search';
import Paginator from '@/components/dashboard/Paginator';
import ServiceCard, { ServiceTableRow } from '@/components/dashboard/service/ServiceCard';
import EmptyState from '@/components/dashboard/EmptyState';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { Service } from '@/lib/types';

interface Props {
  services?: Service[];
  emptyTitle?: string;
  emptyDescription?: string;
}

const PAGE_SIZE = 10;

export default function ServiceTable({
  services,
  emptyTitle = 'No hay servicios todavía',
  emptyDescription = 'Agrega tu primer servicio para empezar a construir tu catálogo.',
}: Props) {
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [loaded, setLoaded] = useState<Service[] | undefined>(services);

  useEffect(() => {
    if (services !== undefined) return;
    let active = true;

    fetch('/api/servicios')
      .then((res) => {
        if (!res.ok) throw new Error('error');
        return res.json();
      })
      .then((data) => {
        if (active) setLoaded(data as Service[]);
      })
      .catch(() => {
        if (active) setLoaded([]);
      });

    return () => {
      active = false;
    };
  }, [services]);

  const list = loaded;
  const loading = list === undefined;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return list ?? [];
    return (list ?? []).filter(
      (s) =>
        s.nombre.toLowerCase().includes(q) ||
        s.descripcion_corta.toLowerCase().includes(q) ||
        s.descripcion_larga.toLowerCase().includes(q)
    );
  }, [list, query]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const visible = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const hasQuery = query.trim().length > 0;

  const handleQueryChange = (value: string) => {
    setQuery(value);
    setPage(1);
  };

  return (
    <section className="sm:p-5 sm:rounded-xl sm:border border-border space-y-5">
      <Search value={query} onChange={handleQueryChange} />

      {loading ? (
        <div className="space-y-5">
          <div className="hidden md:block">
            <div className="divide-y">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-x-4 py-3.5">
                  <Skeleton className="size-12 rounded-lg" />
                  <div className="min-w-0 flex-1 space-y-2">
                    <Skeleton className="h-4 w-2/3" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                  <div className="w-24 shrink-0 space-y-2">
                    <Skeleton className="h-4 w-20 ml-auto" />
                    <Skeleton className="h-3 w-14 ml-auto" />
                  </div>
                  <div className="w-32 shrink-0 space-y-2">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-3 w-10" />
                  </div>
                  <div className="w-32 shrink-0 space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                  <Skeleton className="size-8 rounded-full shrink-0" />
                </div>
              ))}
            </div>
          </div>
          <div className="md:hidden flex flex-col gap-y-3">
            {[0, 1, 2].map((i) => (
              <div key={i} className="border border-border rounded-xl p-4 space-y-3">
                <div className="flex items-center gap-x-3">
                  <Skeleton className="size-12 rounded-lg" />
                  <div className="min-w-0 flex-1 space-y-2">
                    <Skeleton className="h-4 w-2/3" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                  <Skeleton className="h-5 w-16 rounded-full" />
                </div>
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-3/4" />
                <div className="flex items-center justify-between pt-1">
                  <Skeleton className="h-5 w-20" />
                  <div className="flex items-center gap-x-1">
                    <Skeleton className="size-8 rounded-full" />
                    <Skeleton className="size-8 rounded-full" />
                    <Skeleton className="size-8 rounded-full" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={hasQuery ? <SearchX className="size-5" /> : <CalendarClock className="size-5" />}
          title={hasQuery ? 'Sin resultados' : emptyTitle}
          description={
            hasQuery
              ? `No se encontraron servicios para "${query.trim()}".`
              : emptyDescription
          }
          action={
            hasQuery ? (
              <Button variant="outline" className="rounded-full" onClick={() => handleQueryChange('')}>
                Limpiar búsqueda
              </Button>
            ) : undefined
          }
        />
      ) : (
        <>
          {/* Desktop: tabla */}
          <div className="hidden md:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Servicio</TableHead>
                  <TableHead>Desde</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Registrado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {visible.map((service) => (
                  <ServiceTableRow key={service.id} service={service} />
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Mobile: cards */}
          <div className="md:hidden flex flex-col gap-y-3">
            {visible.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        </>
      )}

      {filtered.length > 0 ? (
        <Paginator
          page={safePage}
          totalPages={totalPages}
          totalResults={filtered.length}
          onPageChange={setPage}
        />
      ) : null}
    </section>
  );
}