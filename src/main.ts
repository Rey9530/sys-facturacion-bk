import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { TransformInterceptor } from './common/intersectors';
import { ConfigService } from '@nestjs/config';
import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { HEADER_API_BEARER_AUTH } from './common/const';
import { AllExceptionFilter } from './common/filters';

let PORT = 3000;
let APP_URL = 'http://localhost';
const logger = new Logger('HOSPITAL_PEDIATRICO');
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new AllExceptionFilter());
  app.useGlobalInterceptors(new TransformInterceptor()); 
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('HOSPITAL PEDIATRICO')
    .setDescription('HOSPITAL PEDIATRICO APIs')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Ingrese el token JWT',
        in: 'header',
      },
      HEADER_API_BEARER_AUTH,
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      filter: true,
    },
  });
  app.enableCors();

  PORT = app.get(ConfigService).get('PORT') ?? PORT;
  APP_URL = app.get(ConfigService).get('APP_URL') ?? APP_URL;
  await app.listen(PORT);
}
bootstrap()
  .then(() => logger.log('START API : ' + APP_URL + ':' + PORT))
  .then(() => logger.log('API DOC START : ' + APP_URL + ':' + PORT + '/api'))
  .catch((error) => logger.error('Error: ', error));
