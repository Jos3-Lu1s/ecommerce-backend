import {
  Controller,
  UseGuards,
  Put,
  Param,
  Body,
  ParseIntPipe,
  Post,
  Get,
} from '@nestjs/common';
import { HasRoles } from '../auth/jwt/has-roles';
import { JwtRole } from '../auth/jwt/jwt-role';
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard';
import { JwtRolesGuard } from '../auth/jwt/jwt-roles.guard';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';

// Prefijo de ruta base: http://localhost:3000/orders
@Controller('orders')
export class OrdersController {
  constructor(private ordersService: OrdersService) {}

  // POST http://localhost:3000/orders
  // Crea una orden directamente, sin cobro en Mercado Pago. Público: los guards están desactivados.
  // @HasRoles(JwtRole.CLIENT, JwtRole.ADMIN)
  // @UseGuards(JwtAuthGuard, JwtRolesGuard)
  @Post()
  create(@Body() order: CreateOrderDto) {
    return this.ordersService.create(order);
  }

  // GET http://localhost:3000/orders
  // Obtiene todas las órdenes del sistema. Público: los guards (pensados para ADMIN) están desactivados.
  // @HasRoles(JwtRole.ADMIN)
  // @UseGuards(JwtAuthGuard, JwtRolesGuard)
  @Get()
  findAll() {
    return this.ordersService.findAll();
  }

  // GET http://localhost:3000/orders/:id_client
  // Obtiene las órdenes de un cliente por su ID. Requiere rol CLIENT o ADMIN.
  @HasRoles(JwtRole.CLIENT, JwtRole.ADMIN)
  @UseGuards(JwtAuthGuard, JwtRolesGuard)
  @Get(':id_client')
  findByClient(@Param('id_client', ParseIntPipe) idClient: number) {
    return this.ordersService.findByClient(idClient);
  }

  // PUT http://localhost:3000/orders/:id
  // Cambia el estado de una orden a 'DESPACHADO'. Solo ADMIN.
  @HasRoles(JwtRole.ADMIN)
  @UseGuards(JwtAuthGuard, JwtRolesGuard)
  @Put(':id')
  updateStatus(@Param('id', ParseIntPipe) id: number) {
    return this.ordersService.updateStatus(id);
  }
}
