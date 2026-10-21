import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { Like, Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import {
  IPaginationOptions,
  Pagination,
  paginate,
} from 'nestjs-typeorm-paginate';
import asyncForEach = require('../utils/async_foreach');
import storage = require('../utils/cloud_storage');

// Lógica de negocio de los productos (tabla 'products').
// Las imágenes se suben a Firebase Storage y en la BD se guarda solo su URL (image1, image2).
@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product) private productsRepository: Repository<Product>,
  ) {}

  // Devuelve todos los productos.
  findAll() {
    return this.productsRepository.find();
  }

  // Devuelve los productos de la categoría indicada.
  findByCategory(id_category: number) {
    return this.productsRepository.findBy({ id_category: id_category });
  }

  // Devuelve una página de productos con metadatos (total, páginas) y enlaces de navegación.
  async paginate(options: IPaginationOptions): Promise<Pagination<Product>> {
    return paginate<Product>(this.productsRepository, options);
  }

  // Busca productos cuyo nombre contenga el texto (SQL LIKE '%texto%').
  findByName(name: string) {
    return this.productsRepository.find({ where: { name: Like(`%${name}%`) } });
  }

  // Crea el producto y después sube las imágenes recibidas, una por una y en orden:
  // el 1er archivo se guarda en image1 y el 2do en image2.
  async create(files: Array<Express.Multer.File>, product: CreateProductDto) {
    // Se guarda primero para obtener el ID del producto.
    const newProduct = this.productsRepository.create(product);
    const savedProduct = await this.productsRepository.save(newProduct);

    if (files && files.length > 0) {
      // Índice del archivo que se está procesando (0 = image1, 1 = image2).
      let uploadedFiles = 0;
      const startForEach = async () => {
        // asyncForEach procesa los archivos en secuencia, esperando cada subida.
        await asyncForEach(files, async (file: Express.Multer.File) => {
          const url = await storage(file, file.originalname);

          if (url !== undefined && url !== null) {
            if (uploadedFiles === 0) {
              savedProduct.image1 = url;
            } else if (uploadedFiles === 1) {
              savedProduct.image2 = url;
            }
          }

          // Guarda la URL en la BD tras cada subida.
          await this.update(savedProduct.id, savedProduct);
          uploadedFiles = uploadedFiles + 1;
        });
      };
      await startForEach();
    }

    return savedProduct;
  }

  // Actualiza los datos del producto y reemplaza las imágenes indicadas en images_to_update.
  // images_to_update[i] define qué imagen reemplaza files[i]: 0 = image1, 1 = image2.
  async updateWithImages(
    files: Array<Express.Multer.File>,
    id: number,
    product: UpdateProductDto,
  ) {
    // Sin archivos responde 404 (NOT_FOUND).
    if (files.length === 0) {
      throw new HttpException(
        'Las imagenes son obligatorias',
        HttpStatus.NOT_FOUND,
      );
    }

    // Sin images_to_update responde 400 (BAD_REQUEST).
    const imagesToUpdate = product.images_to_update;
    if (!imagesToUpdate || imagesToUpdate.length === 0) {
      throw new HttpException(
        'Debe indicar qué imágenes actualizar',
        HttpStatus.BAD_REQUEST,
      );
    }

    // counter: índice del archivo actual. uploadedFiles: imagen destino de ese archivo (0 o 1).
    let counter = 0;
    let uploadedFiles = Number(imagesToUpdate[counter]);

    // Aplica primero los datos de texto. Lanza 404 si el producto no existe.
    const updatedProduct = await this.update(id, product);

    const startForEach = async () => {
      // Sube los archivos en secuencia y asigna cada URL a la imagen indicada.
      await asyncForEach(files, async (file: Express.Multer.File) => {
        const url = await storage(file, file.originalname);

        if (url !== undefined && url !== null) {
          if (uploadedFiles === 0) {
            updatedProduct.image1 = url;
          } else if (uploadedFiles === 1) {
            updatedProduct.image2 = url;
          }
        }

        // Guarda la URL en la BD y pasa al siguiente archivo.
        await this.update(updatedProduct.id, updatedProduct);
        counter++;
        uploadedFiles = Number(imagesToUpdate[counter]);
      });
    };
    await startForEach();
    return updatedProduct;
  }

  // Actualiza solo los campos enviados. Lanza 404 si el producto no existe.
  async update(id: number, product: UpdateProductDto) {
    const productFound = await this.productsRepository.findOneBy({ id: id });
    console.log('Product found: ', productFound);

    if (!productFound) {
      throw new HttpException('Producto no encontrado', HttpStatus.NOT_FOUND);
    }
    const updatedProduct = Object.assign(productFound, product);
    console.log('Product Updated:', updatedProduct);

    return this.productsRepository.save(updatedProduct);
  }

  // Elimina el producto. Lanza 404 si no existe. Las imágenes en Firebase no se borran.
  async delete(id: number) {
    const productFound = await this.productsRepository.findOneBy({ id: id });
    if (!productFound) {
      throw new HttpException('Producto no encontrado', HttpStatus.NOT_FOUND);
    }
    return this.productsRepository.delete(id);
  }
}
