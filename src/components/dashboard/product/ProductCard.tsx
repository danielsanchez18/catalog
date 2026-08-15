import { Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TableCell, TableRow } from '@/components/ui/table';
import type { Product } from '@/lib/types';
import { cn } from '@/lib/utils';

const formatPrice = (price: number) =>
  price.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' });

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString('es-MX', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

const StatusBadge = ({ product }: { product: Product }) => {
  const published = product.estado === 'publicado';
  return (
    <span
      className={cn(
        'w-fit rounded-full px-2 py-1 text-xs font-medium',
        published ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'
      )}
    >
      {published ? 'Publicado' : 'Borrador'}
    </span>
  );
};

const Actions = () => (
  <div className="flex items-center justify-end gap-x-1">
    <Button variant="ghost" size="icon" title="Editar">
      <Pencil className="size-4" />
    </Button>
    <Button variant="ghost" size="icon" title="Eliminar">
      <Trash2 className="size-4" />
    </Button>
  </div>
);

export function ProductTableRow({ product }: { product: Product }) {
  return (
    <TableRow>
      <TableCell>
        <div className="flex items-center gap-x-3 min-w-0">
          <div className="rounded-lg w-12 h-12 min-w-12 bg-accent overflow-hidden shrink-0">
            {product.imagen_url ? (
              <img
                src={product.imagen_url}
                alt={product.nombre}
                className="h-12 w-12 rounded-md object-cover"
              />
            ) : null}
          </div>
          <div className="flex flex-col min-w-0">
            <a
              href={`/dashboard/productos/${product.id}`}
              className="text-sm font-medium truncate hover:underline"
            >
              {product.nombre}
            </a>
            <p className="text-sm text-muted-foreground truncate max-w-72">
              {product.descripcion_corta}
            </p>
          </div>
        </div>
      </TableCell>
      <TableCell>
        <p className="text-sm font-mono whitespace-nowrap">{formatPrice(product.precio)}</p>
      </TableCell>
      <TableCell>
        <StatusBadge product={product} />
      </TableCell>
      <TableCell>
        <p className="text-sm text-muted-foreground whitespace-nowrap">
          {formatDate(product.created_at)}
        </p>
      </TableCell>
      <TableCell className="text-right">
        <Actions />
      </TableCell>
    </TableRow>
  );
}

export default function ProductCard({ product }: { product: Product }) {
  return (
    <div className="border border-border rounded-xl p-4 space-y-3">
      <div className="flex items-start justify-between gap-x-3">
        <div className="flex items-center gap-x-3 min-w-0">
          <div className="rounded-lg w-12 h-12 min-w-12 bg-accent overflow-hidden shrink-0">
            {product.imagen_url ? (
              <img
                src={product.imagen_url}
                alt={product.nombre}
                className="h-12 w-12 rounded-md object-cover"
              />
            ) : null}
          </div>
          <div className="flex flex-col min-w-0">
            <a
              href={`/dashboard/productos/${product.id}`}
              className="text-sm font-medium hover:underline"
            >
              {product.nombre}
            </a>
            <p className="text-sm text-muted-foreground">{formatDate(product.created_at)}</p>
          </div>
        </div>
        <StatusBadge product={product} />
      </div>

      <p className="text-sm text-muted-foreground line-clamp-2">{product.descripcion_corta}</p>

      <div className="flex items-center justify-between">
        <p className="text-lg font-mono font-medium">{formatPrice(product.precio)}</p>
        <Actions />
      </div>
    </div>
  );
}