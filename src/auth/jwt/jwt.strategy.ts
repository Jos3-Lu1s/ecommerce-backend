import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { jwtConstants } from './jwt.constants';

// Estrategia Passport 'jwt': define cómo se lee y verifica el token en cada petición protegida.
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      // Lee el token de la cabecera "Authorization: Bearer <token>".
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      // Rechaza los tokens expirados.
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
    });
  }

  // Se ejecuta con el payload ya verificado. Lo que retorna queda disponible en request.user.
  // Los campos deben coincidir con el payload que firma AuthService (id, name, roles).
  async validate(payload: any) {
    return {
      userId: payload.id,
      username: payload.name,
      roles: payload.roles,
    };
  }
}
