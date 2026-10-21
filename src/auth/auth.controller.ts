import { Body, Controller, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';

// Prefijo de ruta base: http://localhost:3000/auth
// Endpoints públicos de registro e inicio de sesión. Ambos devuelven el usuario y un token JWT.
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // POST http://localhost:3000/auth/register
  // Registra un usuario nuevo.
  @Post('register')
  register(@Body() user: RegisterAuthDto) {
    return this.authService.register(user);
  }

  // POST http://localhost:3000/auth/login
  // Inicia sesión con email y contraseña.
  @Post('login')
  login(@Body() loginData: LoginAuthDto) {
    return this.authService.login(loginData);
  }
}
