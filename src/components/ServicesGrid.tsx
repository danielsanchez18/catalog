import ServiceCard from '@/components/ServiceCard';
import type { Service } from '@/lib/types';

interface Props {
  services: Service[];
}

export default function ServicesGrid({ services }: Props) {
  return (
    <section className="grid sm:grid-cols-2 gap-3">
      {services.map((service) => (
        <ServiceCard key={service.id} service={service} />
      ))}
    </section>
  );
}