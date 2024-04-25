import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { UsuarioModule } from './usuario/usuario.module';
import { AutenticacaoModule } from './autenticacao/autenticacao.module';
import { ConfigService, ConfigModule } from '@nestjs/config';
import * as yaml from 'js-yaml';
import * as fs from 'fs';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [() => yaml.load(fs.readFileSync('config.yml', 'utf8'))],
      ignoreEnvFile: true,
    }),
    TypeOrmModule.forRootAsync({
      useFactory: (config: ConfigService) => ({
        type: config.get('bancoDeDados.tipo', 'mariadb'),
        host: config.get('bancoDeDados.host', 'localhost'),
        port: +config.get<number>('bancoDeDados.porta', 3306),
        username: config.get<string>('bancoDeDados.usuario', 'root'),
        password: config.get<string>('bancoDeDados.senha', 'root'),
        database: config.get<string>('bancoDeDados.nome', 'nestjs'),
        entities: ['dist/**/*.entity{.ts,.js}'],
        synchronize: config.get<boolean>('bancoDeDados.sincronizar', false),
        logger: config.get<string>('bancoDeDados.loggerTipo', 'advanced-console'),
        timezone: config.get<string>('bancoDeDados.timezone', '-03:00'),
        logging: config.get<boolean>('bancoDeDados.logger', false),
      }) as TypeOrmModuleOptions,
      inject: [ConfigService],
    }),
    UsuarioModule,
    AutenticacaoModule],
  controllers: [AppController],
  providers: [
    AppService
  ],
})
export class AppModule { }