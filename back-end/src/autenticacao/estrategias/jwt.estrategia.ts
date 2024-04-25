import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtEstrategia extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: configService.get('jwt.ignorarExpiracao') === 'true',
      secretOrKey: configService.get('jwt.chaveSecreta'),
    });
  }

  async validate(payload: any) {
    return {
      email: payload.email,
      nome_usuario: payload.usuario,
      id: payload.id,
      cargo: payload.cargo,
    };
  }
}
