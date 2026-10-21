import { User } from 'src/users/entities/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Order } from 'src/orders/entities/order.entity';

// Tabla 'address': direcciones de entrega de los usuarios.
@Entity({ name: 'address' })
export class Address {
  @PrimaryGeneratedColumn()
  id!: number;

  // Calle y número.
  @Column()
  address!: string;

  // Barrio o colonia.
  @Column()
  neighborhood!: string;

  // Clave foránea al usuario dueño de la dirección.
  @Column()
  id_user!: number;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  created_at!: Date;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  updated_at!: Date;

  // Órdenes que usan esta dirección de entrega.
  @OneToMany(() => Order, (order) => order.id)
  order!: Order;

  // Usuario dueño de la dirección (columna id_user).
  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'id_user' })
  user!: User;
}
