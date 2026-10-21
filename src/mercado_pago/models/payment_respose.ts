import { Cardholder, Identification } from './card_holder';

// Respuesta de Mercado Pago al crear un pago (/payments).
// Las interfaces se generaron a partir de una respuesta real; los campos tipados como null
// llegaron vacíos en esa muestra y pueden traer valores en otros pagos.
export interface PaymentResponse {
  // ID del pago en Mercado Pago.
  id: number;
  date_created: Date;
  date_approved: Date;
  date_last_updated: Date;
  date_of_expiration: null;
  money_release_date: Date;
  money_release_status: null;
  operation_type: string;
  issuer_id: string;
  payment_method_id: string;
  payment_type_id: string;
  payment_method: PaymentMethod;
  // Resultado del pago: 'approved', 'rejected', 'in_process', etc.
  status: string;
  // Motivo del estado (ej. 'accredited', 'cc_rejected_insufficient_amount').
  status_detail: string;
  currency_id: string;
  description: null;
  live_mode: boolean;
  sponsor_id: null;
  authorization_code: null;
  money_release_schema: null;
  taxes_amount: number;
  counter_currency: null;
  brand_id: null;
  shipping_amount: number;
  build_version: string;
  pos_id: null;
  store_id: null;
  integrator_id: null;
  platform_id: null;
  corporation_id: null;
  payer: Payer;
  collector_id: number;
  marketplace_owner: null;
  metadata: Metadata;
  additional_info: AdditionalInfo;
  order: Metadata;
  external_reference: null;
  // Monto cobrado.
  transaction_amount: number;
  // Monto neto tras comisiones.
  net_amount: number;
  taxes: Tax[];
  transaction_amount_refunded: number;
  coupon_amount: number;
  differential_pricing_id: null;
  financing_group: null;
  deduction_schema: null;
  installments: number;
  transaction_details: TransactionDetails;
  // Comisiones cobradas por Mercado Pago.
  fee_details: FeeDetail[];
  charges_details: any[];
  captured: boolean;
  binary_mode: boolean;
  call_for_authorize_id: null;
  // Texto que aparece en el resumen de la tarjeta del comprador.
  statement_descriptor: string;
  card: Card;
  notification_url: null;
  refunds: any[];
  processing_mode: string;
  merchant_account_id: null;
  merchant_number: null;
  acquirer_reconciliation: any[];
  point_of_interaction: PointOfInteraction;
  tags: null;
}

export interface AdditionalInfo {
  available_balance: null;
  nsu_processadora: null;
  authentication_code: null;
}

// Datos no sensibles de la tarjeta usada.
export interface Card {
  id: null;
  first_six_digits: string;
  last_four_digits: string;
  expiration_month: number;
  expiration_year: number;
  date_created: Date;
  date_last_updated: Date;
  cardholder: Cardholder;
}

// Comisión aplicada al pago.
export interface FeeDetail {
  type: string;
  amount: number;
  // Quién paga la comisión (ej. 'collector').
  fee_payer: string;
}

// Objeto vacío en la respuesta de muestra.
export interface Metadata {}

// Comprador, según lo registra Mercado Pago.
export interface Payer {
  first_name: null;
  last_name: null;
  email: string;
  identification: Identification;
  phone: Phone;
  type: null;
  entity_type: null;
  id: string;
}

export interface Phone {
  area_code: null;
  number: null;
  extension: null;
}

export interface PaymentMethod {
  id: string;
  type: string;
}

export interface PointOfInteraction {
  type: string;
  business_info: BusinessInfo;
}

export interface BusinessInfo {
  unit: string;
  sub_unit: string;
}

export interface Tax {
  value: number;
  type: string;
}

// Desglose de importes de la transacción.
export interface TransactionDetails {
  payment_method_reference_id: null;
  acquirer_reference: null;
  net_received_amount: number;
  total_paid_amount: number;
  overpaid_amount: number;
  external_resource_url: null;
  installment_amount: number;
  financial_institution: null;
  payable_deferral_period: null;
}
