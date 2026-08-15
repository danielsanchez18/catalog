import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import type { Service } from '@/lib/types';

interface Props {
  service: Service;
}

export default function ServiceCard({ service }: Props) {
  return (
    <div className="border border-border rounded-lg p-3 group hover:bg-accent transition text-start flex flex-col">
      <div className="relative overflow-hidden rounded-md bg-accent h-60 min-h-60">
        <img
          src={service.imagen_url}
          alt={service.nombre}
          className="absolute top-0 left-0 w-full h-full z-10 group-hover:scale-105 transition duration-300"
        />
        <p className="absolute top-3 left-3 rounded-full w-fit bg-white px-3 py-1 text-xs font-mono font-medium z-20">
          Tag
        </p>
      </div>

      <div className="flex flex-col gap-y-1 px-1 py-2 mt-2 h-full">
        <h3 className="font-medium line-clamp-2 font-sans">{service.nombre}</h3>
        <p className="text-sm text-neutral-800 line-clamp-3 mb-2">{service.descripcion_corta}</p>
        <Button
          className="mt-auto rounded-full h-fit py-1.75 self-start w-full"
          render={<a href={`/servicio/${service.id}`} />}
        >
          Ver más
          <ArrowRight />
        </Button>
      </div>
    </div>
  );
}