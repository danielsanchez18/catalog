import { Button } from '@/components/ui/button';
import { ShoppingBag } from 'lucide-react';
import type { Product } from '@/lib/types';
import { formatPrice } from '@/lib/format';

interface Props {
  product: Product;
}

export default function ProductCard({ product }: Props) {
  return (
    <div className="border border-border rounded-lg p-3 flex flex-col group hover:bg-accent transition text-start">
      <a href={`/producto/${product.id}`} className="flex flex-col">
        <div className="relative overflow-hidden rounded-md bg-accent h-50">
          {product.imagen_url ? (
            <img
              src={product.imagen_url}
              alt={product.nombre}
              className="absolute top-0 left-0 w-full h-full object-cover z-10 group-hover:scale-105 transition duration-300"
            />
          ) : null}
          <p className="absolute top-3 left-3 rounded-full w-fit bg-white px-3 py-1 text-xs font-mono font-medium z-20">
            {product.etiqueta === 'promocion' ? 'Promoción' : product.etiqueta === 'nuevo' ? 'Nuevo' : 'Publicado'}
          </p>
        </div>

        <div className="flex flex-col gap-y-1 px-1 py-2 mt-2">
          <h3 className="font-medium line-clamp-2 font-sans">{product.nombre}</h3>
          <p className="text-sm line-clamp-2 text-neutral-800">{product.descripcion_corta}</p>
          <p className="text-sm font-mono font-medium mt-2">{formatPrice(product.precio)}</p>
        </div>
      </a>

      <div className="flex items-center gap-x-1 mt-3">
        <Button className="px-3 py-2 h-fit rounded-full w-full">
          <ShoppingBag className="size-4" />
          <span className="text-sm">Agregar al carrito</span>
        </Button>
      </div>
    </div>
  );
}