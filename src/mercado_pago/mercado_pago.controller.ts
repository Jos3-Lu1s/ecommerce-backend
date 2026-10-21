import {
  Controller,
  UseGuards,
  Put,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
  Param,
  Body,
  ParseIntPipe,
  Post,
  Get,
  Delete,
  UploadedFiles,
} from '@nestjs/common';
import { HasRoles } from '../auth/jwt/has-roles';
import { JwtRole } from '../auth/jwt/jwt-role';
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard';
import { JwtRolesGuard } from '../auth/jwt/jwt-roles.guard';
import { MercadoPagoService } from './mercado_pago.service';
import type { CardTokenBody } from './models/card_token_body';
import type { PaymentBody } from './models/payment_body';

// Prefijo de ruta base: http://localhost:3000/mercadopago
@Controller('mercadopago')
export class MercadoPagoController {
  constructor(private mercadoPagoService: MercadoPagoService) {}

  // GET http://localhost:3000/mercadopago/identification_types
  // Consulta los tipos de identificación válidos de Mercado Pago (ej. CC, DNI, RFC)
  @HasRoles(JwtRole.ADMIN, JwtRole.CLIENT)
  @UseGuards(JwtAuthGuard, JwtRolesGuard)
  @Get('identification_types')
  getIdentificationTypes() {
    return this.mercadoPagoService.getIdentificationTypes();
  }

  // GET http://localhost:3000/mercadopago/installments/:first_six_digits/:amount
  // Consulta las opciones de cuotas disponibles para una tarjeta según los primeros 6 dígitos y el monto
  @HasRoles(JwtRole.ADMIN, JwtRole.CLIENT)
  @UseGuards(JwtAuthGuard, JwtRolesGuard)
  @Get('installments/:first_six_digits/:amount')
  getInstallments(
    @Param('first_six_digits') firstSixDigits: number,
    @Param('amount') amount: number,
  ) {
    console.log('firstSixDigits', firstSixDigits);
    console.log('amount', amount);

    return this.mercadoPagoService.getInstallments(firstSixDigits, amount);
  }

  // POST http://localhost:3000/mercadopago/card_token
  // Genera el token seguro de la tarjeta de crédito/débito directamente con Mercado Pago
  @HasRoles(JwtRole.ADMIN, JwtRole.CLIENT)
  @UseGuards(JwtAuthGuard, JwtRolesGuard)
  @Post('card_token')
  createCardToken(@Body() cardTokenBody: CardTokenBody) {
    return this.mercadoPagoService.createCardToken(cardTokenBody);
  }

  // POST http://localhost:3000/mercadopago/payments
  // Guarda la orden en la BD (orders y order_has_products) y procesa el cobro en Mercado Pago
  @HasRoles(JwtRole.ADMIN, JwtRole.CLIENT)
  @UseGuards(JwtAuthGuard, JwtRolesGuard)
  @Post('payments')
  createPayment(@Body() paymentBody: PaymentBody) {
    return this.mercadoPagoService.createPayment(paymentBody);
  }
}
