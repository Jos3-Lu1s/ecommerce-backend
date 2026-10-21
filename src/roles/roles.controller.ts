import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRolDto } from './dto/create-rol.dto';
import { HasRoles } from '../auth/jwt/has-roles';
import { JwtRole } from '../auth/jwt/jwt-role';
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard';
import { JwtRolesGuard } from '../auth/jwt/jwt-roles.guard';

// Prefijo de ruta base: http://localhost:3000/roles
@Controller('roles')
export class RolesController {
  constructor(private rolesService: RolesService) {}

  // POST http://localhost:3000/roles
  // Crea un rol. Público: los guards están desactivados.
  // @HasRoles(JwtRole.CLIENT)
  // @UseGuards(JwtAuthGuard, JwtRolesGuard)
  @Post()
  create(@Body() rol: CreateRolDto) {
    return this.rolesService.create(rol);
  }
}
