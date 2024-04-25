import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtAuthGuard } from './jwt.authguard';
import { Cargo } from 'src/usuario/entities/usuario.entity';

@Injectable()
export class AdminAuthGuard extends JwtAuthGuard {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> {
    const resultadoAuth = super.canActivate(context);
    if (resultadoAuth instanceof Promise) {
      return resultadoAuth.then((value) => this.verificarAcessoAdmin(context));
    } else {
      return this.verificarAcessoAdmin(context);
    }
  }

  private verificarAcessoAdmin = (context: ExecutionContext): boolean => {
    const request = context.switchToHttp().getRequest();
    const usuario = request.user;

    if (!usuario) {
      throw new UnauthorizedException(
        'Acesso não autorizado. Usuário não identificado.',
      );
    }

    if (usuario.cargo !== Cargo.ADMIN) {
      throw new UnauthorizedException('Acesso restrito a administradores.');
    }

    return true;
  };
}
