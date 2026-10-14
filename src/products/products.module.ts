import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { Product } from './entities/product.entity';
import { Category } from 'src/categories/entities/category.entity';
import { JwtStrategy } from '../auth/jwt/jwt.strategy';
import { OrderHasProducts } from 'src/orders/entities/order_has_products.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Product, Category, OrderHasProducts])],
  controllers: [ProductsController],
  providers: [ProductsService, JwtStrategy],
})
export class ProductsModule {}
