// Titular de la tarjeta, tal como lo espera y devuelve Mercado Pago.
export interface Cardholder {
  identification: Identification;
  // Nombre impreso en la tarjeta.
  name: string;
}

// Documento de identidad.
export interface Identification {
  number: string;
  // Tipo de documento; debe ser un id devuelto por GET /mercadopago/identification_types.
  type: string;
}
