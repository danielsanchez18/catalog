import { useEffect, useState } from 'react';
import ProductCard from '@/components/ProductCard';
import { Skeleton } from '@/components/ui/skeleton';
import type { Product } from '@/lib/types';

interface Props {
  products?: Product[];
}

export default function ProductGrid({ products }: Props) {
  const [list, setList] = useState<Product[] | undefined>(products);

  useEffect(() => {
    if (products !== undefined) return;
    let active = true;

    fetch('/api/publico/productos')
      .then((res) => {
        if (!res.ok) throw new Error('error');
        return res.json();
      })
      .then((data) => {
        if (active) setList(data as Product[]);
      })
      .catch(() => {
        if (active) setList([]);
      });

    return () => {
      active = false;
    };
  }, [products]);

  const loading = list === undefined;

  if (loading) {
    return (
      <section className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="border border-border rounded-lg p-3 space-y-3">
            <Skeleton className="h-50 rounded-md" />
            <div className="space-y-2 px-1">
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-1/2" />
            </div>
            <Skeleton className="h-9 rounded-full" />
          </div>
        ))}
      </section>
    );
  }

  if (list.length === 0) {
    return (
      <p className="text-sm text-muted-foreground text-center py-10">
        Aún no hay productos publicados.
      </p>
    );
  }

  return (
    <section className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {list.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </section>
  );
}