import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

// Guard de autenticación: exige un token JWT válido en la cabecera Authorization ("Bearer <token>").
// Si el token falta, es inválido o expiró, responde 401. Usa la estrategia 'jwt' de JwtStrategy.
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
