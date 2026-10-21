import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Order } from './order.entity';
import { Product } from 'src/products/entities/product.entity';

// Tabla intermedia 'order_has_products': qué productos y cuántas unidades tiene cada orden.
// Clave primaria compuesta (id_order, id_product): un producto aparece una sola vez por orden.
@Entity('order_has_products')
export class OrderHasProducts {
  @PrimaryColumn()
  id_order!: number;

  @PrimaryColumn()
  id_product!: number;

  // Unidades compradas del producto.
  @Column()
  quantity!: number;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  created_at!: Date;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  updated_at!: Date;

  // Orden a la que pertenece el registro (columna id_order).
  @ManyToOne(() => Order, (order) => order.id)
  @JoinColumn({ name: 'id_order' })
  order!: Order;

  // Producto comprado (columna id_product).
  @ManyToOne(() => Product, (product) => product.id)
  @JoinColumn({ name: 'id_product' })
  product!: Product;
}
