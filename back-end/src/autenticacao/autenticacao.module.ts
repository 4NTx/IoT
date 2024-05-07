import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AutenticacaoService } from './autenticacao.service';
import { AutenticacaoController } from './autenticacao.controller';
import { UsuarioModule } from 'src/usuario/usuario.module';
import { JwtEstrategia } from './estrategias/jwt.estrategia';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Usuario } from '../usuario/entities/usuario.entity';
import { EmailService } from 'src/email/email.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Usuario]),
    UsuarioModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('jwt.chaveSecreta'),
        signOptions: {
          expiresIn: configService.get<string>('jwt.expiraEm', '1d'),
        },
      }),
    }),
  ],
  providers: [AutenticacaoService, JwtEstrategia, EmailService],
  controllers: [AutenticacaoController],
})
export class AutenticacaoModule { }