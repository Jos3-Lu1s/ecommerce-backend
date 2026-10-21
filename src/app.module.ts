import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { RolesModule } from './roles/roles.module';
import { OrdersModule } from './orders/orders.module';
import { AddressModule } from './address/address.module';
import { ProductsModule } from './products/products.module';
import { CategoriesModule } from './categories/categories.module';
import { MercadoPagoModule } from './mercado_pago/mercado_pago.module';

// Módulo raíz: carga la configuración, conecta la base de datos y registra todos los módulos de la API.
@Module({
  imports: [
    // Carga las variables del archivo .env en process.env.
    ConfigModule.forRoot(),
    // Conexión a MySQL con los datos del .env.
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      database: process.env.DB_NAME,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      // Registra automáticamente las entidades declaradas con TypeOrmModule.forFeature().
      autoLoadEntities: true,
      // Crea/modifica las tablas según las entidades al iniciar. Solo para desarrollo: puede alterar o perder datos.
      synchronize: true,
    }),
    UsersModule,
    AuthModule,
    RolesModule,
    OrdersModule,
    AddressModule,
    ProductsModule,
    CategoriesModule,
    MercadoPagoModule,
  ],
})
export class AppModule {}
