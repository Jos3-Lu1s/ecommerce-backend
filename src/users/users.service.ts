import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Rol } from 'src/roles/entities/rol.entity';
import storage = require('../utils/cloud_storage');

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}
  //Estamos usando conceptos de APIRest
  create(user: CreateUserDto) {
    const newUser = this.usersRepository.create(user); //Aqui nos crea un nuevo usuario
    return this.usersRepository.save(newUser); //Se lo enviamos a la BD
  }

  findAll() {
    return this.usersRepository.find({ relations: ['roles'] });
  }

  async update(id: number, user: UpdateUserDto) {
    const userFound = await this.usersRepository.findOneBy({ id: id });

    if (!userFound) {
      throw new HttpException('Usuario no existe', HttpStatus.NOT_FOUND);
    }

    console.log('User:', user);

    const updatedUser = Object.assign(userFound, user); //Actualiza al usuario
    return this.usersRepository.save(updatedUser);
  }

  //Actualizar con imagen
  async updateWithImage(
    file: Express.Multer.File,
    id: number,
    user: UpdateUserDto,
  ) {
    const url = await storage(file, file.originalname);
    console.log('URL: ' + url);
    console.log('UserURL: ', user);

    if (url === undefined && url === null) {
      throw new HttpException(
        'La imagen no se pudo guardar',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    const userFound = await this.usersRepository.findOneBy({ id: id });

    if (!userFound) {
      throw new HttpException('Usuario no existe', HttpStatus.NOT_FOUND);
    }
    user.image = url;
    const updatedUser = Object.assign(userFound, user);
    return this.usersRepository.save(updatedUser);
  }
}
