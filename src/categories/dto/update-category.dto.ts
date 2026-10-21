
// Datos para actualizar una categoría. Todos son opcionales: solo se modifican los enviados.
export class UpdateCategoryDto {
  name?: string;
  description?: string;
  // URL de la imagen. La asigna el servicio en updateWithImage.
  image?: string;
}
