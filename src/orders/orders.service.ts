import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './entities/order.entity';
import { OrderHasProducts } from './entities/order_has_products.entity';
import { CreateOrderDto } from './dto/create-order.dto';

// Lógica de negocio de las órdenes (tablas 'orders' y 'order_has_products').
@Injectable()
export class OrdersService {
  constructor(
    // Repositorio de la tabla 'orders'.
    @InjectRepository(Order) private ordersRepository: Repository<Order>,
    // Repositorio de la tabla intermedia 'order_has_products'.
    @InjectRepository(OrderHasProducts)
    private ordersHasProductsRepository: Repository<OrderHasProducts>,
  ) {}

  // Crea una orden directamente, sin pasarela de pago.
  async create(order: CreateOrderDto) {
    // 1. Prepara la orden con id_client e id_address.
    const newOrder = this.ordersRepository.create(order);

    // 2. Guarda la orden para obtener su ID.
    const savedOrder = await this.ordersRepository.save(newOrder);

    // 3. Registra cada producto en 'order_has_products'.
    for (const product of order.products) {
      const ohp = new OrderHasProducts();
      ohp.id_order = savedOrder.id; // ID de la orden recién creada
      ohp.id_product = product.id; // ID del producto comprado
      ohp.quantity = product.quantity; // Unidades compradas
      await this.ordersHasProductsRepository.save(ohp);
    }

    // 4. Devuelve la orden guardada.
    return savedOrder;
  }

  // Devuelve todas las órdenes con su usuario, dirección y productos.
  findAll() {
    return this.ordersRepository.find({
      relations: ['user', 'address', 'orderHasProducts.product'],
    });
  }

  // Devuelve las órdenes de un cliente con su usuario, dirección y productos.
  findByClient(idClient: number) {
    return this.ordersRepository.find({
      relations: ['user', 'address', 'orderHasProducts.product'],
      where: { id_client: idClient },
    });
  }

  // Cambia el estado de la orden a 'DESPACHADO'. Lanza 404 si no existe.
  async updateStatus(id: number) {
    const orderFound = await this.ordersRepository.findOneBy({ id: id });
    if (!orderFound) {
      throw new HttpException('Orden no encontrada', HttpStatus.NOT_FOUND);
    }
    const updatedOrder = Object.assign(orderFound, { status: 'DESPACHADO' });
    return this.ordersRepository.save(updatedOrder);
  }
}
