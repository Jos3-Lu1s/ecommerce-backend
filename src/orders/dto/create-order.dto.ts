// Datos para crear una orden. También viaja dentro de PaymentBody.order en POST /mercadopago/payments.
export class CreateOrderDto {
  // ID del usuario/cliente que realiza la compra
  id_client!: number;

  // ID de la dirección de entrega seleccionada por el cliente
  id_address!: number;

  // Productos de la orden con sus cantidades
  products!: Array<{
    id: number; // ID del producto
    quantity: number; // Unidades compradas de este producto
  }>;
}
