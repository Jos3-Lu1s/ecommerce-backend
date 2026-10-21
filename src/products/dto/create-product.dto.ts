// Datos para crear un producto. Las imágenes se envían aparte como archivos (campo 'files[]').
export class CreateProductDto {
  name!: string;
  description!: string;
  price!: number;
  // ID de la categoría a la que pertenece el producto.
  id_category!: number;
}
