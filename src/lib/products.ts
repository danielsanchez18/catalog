import type { Product } from './types';

const PLACEHOLDER_IMG = 'https://imgs.search.brave.com/umpJJGak63p3PNlV2NUkY1GEv8ksldCrlc4-LBTLpMg/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWFn/ZXMuc3F1YXJlc3Bh/Y2UtY2RuLmNvbS9j/b250ZW50L3YxLzYw/NTRkMjY0MDU0ZGYw/NWY0YWJmNWJhZC8x/ODVhNzUxYy0yMDFj/LTRkODAtODYyOC03/MjcyOGQyODcwNjgv/cXVpbmNlYW5lcmFz/LWdhbGxlcnktMS5q/cGc';

export const mockProducts: Product[] = [
  {
    id: '1',
    nombre: 'Cuaderno Artesanal',
    descripcion: 'Cuaderno encuadernado a mano con papel de algodón. Ideal para escritura y bocetos. Cada hoja tiene una textura única que lo hace especial.',
    precio: 250.00,
    estado: 'publicado',
    imagen_url: PLACEHOLDER_IMG,
    created_at: '2026-08-01T10:00:00Z',
    updated_at: '2026-08-01T10:00:00Z',
  },
  {
    id: '2',
    nombre: 'Lápiz de Grafito HB',
    descripcion: 'Lápiz de grafito de alta calidad con madera de cedro. Marcas claras y consistentes para escritura y dibujo técnico.',
    precio: 45.00,
    estado: 'publicado',
    imagen_url: PLACEHOLDER_IMG,
    created_at: '2026-08-02T10:00:00Z',
    updated_at: '2026-08-02T10:00:00Z',
  },
  {
    id: '3',
    nombre: 'Bolígrafo Premium',
    descripcion: 'Bolígrafo de metal con acabado mate. Tinta de secado rápido y escritura suave. Perfecto para uso diario y firmas importantes.',
    precio: 180.00,
    estado: 'publicado',
    imagen_url: PLACEHOLDER_IMG,
    created_at: '2026-08-03T10:00:00Z',
    updated_at: '2026-08-03T10:00:00Z',
  },
  {
    id: '4',
    nombre: 'Set de Acuarelas',
    descripcion: 'Set de 12 acuarelas profesionales con alta concentración de pigmento. Colores vibrantes y mezclables para artistas de todos los niveles.',
    precio: 520.00,
    estado: 'publicado',
    imagen_url: PLACEHOLDER_IMG,
    created_at: '2026-08-04T10:00:00Z',
    updated_at: '2026-08-04T10:00:00Z',
  },
  {
    id: '5',
    nombre: 'Carpeta Organizadora',
    descripcion: 'Carpeta de piel sintética con 6 compartimentos. Diseño elegante para organizar documentos, facturas y papeles importantes.',
    precio: 350.00,
    estado: 'publicado',
    imagen_url: PLACEHOLDER_IMG,
    created_at: '2026-08-05T10:00:00Z',
    updated_at: '2026-08-05T10:00:00Z',
  },
  {
    id: '6',
    nombre: 'Marcadores Profesionales',
    descripcion: 'Set de 8 marcadores de doble punta con tinta indeleble. Colores intensos que no se borran. Ideales para ilustración y diseño.',
    precio: 290.00,
    estado: 'publicado',
    imagen_url: PLACEHOLDER_IMG,
    created_at: '2026-08-06T10:00:00Z',
    updated_at: '2026-08-06T10:00:00Z',
  },
];

export function getProductById(id: string): Product | undefined {
  return mockProducts.find((p) => p.id === id);
}

export function getPublishedProducts(): Product[] {
  return mockProducts.filter((p) => p.estado === 'publicado');
}
