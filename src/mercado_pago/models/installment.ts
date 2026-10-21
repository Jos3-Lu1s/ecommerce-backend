// Opciones de pago en cuotas para una tarjeta (respuesta de /payment_methods/installments).
// Las interfaces se generaron a partir de una respuesta real de la API.
export interface Installment {
  // Marca de la tarjeta (ej. 'visa', 'master'). Se envía como payment_method_id en PaymentBody.
  payment_method_id: string;
  // Tipo de tarjeta (ej. 'credit_card', 'debit_card').
  payment_type_id: string;
  // Banco emisor. Su id se envía como issuer_id en PaymentBody.
  issuer: Issuer;
  processing_mode: string;
  merchant_account_id: null;
  // Una entrada por cada número de cuotas disponible.
  payer_costs: PayerCost[];
  agreements: null;
}

// Banco emisor de la tarjeta.
export interface Issuer {
  id: string;
  name: string;
  // URLs del logo del banco.
  secure_thumbnail: string;
  thumbnail: string;
}

// Costo para el comprador de pagar en un número de cuotas concreto.
export interface PayerCost {
  // Número de cuotas. Se envía como installments en PaymentBody.
  installments: number;
  // Interés aplicado, en porcentaje.
  installment_rate: number;
  discount_rate: number;
  reimbursement_rate: null;
  labels: string[];
  installment_rate_collector: InstallmentRateCollector[];
  // Montos mínimo y máximo permitidos para esta opción.
  min_allowed_amount: number;
  max_allowed_amount: number;
  // Texto listo para mostrar al usuario (ej. '3 cuotas de $ 100,00').
  recommended_message: string;
  // Monto de cada cuota.
  installment_amount: number;
  // Monto total a pagar con intereses.
  total_amount: number;
  payment_method_option_id: PaymentMethodOptionID;
}

// Quién cobra el interés de las cuotas.
export enum InstallmentRateCollector {
  Mercadopago = 'MERCADOPAGO',
  ThirdParty = 'THIRD_PARTY',
}

// Valor copiado de la respuesta de ejemplo usada para generar las interfaces. En la práctica el id varía.
export enum PaymentMethodOptionID {
  The1AQokODLLZjQyNjktYjAzMy00OWU1LWJhMWQtNDE0NjQyNTM3MzY4EJaFuevHLg = '1.AQokODllZjQyNjktYjAzMy00OWU1LWJhMWQtNDE0NjQyNTM3MzY4EJaFuevHLg',
}
