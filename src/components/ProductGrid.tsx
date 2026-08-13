import ProductCard from '@/components/ProductCard';
import type { Product } from '@/lib/types';

interface Props {
  products: Product[];
}

export default function ProductGrid({ products }: Props) {
  return (
    <section className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </section>
  );
}