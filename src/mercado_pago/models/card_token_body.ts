import { Cardholder } from './card_holder';

// Cuerpo de POST /mercadopago/card_token: datos de la tarjeta a tokenizar.
export interface CardTokenBody {
  card_number: string;
  // Año de vencimiento con 4 dígitos (ej. '2030').
  expiration_year: string;
  // Mes de vencimiento (1-12).
  expiration_month: number;
  // Código de seguridad (CVV).
  security_code: string;
  cardholder: Cardholder;
}
