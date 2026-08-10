export interface Product {
  id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  estado: 'borrador' | 'publicado';
  imagen_url?: string;
  created_at: string;
  updated_at: string;
}

export interface Service {
  id: string;
  nombre: string;
  descripcion: string;
  precio_minimo: number;
  estado: 'borrador' | 'publicado';
  imagen_url?: string;
  created_at: string;
  updated_at: string;
}
