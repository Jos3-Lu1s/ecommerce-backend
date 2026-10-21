import { Module } from '@nestjs/common';
import { MercadoPagoService } from './mercado_pago.service';
import { MercadoPagoController } from './mercado_pago.controller';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from 'src/orders/entities/order.entity';
import { OrderHasProducts } from 'src/orders/entities/order_has_products.entity';

// Módulo de pagos con Mercado Pago.
// HttpModule provee el cliente HTTP (axios) para llamar a la API de Mercado Pago.
// Order y OrderHasProducts se registran porque el pago guarda la orden en la BD.
@Module({
  imports: [HttpModule, TypeOrmModule.forFeature([Order, OrderHasProducts])],
  providers: [MercadoPagoService],
  controllers: [MercadoPagoController],
})
export class MercadoPagoModule {}
