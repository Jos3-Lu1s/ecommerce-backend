import { Module } from '@nestjs/common';
import { AddressService } from './address.service';
import { AddressController } from './address.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Address } from './entities/address.entity';
import { User } from 'src/users/entities/user.entity';
import { JwtStrategy } from '../auth/jwt/jwt.strategy';
import { Order } from 'src/orders/entities/order.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Address, User, Order])],
  providers: [AddressService, JwtStrategy],
  controllers: [AddressController]
})
export class AddressModule { }