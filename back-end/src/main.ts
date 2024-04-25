import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as morgan from 'morgan';
import helmet from 'helmet';
import * as bodyParser from 'body-parser';
import { ValidationPipe, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      disableErrorMessages: false,
      exceptionFactory: (errors) => new BadRequestException(errors),
    }),
  );

  app.use(bodyParser.json({ limit: '50mb' }));
  app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
  app.use(helmet());
  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    preflightContinue: false,
    allowedHeaders:
      'Authorization, Origin, X-Requested-With, Content-Type, Accept, Recaptcha',
    credentials: true,
  });

  app.use(morgan('combined'));

  const porta = configService.get<number>('aplicacao.porta') || 3000;
  await app.listen(porta, '0.0.0.0');
  console.log(
    `😉 A Aplicação está rodando em \x1b[1m\x1b[35m${await app.getUrl()}\x1b[0m`,
  );
}
bootstrap();
