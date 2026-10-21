import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Category } from 'src/categories/entities/category.entity';
import { OrderHasProducts } from 'src/orders/entities/order_has_products.entity';

// Tabla 'products': productos del catálogo.
@Entity({ name: 'products' })
export class Product {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column()
  description!: string;

  // URLs públicas de las dos imágenes del producto en Firebase Storage. Pueden ser NULL.
  @Column({ nullable: true })
  image1!: string;

  @Column({ nullable: true })
  image2!: string;

  // Clave foránea a la categoría.
  @Column()
  id_category!: number;

  // Columna entera: no admite decimales.
  @Column()
  price!: number;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  created_at!: Date;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  updated_at!: Date;

  // Categoría del producto (columna id_category).
  @ManyToOne(() => Category, (category) => category.id)
  @JoinColumn({ name: 'id_category' })
  category!: Category;

  // Registros de órdenes en los que aparece este producto.
  @OneToMany(() => OrderHasProducts, (ohp) => ohp.product)
  @JoinColumn({ referencedColumnName: 'id_product' })
  orderHasProducts!: OrderHasProducts[];
}
