import { Cardholder } from './card_holder';

// Respuesta de Mercado Pago al crear un token de tarjeta.
export interface CardTokenResponse {
  // Token de la tarjeta. Se envía como 'token' en PaymentBody.
  id: string;
  public_key: string;
  first_six_digits: string;
  expiration_month: number;
  expiration_year: number;
  last_four_digits: string;
  cardholder: Cardholder;
  status: string;
  date_created: Date;
  date_last_updated: Date;
  // Fecha a partir de la cual el token deja de ser válido.
  date_due: Date;
  luhn_validation: boolean;
  // false en entorno de pruebas.
  live_mode: boolean;
  require_esc: boolean;
  card_number_length: number;
  security_code_length: number;
}
