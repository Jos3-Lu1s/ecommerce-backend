import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BeforeInsert,
  ManyToMany,
  JoinTable,
  OneToMany,
} from 'typeorm';
import { hash } from 'bcrypt';
import { Rol } from 'src/roles/entities/rol.entity';
import { Address } from 'src/address/entities/address.entity';
import { Order } from 'src/orders/entities/order.entity';
import { Exclude } from 'class-transformer';

// Tabla 'users': usuarios de la aplicación.
@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column()
  lastname!: string;

  @Column({ unique: true })
  email!: string;

  @Column({ unique: true })
  phone!: string;

  // URL de la foto de perfil. Puede ser NULL.
  @Column({ nullable: true })
  image!: string;

  // Hash bcrypt de la contraseña. Se devuelve en las consultas: AuthService lo elimina manualmente de sus respuestas.
  // @Column({ select: false })
  @Column()
  password!: string;

  // Token del dispositivo para notificaciones push. Puede ser NULL.
  @Column({ nullable: true })
  notification_token!: string;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  created_at!: Date;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  updated_at!: Date;

  // Relación muchos a muchos con Rol a través de la tabla intermedia 'user_has_roles' (id_user, id_rol).
  @JoinTable({
    name: 'user_has_roles',
    joinColumn: {
      name: 'id_user',
    },
    inverseJoinColumn: {
      name: 'id_rol',
    },
  })
  @ManyToMany(() => Rol, (rol) => rol.users)
  roles!: Rol[];

  // @OneToMany(() => Address, (address) => address.id)
  // address!: Address;

  // @OneToMany(() => Order, (order) => order.id)
  // order!: Order;

  // Cifra la contraseña antes de insertar el usuario. Las rondas de sal se leen de HASH_SALT (.env).
  // Solo se ejecuta al insertar: una contraseña cambiada con update() no se cifra.
  @BeforeInsert()
  async hashPassword() {
    this.password = await hash(this.password, Number(process.env.HASH_SALT));
  }
}
