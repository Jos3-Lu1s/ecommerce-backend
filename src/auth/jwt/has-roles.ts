import { SetMetadata } from '@nestjs/common';
import { JwtRole } from './jwt-role';

// Decorador @HasRoles(...): guarda en la metadata 'roles' los roles permitidos para un endpoint.
// JwtRolesGuard lee esa metadata para autorizar la petición.
export const HasRoles = (...roles: JwtRole[]) => SetMetadata('roles', roles);
