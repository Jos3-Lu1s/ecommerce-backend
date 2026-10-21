import { IsNotEmpty, IsString } from 'class-validator';

// Datos para crear un rol.
export class CreateRolDto {
  // Identificador del rol (ej. 'CLIENT', 'ADMIN'). Es la clave primaria.
  @IsNotEmpty()
  @IsString()
  id!: string;

  // Nombre visible del rol. Debe ser único.
  @IsNotEmpty()
  @IsString()
  name!: string;

  // URL de la imagen del rol.
  @IsNotEmpty()
  @IsString()
  image!: string;

  // Ruta de la app cliente a la que se dirige al usuario con este rol.
  @IsNotEmpty()
  @IsString()
  route!: string;
}
