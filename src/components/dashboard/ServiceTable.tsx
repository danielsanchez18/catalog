import { useMemo, useState } from 'react';
import { CalendarClock, SearchX } from 'lucide-react';
import Search from '@/components/dashboard/Search';
import Paginator from '@/components/dashboard/Paginator';
import ServiceCard, { ServiceTableRow } from '@/components/dashboard/service/ServiceCard';
import EmptyState from '@/components/dashboard/EmptyState';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { Service } from '@/lib/types';

interface Props {
  services: Service[];
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

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return services;
    return services.filter(
      (s) =>
        s.nombre.toLowerCase().includes(q) ||
        s.descripcion.toLowerCase().includes(q)
    );
  }, [services, query]);

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

      {filtered.length === 0 ? (
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