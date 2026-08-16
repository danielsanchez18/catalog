import { useEffect, useState } from 'react';
import { PackageSearch } from 'lucide-react';
import { createElement } from 'react';
import EmptyState from '@/components/dashboard/EmptyState';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import type { Product } from '@/lib/types';
import { formatPrice } from '@/lib/format';

const estadoLabel = (estado: Product['estado']) =>
  estado === 'publicado'
    ? 'Publicado'
    : estado === 'eliminado'
      ? 'Eliminado'
      : 'Borrador';

export default function RecentProducts() {
  const [products, setProducts] = useState<Product[] | null>(null);

  useEffect(() => {
    let active = true;

    fetch('/api/dashboard')
      .then((res) => {
        if (!res.ok) throw new Error('error');
        return res.json();
      })
      .then((data) => {
        if (active) setProducts(data.recentProducts);
      })
      .catch(() => {
        if (active) setProducts([]);
      });

    return () => {
      active = false;
    };
  }, []);

  const loading = products === null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-x-5">
        <div className="space-y-1">
          <h2 className="text-base font-medium font-sans">Productos recientes</h2>
          <p className="text-sm text-muted-foreground">
            Los últimos productos que agregaste al catálogo.
          </p>
        </div>
        <Button
          variant="outline"
          className="rounded-full px-3 py-1.5 h-fit"
          render={createElement('a', { href: '/dashboard/productos' })}
        >
          Ver todos
        </Button>
      </div>

      {loading ? (
        <ul className="sm:rounded-xl sm:border border-border divide-y">
          {[0, 1, 2].map((i) => (
            <li key={i} className="flex items-center gap-x-4 px-4 py-3">
              <Skeleton className="size-10 rounded-lg" />
              <div className="min-w-0 flex-1 space-y-2">
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-3 w-1/2" />
              </div>
              <div className="shrink-0 space-y-2 text-right">
                <Skeleton className="h-4 w-16 ml-auto" />
                <Skeleton className="h-3 w-12 ml-auto" />
              </div>
            </li>
          ))}
        </ul>
      ) : products.length === 0 ? (
        <EmptyState
          icon={<PackageSearch className="size-5" />}
          title="Aún no hay productos"
          description="Agrega tu primer producto para empezar a construir tu catálogo."
          action={
            <Button
              className="rounded-full px-3 py-1.5 h-fit"
              render={createElement('a', { href: '/dashboard/productos/nuevo' })}
            >
              Agregar producto
            </Button>
          }
        />
      ) : (
        <ul className="sm:rounded-xl sm:border border-border divide-y">
          {products.map((product) => (
            <li key={product.id}>
              <a
                href={`/dashboard/productos/${product.id}`}
                className="flex items-center gap-x-4 px-4 py-3 transition-colors hover:bg-muted/40"
              >
                <div className="relative size-10 shrink-0 overflow-hidden rounded-lg bg-accent">
                  {product.imagen_url ? (
                    <img
                      src={product.imagen_url}
                      alt=""
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                  ) : null}
                </div>
                <div className="min-w-0 flex-1 space-y-0.5">
                  <p className="truncate text-sm font-medium">{product.nombre}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {product.descripcion_corta}
                  </p>
                </div>
                <div className="text-right shrink-0 space-y-0.5">
                  <p className="font-mono text-sm font-medium">{formatPrice(product.precio)}</p>
                  <p className="text-xs text-muted-foreground">{estadoLabel(product.estado)}</p>
                </div>
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}