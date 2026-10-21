import { Controller, UseGuards, Put, UseInterceptors, UploadedFile, ParseFilePipe, MaxFileSizeValidator, FileTypeValidator, Param, Body, ParseIntPipe, Post, Get, Delete } from '@nestjs/common';
import { HasRoles } from '../auth/jwt/has-roles';
import { JwtRole } from '../auth/jwt/jwt-role';
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard';
import { JwtRolesGuard } from '../auth/jwt/jwt-roles.guard';
import { AddressService } from './address.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';

// Prefijo de ruta base: http://localhost:3000/address
// Gestiona las direcciones de entrega de los usuarios.
@Controller('address')
export class AddressController {

  constructor(private addressService: AddressService) { }

  // POST http://localhost:3000/address
  // Crea una dirección. Público: los guards están desactivados.
  // @HasRoles(JwtRole.ADMIN, JwtRole.CLIENT)
  // @UseGuards(JwtAuthGuard, JwtRolesGuard)
  @Post()
  create(@Body() address: CreateAddressDto) {
    return this.addressService.create(address);
  }

  // GET http://localhost:3000/address
  // Lista todas las direcciones. Público: los guards están desactivados.
  // @HasRoles(JwtRole.ADMIN, JwtRole.CLIENT)
  // @UseGuards(JwtAuthGuard, JwtRolesGuard)
  @Get()
  findAll() {
    return this.addressService.findAll();
  }

  // GET http://localhost:3000/address/user/:id_user
  // Lista las direcciones de un usuario. Requiere token con rol ADMIN o CLIENT.
  @HasRoles(JwtRole.ADMIN, JwtRole.CLIENT)
  @UseGuards(JwtAuthGuard, JwtRolesGuard)
  @Get('user/:id_user')
  findByUser(@Param('id_user', ParseIntPipe) id_user: number) {
    return this.addressService.findByUser(id_user);
  }

  // PUT http://localhost:3000/address/:id
  // Actualiza una dirección por su ID. Requiere token con rol ADMIN o CLIENT.
  @HasRoles(JwtRole.ADMIN, JwtRole.CLIENT)
  @UseGuards(JwtAuthGuard, JwtRolesGuard)
  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() address: UpdateAddressDto) {
    return this.addressService.update(id, address);
  }

  // DELETE http://localhost:3000/address/:id
  // Elimina una dirección por su ID. Requiere token con rol ADMIN o CLIENT.
  @HasRoles(JwtRole.ADMIN, JwtRole.CLIENT)
  @UseGuards(JwtAuthGuard, JwtRolesGuard)
  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.addressService.delete(id);
  }

}
