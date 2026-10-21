import { IsNotEmpty, IsNumber, IsString } from "class-validator";

// Datos requeridos para crear una dirección.
export class CreateAddressDto {

    // Calle y número.
    @IsNotEmpty()
    @IsString()
    address!: string;

    // Barrio o colonia.
    @IsNotEmpty()
    @IsString()
    neighborhood!: string;

    // ID del usuario dueño de la dirección.
    @IsNotEmpty()
    id_user!: number

}