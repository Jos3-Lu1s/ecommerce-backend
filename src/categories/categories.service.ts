import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import storage = require('../utils/cloud_storage');
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { Repository } from 'typeorm';
import { UpdateCategoryDto } from './dto/update-category.dto';

// Lógica de negocio de las categorías (tabla 'categories').
// Las imágenes se suben a Firebase Storage y en la BD se guarda solo su URL.
@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,
  ) {}

  // Devuelve todas las categorías.
  findAll() {
    return this.categoriesRepository.find();
  }

  // Crea una categoría. Si llega imagen, la sube primero y guarda su URL en 'image'.
  // Lanza 500 si la subida no devuelve URL.
  async create(file: Express.Multer.File, category: CreateCategoryDto) {
    if (file) {
      const url = await storage(file, file.originalname);

      if (!url) {
        throw new HttpException(
          'La imagen no se pudo guardar',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      category.image = url;
    }

    const newCategory = this.categoriesRepository.create(category);
    return this.categoriesRepository.save(newCategory);
  }

  // Actualiza solo los campos enviados. Lanza 404 si la categoría no existe.
  async update(id: number, category: UpdateCategoryDto) {
    const categoryFound = await this.categoriesRepository.findOneBy({ id: id });

    if (!categoryFound) {
      throw new HttpException('La categoria no existe', HttpStatus.NOT_FOUND);
    }

    const updatedCategory = Object.assign(categoryFound, category);
    return this.categoriesRepository.save(updatedCategory);
  }

  // Sube la nueva imagen y actualiza la categoría con los datos enviados y la nueva URL.
  // Lanza 500 si la subida falla y 404 si la categoría no existe.
  // La imagen se sube antes de comprobar que la categoría existe.
  async updateWithImage(
    file: Express.Multer.File,
    id: number,
    category: UpdateCategoryDto,
  ) {
    const url = await storage(file, file.originalname);

    if (!url) {
      throw new HttpException(
        'La imagen no se pudo guardar',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    const categoryFound = await this.categoriesRepository.findOneBy({ id: id });

    if (!categoryFound) {
      throw new HttpException('La categoria no existe', HttpStatus.NOT_FOUND);
    }

    category.image = url;
    const updatedCategory = Object.assign(categoryFound, category);
    return this.categoriesRepository.save(updatedCategory);
  }

  // Elimina la categoría. Lanza 404 si no existe. La imagen en Firebase no se borra.
  async delete(id: number) {
    const categoryFound = await this.categoriesRepository.findOneBy({ id: id });

    if (!categoryFound) {
      throw new HttpException('La categoria no existe', HttpStatus.NOT_FOUND);
    }

    return this.categoriesRepository.delete(id);
  }
}
