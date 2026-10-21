// Tipo de documento de identidad aceptado por Mercado Pago (respuesta de /identification_types).
export interface IdentificationType {
  // Código del documento (ej. 'CC', 'DNI'). Se usa en Identification.type.
  id: string;
  name: string;
  // Tipo de valor del documento (ej. 'number').
  type: string;
  // Longitud mínima y máxima del número de documento.
  min_length: number;
  max_length: number;
}
