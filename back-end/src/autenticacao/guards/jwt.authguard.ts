import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  private readonly logger = new Logger(JwtAuthGuard.name);

  canActivate(context: ExecutionContext): boolean | Promise<boolean> {
    return super.canActivate(context) as boolean | Promise<boolean>;
  }

  handleRequest(erro, usuario, info) {
    if (erro || !usuario) {
      this.logger.error(
        `Autenticação falhou: ${erro?.message || info?.message}`,
      );
      throw new UnauthorizedException(
        'Acesso não autorizado. Por favor, autentique-se.',
      );
    }
    return usuario;
  }
}
