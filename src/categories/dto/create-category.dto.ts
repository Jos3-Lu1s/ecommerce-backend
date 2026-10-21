import { IsNotEmpty, IsString } from "class-validator";
import { Column } from "typeorm";

// Datos para crear una categoría.
export class CreateCategoryDto {
  // Debe ser único en la BD.
  @IsNotEmpty()
  @IsString()
  name!: string;

  @IsNotEmpty()
  @IsString()
  description!: string;

  // URL de la imagen. No la envía el cliente: el servicio la asigna tras subir el archivo.
  // @Column no tiene efecto en un DTO; solo aplica en entidades.
  @Column({ nullable: true })
  image!: string;
}
