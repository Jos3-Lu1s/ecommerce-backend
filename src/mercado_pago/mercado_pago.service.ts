import { HttpService } from '@nestjs/axios';
import { Injectable, HttpException } from '@nestjs/common';
import { AxiosResponse, AxiosError } from 'axios';
import { Observable, catchError, map } from 'rxjs';
import { MERCADO_PAGO_API } from 'src/config/config';
import { IdentificationType } from './models/identificaction_type';
import { MERCADO_PAGO_HEADERS } from '../config/config';
import { Installment, PayerCost } from './models/installment';
import { CardTokenBody } from './models/card_token_body';
import { CardTokenResponse } from './models/card_token_response';
import { PaymentResponse } from './models/payment_respose';
import { PaymentBody } from './models/payment_body';
import { Repository } from 'typeorm';
import { Order } from 'src/orders/entities/order.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderHasProducts } from 'src/orders/entities/order_has_products.entity';

@Injectable()
export class MercadoPagoService {
  constructor(
    private readonly httpService: HttpService,
    @InjectRepository(Order) private ordersRepository: Repository<Order>,
    @InjectRepository(OrderHasProducts)
    private ordersHasProductsRepository: Repository<OrderHasProducts>,
  ) {}

  getIdentificationTypes(): Observable<AxiosResponse<IdentificationType[]>> {
    return this.httpService
      .get(MERCADO_PAGO_API + '/identification_types', {
        headers: MERCADO_PAGO_HEADERS,
      })
      .pipe(
        catchError((error: AxiosError<any>) => {
          throw new HttpException(error.response?.data || 'Error en el servicio de Mercado Pago', error.response?.status || 500);
        }),
      )
      .pipe(map((resp) => resp.data));
  }

  getInstallments(
    firstSixDigits: number,
    amount: number,
  ): Observable<Installment> {
    return this.httpService
      .get(
        MERCADO_PAGO_API +
          `/payment_methods/installments?bin=${firstSixDigits}&amount=${amount}`,
        { headers: MERCADO_PAGO_HEADERS },
      )
      .pipe(
        catchError((error: AxiosError<any>) => {
          throw new HttpException(error.response?.data || 'Error en el servicio de Mercado Pago', error.response?.status || 500);
        }),
      )
      .pipe(map((resp: AxiosResponse<Installment>) => resp.data[0]));
  }

  createCardToken(cardTokenBody: CardTokenBody): Observable<CardTokenResponse> {
    return this.httpService
      .post(
        MERCADO_PAGO_API +
          `/card_tokens?public_key=TEST-8568eec6-7fc0-48dc-b15a-d6a9278057e1`,
        cardTokenBody,
        { headers: MERCADO_PAGO_HEADERS },
      )
      .pipe(
        catchError((error: AxiosError<any>) => {
          throw new HttpException(error.response?.data || 'Error en el servicio de Mercado Pago', error.response?.status || 500);
        }),
      )
      .pipe(map((resp: AxiosResponse<CardTokenResponse>) => resp.data));
  }

  // Procesa el pago en Mercado Pago y registra la orden en MySQL
  async createPayment(
    paymentBody: PaymentBody,
  ): Promise<Observable<PaymentResponse>> {
    console.log('--- Petición recibida en createPayment ---');
    console.log(JSON.stringify(paymentBody, null, 2));

    if (
      !paymentBody.order ||
      !paymentBody.order.id_client ||
      !paymentBody.order.id_address ||
      !paymentBody.order.products
    ) {
      throw new HttpException(
        'Falta el objeto "order" o alguno de sus campos obligatorios ("id_client", "id_address", "products")',
        400,
      );
    }

    // Normalizamos los datos numéricos enviados a Mercado Pago.
    // `transaction_amount` debe ser numérico y con máximo 2 decimales;
    // un redondeo previo evita el error 4037 (Invalid transaction_amount)
    // causado por imprecisiones de punto flotante (ej. 100.10000000000001).
    paymentBody.transaction_amount =
      Math.round(Number(paymentBody.transaction_amount) * 100) / 100;
    if (
      !Number.isFinite(paymentBody.transaction_amount) ||
      paymentBody.transaction_amount <= 0
    ) {
      throw new HttpException(
        'transaction_amount debe ser un número mayor que 0',
        400,
      );
    }
    paymentBody.installments = Number(paymentBody.installments);
    if (paymentBody.issuer_id !== undefined && paymentBody.issuer_id !== null) {
      paymentBody.issuer_id = String(paymentBody.issuer_id);
    }

    // 1. Creamos y guardamos la orden en la tabla 'orders' con los datos recibidos (id_client, id_address)
    const newOrder = this.ordersRepository.create(paymentBody.order);
    const savedOrder = await this.ordersRepository.save(newOrder);

    // 2. Registramos cada producto de la orden en la tabla intermedia 'order_has_products'
    for (const product of paymentBody.order.products) {
      const ohp = new OrderHasProducts();
      ohp.id_order = savedOrder.id;
      ohp.id_product = product.id;
      ohp.quantity = product.quantity;
      await this.ordersHasProductsRepository.save(ohp);
    }

    // 3. Eliminamos el objeto 'order' del cuerpo para enviar a Mercado Pago solo los datos que su API espera
    delete paymentBody.order;

    // 4. Enviamos la petición de pago a la API de Mercado Pago
    return this.httpService
      .post(MERCADO_PAGO_API + '/payments', paymentBody, {
        headers: MERCADO_PAGO_HEADERS,
      })
      .pipe(
        catchError((error: AxiosError<any>) => {
          console.error(
            'Error detallado de Mercado Pago:',
            error.response?.data || error.message,
          );
          throw new HttpException(
            error.response?.data || 'Error en el servicio de Mercado Pago',
            error.response?.status || 500,
          );
        }),
      )
      .pipe(map((resp: AxiosResponse<PaymentResponse>) => resp.data));
  }
}
