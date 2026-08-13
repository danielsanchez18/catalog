import { useMemo, useState } from 'react';
import { PackageSearch, SearchX } from 'lucide-react';
import Search from '@/components/dashboard/Search';
import Paginator from '@/components/dashboard/Paginator';
import ProductCard, { ProductTableRow } from '@/components/dashboard/product/ProductCard';
import EmptyState from '@/components/dashboard/EmptyState';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { Product } from '@/lib/types';

interface Props {
  products: Product[];
  emptyTitle?: string;
  emptyDescription?: string;
}

const PAGE_SIZE = 10;

export default function ProductTable({
  products,
  emptyTitle = 'No hay productos todavía',
  emptyDescription = 'Agrega tu primer producto para empezar a construir tu catálogo.',
}: Props) {
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return products;
    return products.filter(
      (p) =>
        p.nombre.toLowerCase().includes(q) ||
        p.descripcion_corta.toLowerCase().includes(q) ||
        p.descripcion_larga.toLowerCase().includes(q)
    );
  }, [products, query]);

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
          icon={hasQuery ? <SearchX className="size-5" /> : <PackageSearch className="size-5" />}
          title={hasQuery ? 'Sin resultados' : emptyTitle}
          description={
            hasQuery
              ? `No se encontraron productos para "${query.trim()}".`
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
                  <TableHead>Producto</TableHead>
                  <TableHead>Precio</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Registrado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {visible.map((product) => (
                  <ProductTableRow key={product.id} product={product} />
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Mobile: cards */}
          <div className="md:hidden flex flex-col gap-y-3">
            {visible.map((product) => (
              <ProductCard key={product.id} product={product} />
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