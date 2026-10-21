import {
  Controller,
  UseGuards,
  Put,
  UseInterceptors,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
  Param,
  Body,
  ParseIntPipe,
  Post,
  Get,
  Delete,
  UploadedFiles,
  Query,
  DefaultValuePipe,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { HasRoles } from '../auth/jwt/has-roles';
import { JwtRole } from '../auth/jwt/jwt-role';
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard';
import { JwtRolesGuard } from '../auth/jwt/jwt-roles.guard';
import { FilesInterceptor } from '@nestjs/platform-express';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Pagination } from 'nestjs-typeorm-paginate';
import { Product } from './entities/product.entity';
import { API } from 'src/config/config';

// Prefijo de ruta base: http://localhost:3000/products
// Gestiona el catálogo de productos.
@Controller('products')
export class ProductsController {
  constructor(private productsService: ProductsService) {}

  // GET http://localhost:3000/products
  // Lista todos los productos. Requiere token con rol ADMIN o CLIENT.
  @HasRoles(JwtRole.ADMIN, JwtRole.CLIENT)
  @UseGuards(JwtAuthGuard, JwtRolesGuard)
  @Get()
  findAll() {
    return this.productsService.findAll();
  }

  // GET http://localhost:3000/products/pagination?page=1&limit=5
  // Lista productos paginados. Por defecto page=1 y limit=5. Requiere rol ADMIN o CLIENT.
  // Los enlaces de navegación de la respuesta se construyen con la IP definida en config.API.
  @HasRoles(JwtRole.ADMIN, JwtRole.CLIENT)
  @UseGuards(JwtAuthGuard, JwtRolesGuard)
  @Get('pagination')
  async pagination(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(5), ParseIntPipe) limit: number = 5,
  ): Promise<Pagination<Product>> {
    return this.productsService.paginate({
      page,
      limit,
      route: `http://${API}:3000/products/pagination`,
    });
  }

  // GET http://localhost:3000/products/category/:id_category
  // Lista los productos de una categoría. Requiere rol ADMIN o CLIENT.
  @HasRoles(JwtRole.ADMIN, JwtRole.CLIENT)
  @UseGuards(JwtAuthGuard, JwtRolesGuard)
  @Get('category/:id_category')
  findByCategory(@Param('id_category', ParseIntPipe) id_category: number) {
    return this.productsService.findByCategory(id_category);
  }

  // GET http://localhost:3000/products/search/:name
  // Busca productos cuyo nombre contenga el texto indicado. Requiere rol ADMIN o CLIENT.
  @HasRoles(JwtRole.ADMIN, JwtRole.CLIENT)
  @UseGuards(JwtAuthGuard, JwtRolesGuard)
  @Get('search/:name')
  findByName(@Param('name') name: string) {
    return this.productsService.findByName(name);
  }

  // POST http://localhost:3000/products (multipart/form-data)
  // Crea un producto con hasta 2 imágenes opcionales en el campo 'files[]' (PNG/JPG/JPEG, máx. 10 MB c/u).
  // Público: los guards están desactivados.
  // @HasRoles(JwtRole.ADMIN)
  // @UseGuards(JwtAuthGuard, JwtRolesGuard)
  @Post()
  @UseInterceptors(FilesInterceptor('files[]', 2))
  create(
    @UploadedFiles(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 10 }),
          new FileTypeValidator({ fileType: '.(png|jpeg|jpg)' }),
        ],
        fileIsRequired: false,
      }),
    )
    files: Array<Express.Multer.File>,
    @Body() product: CreateProductDto,
  ) {
    console.log('Files: ', files);
    console.log('Product: ', product);

    return this.productsService.create(files, product);
  }

  // PUT http://localhost:3000/products/upload/:id (multipart/form-data)
  // Actualiza un producto y reemplaza sus imágenes. Requiere al menos 1 archivo en 'files[]' (máx. 2)
  // y el campo 'images_to_update' indicando qué imagen reemplaza cada archivo. Solo ADMIN.
  @HasRoles(JwtRole.ADMIN)
  @UseGuards(JwtAuthGuard, JwtRolesGuard)
  @Put('upload/:id')
  @UseInterceptors(FilesInterceptor('files[]', 2))
  updateWithImage(
    @UploadedFiles(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 10 }),
          new FileTypeValidator({ fileType: '.(png|jpeg|jpg)' }),
        ],
      }),
    )
    files: Array<Express.Multer.File>,
    @Param('id', ParseIntPipe) id: number,
    @Body() product: UpdateProductDto,
  ) {
    console.log('PRoduct: ', product);

    return this.productsService.updateWithImages(files, id, product);
  }

  // PUT http://localhost:3000/products/:id
  // Actualiza los datos de un producto sin cambiar sus imágenes. Solo ADMIN.
  @HasRoles(JwtRole.ADMIN)
  @UseGuards(JwtAuthGuard, JwtRolesGuard)
  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() product: UpdateProductDto,
  ) {
    return this.productsService.update(id, product);
  }

  // DELETE http://localhost:3000/products/:id
  // Elimina un producto. Solo ADMIN.
  @HasRoles(JwtRole.ADMIN)
  @UseGuards(JwtAuthGuard, JwtRolesGuard)
  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.delete(id);
  }
}
