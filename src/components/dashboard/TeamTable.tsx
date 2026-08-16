import { useEffect, useMemo, useState } from 'react';
import { SearchX, UsersRound } from 'lucide-react';
import Search from '@/components/dashboard/Search';
import Paginator from '@/components/dashboard/Paginator';
import TeamCard, { TeamTableRow } from '@/components/dashboard/team/TeamCard';
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
import type { TeamMember } from '@/lib/types';

interface Props {
  members?: TeamMember[];
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
  const [loaded, setLoaded] = useState<TeamMember[] | undefined>(members);

  const fetchMembers = () => {
    fetch('/api/team')
      .then((res) => {
        if (!res.ok) throw new Error('error');
        return res.json();
      })
      .then((data) => {
        setLoaded(data as TeamMember[]);
      })
      .catch(() => {
        setLoaded([]);
      });
  };

  useEffect(() => {
    if (members !== undefined) return;
    let active = true;

    fetch('/api/team')
      .then((res) => {
        if (!res.ok) throw new Error('error');
        return res.json();
      })
      .then((data) => {
        if (active) setLoaded(data as TeamMember[]);
      })
      .catch(() => {
        if (active) setLoaded([]);
      });

    return () => {
      active = false;
    };
  }, [members]);

  useEffect(() => {
    window.addEventListener('team:changed', fetchMembers);
    return () => {
      window.removeEventListener('team:changed', fetchMembers);
    };
  }, []);

  const list = loaded;
  const loading = list === undefined;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return list ?? [];
    return (list ?? []).filter(
      (m) =>
        (m.full_name ?? '').toLowerCase().includes(q) || m.email.toLowerCase().includes(q)
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
                  <Skeleton className="size-10 rounded-full" />
                  <div className="min-w-0 flex-1 space-y-2">
                    <Skeleton className="h-4 w-2/3" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                  <div className="w-32 shrink-0 space-y-2">
                    <Skeleton className="h-4 w-24 ml-auto" />
                  </div>
                  <div className="w-32 shrink-0 space-y-2">
                    <Skeleton className="h-4 w-20" />
                  </div>
                  <div className="w-32 shrink-0 space-y-2">
                    <Skeleton className="h-4 w-24" />
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
                  <Skeleton className="size-10 rounded-full" />
                  <div className="min-w-0 flex-1 space-y-2">
                    <Skeleton className="h-4 w-2/3" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                  <Skeleton className="h-5 w-16 rounded-full" />
                </div>
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