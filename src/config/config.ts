// URL base de la API REST de Mercado Pago (v1).
export const MERCADO_PAGO_API = 'https://api.mercadopago.com/v1';
// Cabeceras enviadas en cada petición a Mercado Pago. El Bearer es el Access Token (credencial de prueba).
export const MERCADO_PAGO_HEADERS = {
    'Authorization': 'Bearer TEST-1957784113747584-030210-b9271e7708744d647b9d05e1e00eae8e-191014229',
    'Content-Type': 'application/json'
}
// IP del servidor usada para construir las URLs de paginación de productos.
export const API = "192.168.1.10";
