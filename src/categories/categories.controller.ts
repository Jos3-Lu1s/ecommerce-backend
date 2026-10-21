import {
  Controller,
  UseGuards,
  Put,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
  Param,
  Body,
  ParseIntPipe,
  Post,
  Get,
  Delete,
} from '@nestjs/common';
import { HasRoles } from '../auth/jwt/has-roles';
import { JwtRole } from '../auth/jwt/jwt-role';
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard';
import { JwtRolesGuard } from '../auth/jwt/jwt-roles.guard';
import { CategoriesService } from './categories.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

// Prefijo de ruta base: http://localhost:3000/categories
// Gestiona las categorías de productos.
@Controller('categories')
export class CategoriesController {
  constructor(private CategoriesService: CategoriesService) {}

  // GET http://localhost:3000/categories
  // Lista todas las categorías. Público: los guards están desactivados.
  // @HasRoles(JwtRole.CLIENT, JwtRole.ADMIN)
  // @UseGuards(JwtAuthGuard, JwtRolesGuard)
  @Get()
  findAll() {
    return this.CategoriesService.findAll();
  }

  // POST http://localhost:3000/categories (multipart/form-data)
  // Crea una categoría. La imagen (campo 'file') es opcional: PNG/JPG/JPEG, máximo 10 MB.
  // Público: los guards están desactivados.
  // @HasRoles(JwtRole.ADMIN)
  // @UseGuards(JwtAuthGuard, JwtRolesGuard)
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  createWithImage(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 10 }),
          new FileTypeValidator({ fileType: '.(png|jpeg|jpg)' }),
        ],
        fileIsRequired: false,
      }),
    )
    file: Express.Multer.File,
    @Body() category: CreateCategoryDto,
  ) {
    return this.CategoriesService.create(file, category);
  }

  // PUT http://localhost:3000/categories/:id
  // Actualiza los datos de una categoría sin cambiar su imagen. Solo ADMIN.
  @HasRoles(JwtRole.ADMIN)
  @UseGuards(JwtAuthGuard, JwtRolesGuard)
  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() category: UpdateCategoryDto,
  ) {
    return this.CategoriesService.update(id, category);
  }

  // PUT http://localhost:3000/categories/upload/:id (multipart/form-data)
  // Actualiza una categoría y reemplaza su imagen. La imagen (campo 'file') es obligatoria:
  // PNG/JPG/JPEG, máximo 10 MB. Solo ADMIN.
  @HasRoles(JwtRole.ADMIN)
  @UseGuards(JwtAuthGuard, JwtRolesGuard)
  @Put('upload/:id')
  @UseInterceptors(FileInterceptor('file'))
  updateWithImage(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 10 }),
          new FileTypeValidator({ fileType: '.(png|jpeg|jpg)' }),
        ],
      }),
    )
    file: Express.Multer.File,
    @Param('id', ParseIntPipe) id: number,
    @Body() category: UpdateCategoryDto,
  ) {
    return this.CategoriesService.updateWithImage(file, id, category);
  }

  // DELETE http://localhost:3000/categories/:id
  // Elimina una categoría. Solo ADMIN.
  @HasRoles(JwtRole.ADMIN)
  @UseGuards(JwtAuthGuard, JwtRolesGuard)
  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.CategoriesService.delete(id);
  }
}
