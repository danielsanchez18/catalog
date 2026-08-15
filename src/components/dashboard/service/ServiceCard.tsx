import { Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TableCell, TableRow } from '@/components/ui/table';
import type { Service } from '@/lib/types';
import { cn } from '@/lib/utils';

const formatPrice = (price: number) =>
  price.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' });

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString('es-MX', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

const StatusBadge = ({ service }: { service: Service }) => {
  const published = service.estado === 'publicado';
  const deleted = service.estado === 'eliminado';
  return (
    <span
      className={cn(
        'w-fit rounded-full px-2 py-1 text-xs font-medium',
        published ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'
      )}
    >
      {published ? 'Publicado' : deleted ? 'Eliminado' : 'Borrador'}
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

export function ServiceTableRow({ service }: { service: Service }) {
  return (
    <TableRow>
      <TableCell>
        <div className="flex items-center gap-x-3 min-w-0">
          <div className="rounded-lg w-12 h-12 min-w-12 bg-accent overflow-hidden shrink-0">
            {service.imagen_url ? (
              <img
                src={service.imagen_url}
                alt={service.nombre}
                className="h-12 w-12 rounded-md object-cover"
              />
            ) : null}
          </div>
          <div className="flex flex-col min-w-0">
            <a
              href={`/dashboard/servicios/${service.id}`}
              className="text-sm font-medium truncate hover:underline"
            >
              {service.nombre}
            </a>
            <p className="text-sm text-muted-foreground truncate max-w-72">
              {service.descripcion_corta}
            </p>
          </div>
        </div>
      </TableCell>
      <TableCell>
        <p className="text-sm font-mono whitespace-nowrap">
          {formatPrice(service.precio_minimo)}
        </p>
      </TableCell>
      <TableCell>
        <StatusBadge service={service} />
      </TableCell>
      <TableCell>
        <p className="text-sm text-muted-foreground whitespace-nowrap">
          {formatDate(service.created_at)}
        </p>
      </TableCell>
      <TableCell className="text-right">
        <Actions />
      </TableCell>
    </TableRow>
  );
}

export default function ServiceCard({ service }: { service: Service }) {
  return (
    <div className="border border-border rounded-xl p-4 space-y-3">
      <div className="flex items-start justify-between gap-x-3">
        <div className="flex items-center gap-x-3 min-w-0">
          <div className="rounded-lg w-12 h-12 min-w-12 bg-accent overflow-hidden shrink-0">
            {service.imagen_url ? (
              <img
                src={service.imagen_url}
                alt={service.nombre}
                className="h-12 w-12 rounded-md object-cover"
              />
            ) : null}
          </div>
          <div className="flex flex-col min-w-0">
            <a
              href={`/dashboard/servicios/${service.id}`}
              className="text-sm font-medium hover:underline"
            >
              {service.nombre}
            </a>
            <p className="text-sm text-muted-foreground">{formatDate(service.created_at)}</p>
          </div>
        </div>
        <StatusBadge service={service} />
      </div>

      <p className="text-sm text-muted-foreground line-clamp-2">{service.descripcion_corta}</p>

      <div className="flex items-center justify-between">
        <p className="text-lg font-mono font-medium">{formatPrice(service.precio_minimo)}</p>
        <Actions />
      </div>
    </div>
  );
}