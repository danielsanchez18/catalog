import type { Service } from './types';

const PLACEHOLDER_IMG = 'https://imgs.search.brave.com/umpJJGak63p3PNlV2NUkY1GEv8ksldCrlc4-LBTLpMg/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWFn/ZXMuc3F1YXJlc3Bh/Y2UtY2RuLmNvbS9j/b250ZW50L3YxLzYw/NTRkMjY0MDU0ZGYw/NWY0YWJmNWJhZC8x/ODVhNzUxYy0yMDFj/LTRkODAtODYyOC03/MjcyOGQyODcwNjgv/cXVpbmNlYW5lcmFz/LWdhbGxlcnktMS5q/cGc';

export const mockServices: Service[] = [
  {
    id: '1',
    nombre: 'Eventos Corporativos',
    descripcion: 'Organización integral de eventos empresariales. Desde reuniones ejecutivas hasta lanzamientos de producto, con atención al detalle en cada aspecto.',
    precio_minimo: 5000.00,
    estado: 'publicado',
    imagen_url: PLACEHOLDER_IMG,
    created_at: '2026-08-01T10:00:00Z',
    updated_at: '2026-08-01T10:00:00Z',
  },
  {
    id: '2',
    nombre: 'Bodas y Quinceañeros',
    descripcion: 'Diseño y coordinación de celebraciones especiales. Temáticas personalizadas, decoración floral y logística completa para días inolvidables.',
    precio_minimo: 15000.00,
    estado: 'publicado',
    imagen_url: PLACEHOLDER_IMG,
    created_at: '2026-08-02T10:00:00Z',
    updated_at: '2026-08-02T10:00:00Z',
  },
  {
    id: '3',
    nombre: 'Arreglos Florales',
    descripcion: 'Creación de arreglos para toda ocasión: centros de mesa, ramos, decoración de espacios. Flores frescas y diseños únicos.',
    precio_minimo: 800.00,
    estado: 'publicado',
    imagen_url: PLACEHOLDER_IMG,
    created_at: '2026-08-03T10:00:00Z',
    updated_at: '2026-08-03T10:00:00Z',
  },
  {
    id: '4',
    nombre: 'Repostería Personalizada',
    descripcion: 'Pasteles y postres diseñados a medida. Sabores artesanales, decoración temática y opciones para alérgicos.',
    precio_minimo: 1200.00,
    estado: 'publicado',
    imagen_url: PLACEHOLDER_IMG,
    created_at: '2026-08-04T10:00:00Z',
    updated_at: '2026-08-04T10:00:00Z',
  },
  {
    id: '5',
    nombre: 'Decoración de Interiores',
    descripcion: 'Asesoría y montaje de decoración para eventos y espacios. Ambientación, iluminación y mobiliario temático.',
    precio_minimo: 3000.00,
    estado: 'publicado',
    imagen_url: PLACEHOLDER_IMG,
    created_at: '2026-08-05T10:00:00Z',
    updated_at: '2026-08-05T10:00:00Z',
  },
  {
    id: '6',
    nombre: 'Catering Gourmet',
    descripcion: 'Servicio de comida para eventos con menús personalizados. Cocina de autor, presentación elegante y servicio profesional.',
    precio_minimo: 8000.00,
    estado: 'publicado',
    imagen_url: PLACEHOLDER_IMG,
    created_at: '2026-08-06T10:00:00Z',
    updated_at: '2026-08-06T10:00:00Z',
  },
];

export function getServiceById(id: string): Service | undefined {
  return mockServices.find((s) => s.id === id);
}

export function getPublishedServices(): Service[] {
  return mockServices.filter((s) => s.estado === 'publicado');
}
