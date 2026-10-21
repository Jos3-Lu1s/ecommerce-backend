import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { Address } from 'src/address/entities/address.entity';
import { OrderHasProducts } from './order_has_products.entity';

// Tabla 'orders': órdenes de compra de los clientes.
@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn()
  id!: number;

  // Clave foránea al usuario que compra.
  @Column()
  id_client!: number;

  // Clave foránea a la dirección de entrega.
  @Column()
  id_address!: number;

  // Estado de la orden: 'PAGADO' al crearse, 'DESPACHADO' tras PUT /orders/:id.
  @Column({ default: 'PAGADO' })
  status!: string;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  created_at!: Date;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  updated_at!: Date;

  // Cliente de la orden (columna id_client).
  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'id_client' })
  user!: User;

  // Dirección de entrega (columna id_address).
  @ManyToOne(() => Address, (address) => address.id)
  @JoinColumn({ name: 'id_address' })
  address!: Address;

  // Productos de la orden con sus cantidades (tabla 'order_has_products').
  @OneToMany(() => OrderHasProducts, (ohp) => ohp.order)
  @JoinColumn({ referencedColumnName: 'id_order' })
  orderHasProducts!: OrderHasProducts[];
}
