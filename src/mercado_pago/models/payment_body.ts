import { Identification } from './card_holder';
import { CreateOrderDto } from '../../orders/dto/create-order.dto';

// Cuerpo de POST /mercadopago/payments.
// Todos los campos excepto 'order' se reenvían tal cual a la API /payments de Mercado Pago.
export interface PaymentBody {
  // Monto a cobrar. Se redondea a 2 decimales antes de enviarlo.
  transaction_amount: number;
  // Token de la tarjeta obtenido en POST /mercadopago/card_token.
  token: string;
  // Número de cuotas elegido.
  installments: number;
  // ID del banco emisor (Installment.issuer.id).
  issuer_id: string;
  // Marca de la tarjeta (Installment.payment_method_id).
  payment_method_id: string;
  payer: Payer;
  // Orden a registrar en la BD. Se elimina del cuerpo antes de llamar a Mercado Pago.
  order: CreateOrderDto;
}

// Comprador.
export interface Payer {
  email: string;
  identification: Identification;
}
