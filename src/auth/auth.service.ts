import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository, In } from 'typeorm';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { compare } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Rol } from 'src/roles/entities/rol.entity';

// Lógica de registro e inicio de sesión.
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
    @InjectRepository(Rol) private rolesRepository: Repository<Rol>,

    private jwtService: JwtService,
  ) {}

  // Registra un usuario, le asigna roles y devuelve { user, token }.
  async register(user: RegisterAuthDto) {
    const { email, phone } = user;

    // El email debe ser único: 409 CONFLICT si ya existe.
    const emailExist = await this.usersRepository.findOneBy({ email: email });

    if (emailExist) {
      throw new HttpException(
        'El email ya esta registrado',
        HttpStatus.CONFLICT,
      );
    }

    // El teléfono debe ser único: 409 CONFLICT si ya existe.
    const phoneExist = await this.usersRepository.findOneBy({ phone: phone });

    if (phoneExist) {
      throw new HttpException(
        'El telefono ya esta registrado',
        HttpStatus.CONFLICT,
      );
    }

    const newUser = this.usersRepository.create(user);
    let rolesIds:string[] = [];

    // Usa los roles enviados en la petición; si no se envían, asigna CLIENT por defecto.
    if (user.rolesIds !== undefined && user.rolesIds !== null) {
      rolesIds = user.rolesIds;
    } else {
      rolesIds.push('CLIENT');
    }

    // Busca los roles en la BD y los asocia al usuario (tabla user_has_roles).
    const roles = await this.rolesRepository.findBy({ id: In(rolesIds) });
    newUser.roles = roles;

    // Al guardar, el hook @BeforeInsert de User cifra la contraseña.
    const userSaved = await this.usersRepository.save(newUser);

    // Payload del token. Debe coincidir con lo que lee JwtStrategy.validate().
    const rolesString = userSaved.roles.map((rol) => rol.id); // Ej.: ['CLIENT', 'ADMIN']
    const payload = {
      id: userSaved.id,
      name: userSaved.name,
      roles: rolesString,
    };
    const token = this.jwtService.sign(payload);
    // Quita la contraseña del objeto que se devuelve en la respuesta.
    const { password: _password, ...userWithoutPassword } = userSaved;
    const data = {
      user: userWithoutPassword,
      token: 'Bearer ' + token,
    };
    return data;
  }

  // Valida email y contraseña y devuelve { user, token }.
  async login(loginData: LoginAuthDto) {
    const { email, password } = loginData;
    const userFound = await this.usersRepository.findOne({
      where: { email: email },
      relations: ['roles'],
    });
    // 404 NOT FOUND si el email no está registrado.
    if (!userFound) {
      throw new HttpException('El email no existe', HttpStatus.NOT_FOUND);
    }

    // Compara la contraseña en texto plano con el hash guardado.
    const isPasswordValid = await compare(password, userFound.password);
    if (!isPasswordValid) {
      console.log('PASSWORD INCORRECTO');

      // 403 FORBIDDEN si la contraseña no coincide.
      throw new HttpException(
        'La contraseña es incorrecta',
        HttpStatus.FORBIDDEN,
      );
    }

    // Payload del token. Debe coincidir con lo que lee JwtStrategy.validate().
    const rolesIds = userFound.roles.map((rol) => rol.id); // Ej.: ['CLIENT', 'ADMIN']

    const payload = {
      id: userFound.id,
      name: userFound.name,
      roles: rolesIds,
    };
    const token = this.jwtService.sign(payload);
    // Quita la contraseña del objeto que se devuelve en la respuesta.
    const { password: _password, ...userWithoutPassword } = userFound;
    const data = {
      user: userWithoutPassword,
      token: 'Bearer ' + token,
    };

    return data;
  }
}
