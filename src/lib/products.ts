import type { Product } from './types';

const PLACEHOLDER_IMG = 'https://imgs.search.brave.com/umpJJGak63p3PNlV2NUkY1GEv8ksldCrlc4-LBTLpMg/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWFn/ZXMuc3F1YXJlc3Bh/Y2UtY2RuLmNvbS9j/b250ZW50L3YxLzYw/NTRkMjY0MDU0ZGYw/NWY0YWJmNWJhZC8x/ODVhNzUxYy0yMDFj/LTRkODAtODYyOC03/MjcyOGQyODcwNjgv/cXVpbmNlYW5lcmFz/LWdhbGxlcnktMS5q/cGc';

export const mockProducts: Product[] = [
  {
    id: '1',
    nombre: 'Cuaderno Artesanal',
    descripcion_corta: 'Cuaderno encuadernado a mano con papel de algodón. Ideal para escritura y bocetos.',
    descripcion_larga: 'Cuaderno encuadernado a mano con papel de algodón. Ideal para escritura y bocetos. Cada hoja tiene una textura única que lo hace especial. Tamaño carta, 96 páginas y portada rígida en varios colores.',
    precio: 250.00,
    categoria: 'papeleria',
    estado: 'publicado',
    imagen_url: PLACEHOLDER_IMG,
    created_at: '2026-08-01T10:00:00Z',
    updated_at: '2026-08-01T10:00:00Z',
  },
  {
    id: '2',
    nombre: 'Lápiz de Grafito HB',
    descripcion_corta: 'Lápiz de grafito de alta calidad con madera de cedro. Marcas claras y consistentes.',
    descripcion_larga: 'Lápiz de grafito de alta calidad con madera de cedro. Marcas claras y consistentes para escritura y dibujo técnico. Mina graduada HB resistente a la rotura y con goma incluida.',
    precio: 45.00,
    categoria: 'papeleria',
    estado: 'publicado',
    imagen_url: PLACEHOLDER_IMG,
    created_at: '2026-08-02T10:00:00Z',
    updated_at: '2026-08-02T10:00:00Z',
  },
  {
    id: '3',
    nombre: 'Bolígrafo Premium',
    descripcion_corta: 'Bolígrafo de metal con acabado mate y tinta de secado rápido.',
    descripcion_larga: 'Bolígrafo de metal con acabado mate. Tinta de secado rápido y escritura suave. Perfecto para uso diario y firmas importantes. Recargable y con clip metálico.',
    precio: 180.00,
    categoria: 'papeleria',
    etiqueta: 'promocion',
    estado: 'publicado',
    imagen_url: PLACEHOLDER_IMG,
    created_at: '2026-08-03T10:00:00Z',
    updated_at: '2026-08-03T10:00:00Z',
  },
  {
    id: '4',
    nombre: 'Set de Acuarelas',
    descripcion_corta: 'Set de 12 acuarelas profesionales con alta concentración de pigmento.',
    descripcion_larga: 'Set de 12 acuarelas profesionales con alta concentración de pigmento. Colores vibrantes y mezclables para artistas de todos los niveles. Incluye pincel de agua y paleta de mezcla.',
    precio: 520.00,
    categoria: 'papeleria',
    etiqueta: 'nuevo',
    estado: 'publicado',
    imagen_url: PLACEHOLDER_IMG,
    created_at: '2026-08-04T10:00:00Z',
    updated_at: '2026-08-04T10:00:00Z',
  },
  {
    id: '5',
    nombre: 'Carpeta Organizadora',
    descripcion_corta: 'Carpeta de piel sintética con 6 compartimentos.',
    descripcion_larga: 'Carpeta de piel sintética con 6 compartimentos. Diseño elegante para organizar documentos, facturas y papeles importantes. Cierre elástico y tamaño A4.',
    precio: 350.00,
    categoria: 'papeleria',
    estado: 'publicado',
    imagen_url: PLACEHOLDER_IMG,
    created_at: '2026-08-05T10:00:00Z',
    updated_at: '2026-08-05T10:00:00Z',
  },
  {
    id: '6',
    nombre: 'Marcadores Profesionales',
    descripcion_corta: 'Set de 8 marcadores de doble punta con tinta indeleble.',
    descripcion_larga: 'Set de 8 marcadores de doble punta con tinta indeleble. Colores intensos que no se borran. Ideales para ilustración y diseño. Punta fina y punta pincel.',
    precio: 290.00,
    categoria: 'papeleria',
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

export function getProducts(): Product[] {
  return mockProducts;
}
