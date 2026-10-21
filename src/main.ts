import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

// Punto de entrada de la aplicación: crea la app Nest y la pone a escuchar peticiones HTTP.
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Valida automáticamente todos los DTO con los decoradores de class-validator.
  // forbidUnknownValues: false evita rechazar objetos que no son instancias de una clase DTO.
  app.useGlobalPipes(new ValidationPipe({ forbidUnknownValues: false }));
  // Puerto definido en la variable de entorno PORT; 3000 si no existe.
  await app.listen(process.env.PORT ?? 3000);
  // await app.listen(3000, process.env.HOST || 'localhost');
}
bootstrap();
