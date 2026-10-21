import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtRole } from './jwt-role.js';

// Guard de autorización: permite el acceso solo si el usuario tiene al menos uno de los roles
// definidos con @HasRoles. Debe ejecutarse después de JwtAuthGuard, que coloca el usuario en la petición.
@Injectable()
export class JwtRolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Roles exigidos por @HasRoles en el método o, si no hay, en el controlador.
    const requiredRoles = this.reflector.getAllAndOverride<JwtRole[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);
    // Sin @HasRoles no se restringe por rol.
    if (!requiredRoles) {
      return true;
    }
    // request.user es el objeto devuelto por JwtStrategy.validate().
    const { user } = context.switchToHttp().getRequest();
    return requiredRoles.some((role) => user?.roles?.includes(role));
  }
}
