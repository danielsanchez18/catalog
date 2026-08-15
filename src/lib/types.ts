export type ProductCategory = 'papeleria' | 'bisuteria' | 'cuidado_personal';

export type ProductTag = 'nuevo' | 'promocion';

export interface Product {
  id: string;
  nombre: string;
  descripcion_corta: string;
  descripcion_larga: string;
  precio: number;
  categoria: ProductCategory;
  etiqueta?: ProductTag;
  estado: 'borrador' | 'publicado' | 'eliminado';
  imagen_url?: string;
  created_at: string;
  updated_at: string;
}

export interface Service {
  id: string;
  nombre: string;
  descripcion_corta: string;
  descripcion_larga: string;
  precio_minimo: number;
  estado: 'borrador' | 'publicado' | 'eliminado';
  imagen_url?: string;
  created_at: string;
  updated_at: string;
}
