import { IsNotEmpty, IsString } from 'class-validator';

// Datos para actualizar un usuario. name, lastname y phone son obligatorios (@IsNotEmpty)
// aunque estén tipados como opcionales; image y notification_token son opcionales.
export class UpdateUserDto {
  @IsNotEmpty()
  @IsString()
  name?: String;

  @IsNotEmpty()
  @IsString()
  lastname?: String;

  @IsNotEmpty()
  @IsString()
  phone?: String;

  // URL de la foto de perfil.
  image?: String;
  // Token del dispositivo para notificaciones push.
  notification_token?: String;
}
