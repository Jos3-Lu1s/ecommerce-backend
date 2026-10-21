import { Inject, Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Address } from './entities/address.entity';
import { Repository } from 'typeorm';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';

// Lógica de negocio de las direcciones (tabla 'address').
@Injectable()
export class AddressService {

  constructor(@InjectRepository(Address) private addressRepository: Repository<Address>) { }

  // Crea y guarda una nueva dirección.
  create(address: CreateAddressDto) {
    const newAddress = this.addressRepository.create(address);
    return this.addressRepository.save(newAddress);
  }

  // Devuelve todas las direcciones.
  findAll() {
    return this.addressRepository.find()
  }

  // Devuelve las direcciones que pertenecen al usuario indicado.
  findByUser(id_user: number) {
    return this.addressRepository.findBy({ id_user: id_user })
  }

  // Actualiza solo los campos enviados. Lanza 404 si la dirección no existe.
  async update(id: number, address: UpdateAddressDto) {
    const addressFound = await this.addressRepository.findOneBy({ id: id });
    if (!addressFound) {
      throw new HttpException('Direccion no encontrada', HttpStatus.NOT_FOUND);
    }
    const updatedAddress = Object.assign(addressFound, address);
    return this.addressRepository.save(updatedAddress);
  }

  // Elimina la dirección. Lanza 404 si no existe.
  async delete(id: number) {
    const addressFound = await this.addressRepository.findOneBy({ id: id });
    if (!addressFound) {
      throw new HttpException('Direccion no encontrada', HttpStatus.NOT_FOUND);
    }
    return this.addressRepository.delete(id);
  }

}