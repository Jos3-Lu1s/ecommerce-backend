import { IsOptional } from 'class-validator';
import { Product } from 'src/products/entities/product.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

// Tabla 'categories': categorías a las que pertenecen los productos.
@Entity({ name: 'categories' })
export class Category {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  name!: string;

  @Column()
  description!: string;

  // URL pública de la imagen en Firebase Storage. Puede ser NULL.
  @IsOptional()
  @Column({ nullable: true })
  image!: string;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  created_at!: Date;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  updated_at!: Date;

  // Productos que pertenecen a esta categoría.
  @OneToMany(() => Product, (product) => product.id)
  product!: Product;
}
