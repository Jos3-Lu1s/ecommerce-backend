import { IsString, IsEmail, IsNotEmpty } from 'class-validator';

// Credenciales para iniciar sesión.
export class LoginAuthDto {
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email!: string;

  @IsNotEmpty()
  @IsString()
  password!: string;
}
