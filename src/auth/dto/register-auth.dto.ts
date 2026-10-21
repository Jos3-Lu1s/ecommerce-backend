import { IsString, IsEmail, IsNotEmpty, MinLength } from 'class-validator';

// Datos para registrar un usuario.
export class RegisterAuthDto {
  @IsNotEmpty()
  @IsString()
  name!: string;

  @IsNotEmpty()
  @IsString()
  lastname!: string;

  // Debe ser único en la BD.
  @IsNotEmpty()
  @IsString()
  @IsEmail({}, { message: 'El email no es valido' })
  email!: string;

  // Debe ser único en la BD.
  @IsNotEmpty()
  @IsString()
  phone!: string;

  // Mínimo 6 caracteres. Se guarda cifrada con bcrypt.
  @IsNotEmpty()
  @IsString()
  @MinLength(6, { message: 'La contraseña debe tener minimo 6 caracteres' })
  password!: string;

  // IDs de roles a asignar (ej. ['CLIENT', 'ADMIN']). Si se omite, se asigna 'CLIENT'.
  rolesIds!: string[];
}
