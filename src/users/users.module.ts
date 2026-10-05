import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { JwtStrategy } from '../auth/jwt/jwt.strategy';
import { Rol } from 'src/roles/entities/rol.entity';
import { Order } from 'src/orders/entities/order.entity';

@Module({
  imports: [ TypeOrmModule.forFeature([User, Rol, Order]) ],
  providers: [UsersService, JwtStrategy],
  controllers: [UsersController]
})
export class UsersModule {}