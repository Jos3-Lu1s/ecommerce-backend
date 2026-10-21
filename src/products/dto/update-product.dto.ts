// Datos para actualizar un producto. Todos son opcionales: solo se modifican los enviados.
export class UpdateProductDto {
  name?: string;
  description?: string;
  price?: number;
  id_category?: number;
  // URLs de las imágenes. Las asigna el servicio tras subir los archivos.
  image1?: string;
  image2?: string;
  // Posición que ocupa cada archivo enviado: 0 = image1, 1 = image2.
  // Ej.: [1] reemplaza solo image2; [0, 1] reemplaza ambas en ese orden.
  images_to_update?: Array<number>;
}
