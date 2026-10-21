import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { OrderHasProducts } from './entities/order_has_products.entity';
import { User } from 'src/users/entities/user.entity';
import { Address } from 'src/address/entities/address.entity';
import { Product } from 'src/products/entities/product.entity';

// Módulo de órdenes: registra la orden, su tabla intermedia y las entidades relacionadas.
@Module({
  imports: [
    TypeOrmModule.forFeature([Order, OrderHasProducts, User, Address, Product]),
  ],
  providers: [OrdersService],
  controllers: [OrdersController],
})
export class OrdersModule {}
