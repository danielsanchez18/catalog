import { useMemo, useState } from 'react';
import { SearchX, UsersRound } from 'lucide-react';
import Search from '@/components/dashboard/Search';
import Paginator from '@/components/dashboard/Paginator';
import TeamCard, { TeamTableRow } from '@/components/dashboard/team/TeamCard';
import EmptyState from '@/components/dashboard/EmptyState';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { TeamMember } from '@/lib/types';

interface Props {
  members: TeamMember[];
  emptyTitle?: string;
  emptyDescription?: string;
}

const PAGE_SIZE = 10;

export default function TeamTable({
  members,
  emptyTitle = 'No hay miembros todavía',
  emptyDescription = 'Agrega tu primer miembro del equipo para darle acceso al catálogo.',
}: Props) {
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return members;
    return members.filter(
      (m) =>
        (m.full_name ?? '').toLowerCase().includes(q) || m.email.toLowerCase().includes(q)
    );
  }, [members, query]);

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
          icon={hasQuery ? <SearchX className="size-5" /> : <UsersRound className="size-5" />}
          title={hasQuery ? 'Sin resultados' : emptyTitle}
          description={
            hasQuery
              ? `No se encontraron miembros para "${query.trim()}".`
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
                  <TableHead>Miembro</TableHead>
                  <TableHead>Correo</TableHead>
                  <TableHead>Rol</TableHead>
                  <TableHead>Se unió</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {visible.map((member) => (
                  <TeamTableRow key={member.id} member={member} />
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Mobile: cards */}
          <div className="md:hidden flex flex-col gap-y-3">
            {visible.map((member) => (
              <TeamCard key={member.id} member={member} />
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