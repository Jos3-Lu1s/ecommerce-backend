// Datos para crear un usuario directamente (POST /users), sin validaciones ni asignación de roles.
// Para el registro normal se usa RegisterAuthDto (POST /auth/register).
export class CreateUserDto {
  name!: string;
  lastname!: string;
  email!: string;
  phone!: string;
  // Se cifra con bcrypt antes de insertarse (hook @BeforeInsert de User).
  password!: string;
  // URL de la foto de perfil.
  image?: string;
  // Token del dispositivo para notificaciones push.
  notification_token?: string;
}
