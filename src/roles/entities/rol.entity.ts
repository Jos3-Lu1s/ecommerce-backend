import { User } from 'src/users/entities/user.entity';
import { Column, Entity, ManyToMany, PrimaryColumn } from 'typeorm';

// Tabla 'roles': roles asignables a los usuarios.
@Entity({ name: 'roles' })
export class Rol {
  // Clave primaria de texto (ej. 'CLIENT', 'ADMIN'). Coincide con el enum JwtRole.
  @PrimaryColumn()
  id!: string;

  @Column({ unique: true })
  name!: string;

  // URL de la imagen del rol.
  @Column()
  image!: string;

  // Ruta de la app cliente asociada al rol.
  @Column()
  route!: string;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  created_at!: Date;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  updated_at!: Date;

  // Usuarios con este rol. La tabla intermedia 'user_has_roles' se define en User.
  @ManyToMany(() => User, (user) => user.roles)
  users!: User[];
}
