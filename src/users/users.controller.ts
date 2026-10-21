import {
  Body,
  Controller,
  Post,
  Get,
  UseGuards,
  Put,
  Param,
  ParseIntPipe,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtRolesGuard } from '../auth/jwt/jwt-roles.guard';
import { HasRoles } from 'src/auth/jwt/has-roles';
import { JwtRole } from 'src/auth/jwt/jwt-role';
import { Multer } from 'multer';

// Prefijo de ruta base: http://localhost:3000/users
// Gestiona los usuarios. Convención REST: GET obtiene, POST crea, PUT/PATCH actualiza, DELETE borra.
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  // GET http://localhost:3000/users
  // Lista todos los usuarios con sus roles. Requiere token válido; al no tener @HasRoles, acepta cualquier rol.
  //  @HasRoles(JwtRole.CLIENT)
  @UseGuards(JwtAuthGuard, JwtRolesGuard)
  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  // POST http://localhost:3000/users
  // Crea un usuario sin asignarle roles. Público.
  @Post()
  create(@Body() user: CreateUserDto) {
    return this.usersService.create(user);
  }

  // PUT http://localhost:3000/users/:id
  // Actualiza los datos de un usuario. Requiere token con rol CLIENT.
  @HasRoles(JwtRole.CLIENT)
  @UseGuards(JwtAuthGuard, JwtRolesGuard)
  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() user: UpdateUserDto) {
    return this.usersService.update(id, user);
  }

  // Endpoint desactivado: PUT /users/upload/:id para actualizar el usuario con foto de perfil (máx. 10 MB).
  // @HasRoles(JwtRole.CLIENT)
  // @UseGuards(JwtAuthGuard, JwtRolesGuard)
  // @Put('upload/:id')
  // @UseInterceptors(FileInterceptor('file'))
  // updateWithImage(
  //   @UploadedFile(
  //     new ParseFilePipe({
  //       validators: [
  //         new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 10 }), //tamaño en bytes máximo 10 megas
  //         new FileTypeValidator({ fileType: '.(png|jpeg|jpg)' }),
  //       ],
  //     }),
  //   )
  //   file: Express.Multer.File,
  //   @Param('id', ParseIntPipe) id: number,
  //   @Body() user: UpdateUserDto,
  // ) {
  //   return this.usersService.updateWithImage(file, id, user);
  // }
}
