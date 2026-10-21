import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Rol } from './entities/rol.entity';
import { Repository } from 'typeorm';
import { CreateRolDto } from './dto/create-rol.dto';

// Lógica de negocio de los roles (tabla 'roles').
@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Rol) private rolesRepository: Repository<Rol>,
  ) {}

  // Crea y guarda un nuevo rol.
  create(rol: CreateRolDto) {
    const newRol = this.rolesRepository.create(rol);
    return this.rolesRepository.save(newRol);
  }
}
