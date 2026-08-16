import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, PackageSearch, ShoppingBag, Tag } from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import type { Product } from '@/lib/types';
import { formatPrice } from '@/lib/format';

interface Props {
  id: string;
}

type State =
  | { status: 'loading' }
  | { status: 'not-found' }
  | { status: 'ready'; product: Product; related: Product[] };

export default function ProductDetail({ id }: Props) {
  const [state, setState] = useState<State>({ status: 'loading' });

  useEffect(() => {
    let active = true;

    setState({ status: 'loading' });

    Promise.all([
      fetch(`/api/publico/productos/${id}`),
      fetch('/api/publico/productos'),
    ])
      .then(([productRes, listRes]) =>
        Promise.all([
          productRes.ok ? productRes.json() : Promise.reject(new Error('not-found')),
          listRes.json(),
        ])
      )
      .then(([product, list]: [Product, Product[]]) => {
        if (!active) return;
        setState({
          status: 'ready',
          product,
          related: list.filter((p) => p.id !== product.id).slice(0, 3),
        });
      })
      .catch(() => {
        if (active) setState({ status: 'not-found' });
      });

    return () => {
      active = false;
    };
  }, [id]);

  if (state.status === 'loading') {
    return <ProductDetailSkeleton />;
  }

  if (state.status === 'not-found') {
    return (
      <div className="flex flex-col items-center justify-center gap-y-3 py-20 text-center">
        <PackageSearch className="size-10 text-muted-foreground" />
        <h1 className="text-xl font-medium">Producto no encontrado</h1>
        <p className="text-sm text-muted-foreground">
          El producto que buscas no existe o no está disponible.
        </p>
        <Button
          variant="outline"
          className="rounded-full"
          render={<a href="/productos" />}
        >
          Volver al catálogo
        </Button>
      </div>
    );
  }

  const { product, related } = state;

  return (
    <div className="flex flex-col gap-y-5">
      <Button
        variant="link"
        className="w-fit p-0"
        render={<a href="/productos" />}
      >
        <ArrowLeft className="size-4" />
        Volver al catálogo
      </Button>

      <article className="grid sm:grid-cols-2 gap-8">
        <div className="relative overflow-hidden rounded-lg bg-accent h-80 sm:h-full min-h-64">
          {product.imagen_url ? (
            <img
              src={product.imagen_url}
              alt={product.nombre}
              className="absolute inset-0 w-full h-full object-cover"
            />
          ) : null}
          <p className="absolute top-3 left-3 rounded-full w-fit bg-white px-3 py-1 text-xs font-mono font-medium z-10">
            <Tag className="inline size-3 mr-1" />
            {product.etiqueta === 'promocion' ? 'Promoción' : product.etiqueta === 'nuevo' ? 'Nuevo' : 'Publicado'}
          </p>
        </div>

        <div className="flex flex-col gap-y-4 py-2">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Detalle del producto</p>
            <h1 className="text-3xl tracking-tighter font-medium">{product.nombre}</h1>
          </div>

          <p className="text-sm leading-relaxed text-neutral-800">
            {product.descripcion_larga}
          </p>

          <div className="border-t border-border pt-4">
            <p className="text-2xl font-mono font-medium">{formatPrice(product.precio)}</p>
          </div>

          <div className="flex items-center gap-x-1">
            <Button className="rounded-full w-fit px-4 py-1.75 h-fit mt-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
                <path d="M0 0h24v24H0z" fill="none" />
                <path fill="currentColor" d="M19.05 4.91A9.82 9.82 0 0 0 12.04 2c-5.46 0-9.91 4.45-9.91 9.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21c5.46 0 9.91-4.45 9.91-9.91c0-2.65-1.03-5.14-2.9-7.01m-7.01 15.24c-1.48 0-2.93-.4-4.2-1.15l-.3-.18l-3.12.82l.83-3.04l-.2-.31a8.26 8.26 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24c2.2 0 4.27.86 5.82 2.42a8.18 8.18 0 0 1 2.41 5.83c.02 4.54-3.68 8.23-8.22 8.23m4.52-6.16c-.25-.12-1.47-.72-1.69-.81c-.23-.08-.39-.12-.56.12c-.17.25-.64.81-.78.97c-.14.17-.29.19-.54.06c-.25-.12-1.05-.39-1.99-1.23c-.74-.66-1.23-1.47-1.38-1.72c-.14-.25-.02-.38.11-.51c.11-.11.25-.29.37-.43s.17-.25.25-.41c.08-.17.04-.31-.02-.43s-.56-1.34-.76-1.84c-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.43.06-.66.31c-.22.25-.86.85-.86 2.07s.89 2.4 1.01 2.56c.12.17 1.75 2.67 4.23 3.74c.59.26 1.05.41 1.41.52c.59.19 1.13.16 1.56.1c.48-.07 1.47-.6 1.67-1.18c.21-.58.21-1.07.14-1.18s-.22-.16-.47-.28" />
              </svg>
              Comprar
            </Button>

            <Button variant="outline" className="rounded-full w-fit px-4 py-1.75 h-fit mt-2">
              <ShoppingBag />
              Agregar
            </Button>
          </div>

          <p className="text-xs text-muted-foreground mt-auto">
            Publicado el{' '}
            {new Date(product.created_at).toLocaleDateString('es-MX', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>
      </article>

      {related.length > 0 ? (
        <section className="w-full space-y-10 border-t border-border pt-10">
          <div className="space-y-1">
            <p className="text-sm">También te puede interesar</p>
            <h2 className="text-2xl font-display uppercase font-medium">Productos relacionados</h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {related.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}

function ProductDetailSkeleton() {
  return (
    <div className="flex flex-col gap-y-5">
      <Skeleton className="h-4 w-40" />
      <article className="grid sm:grid-cols-2 gap-8">
        <Skeleton className="h-80 sm:h-full min-h-64 rounded-lg" />
        <div className="flex flex-col gap-y-4 py-2">
          <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-8 w-3/4" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
          <div className="border-t border-border pt-4">
            <Skeleton className="h-8 w-28" />
          </div>
          <div className="flex items-center gap-x-1 mt-2">
            <Skeleton className="h-9 w-28 rounded-full" />
            <Skeleton className="h-9 w-24 rounded-full" />
          </div>
        </div>
      </article>
    </div>
  );
}