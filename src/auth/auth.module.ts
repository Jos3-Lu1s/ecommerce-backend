import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './jwt/jwt.constants';
import { JwtStrategy } from './jwt/jwt.strategy';
import { RolesService } from 'src/roles/roles.service';
import { Rol } from 'src/roles/entities/rol.entity';

// Módulo de autenticación: registro, login y emisión de tokens JWT.
@Module({
  imports: [
    TypeOrmModule.forFeature([User, Rol]),
    // Configura la firma de los tokens: clave secreta y expiración de 2 días.
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '2d' },
    }),
  ],
  providers: [AuthService, RolesService, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
