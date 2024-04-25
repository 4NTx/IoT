import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtAuthGuard } from './jwt.authguard';
import { Cargo } from 'src/usuario/entities/usuario.entity';

@Injectable()
export class EditorAuthGuard extends JwtAuthGuard {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> {
    const resultadoAuth = super.canActivate(context);
    if (resultadoAuth instanceof Promise) {
      return resultadoAuth.then((value) => this.verificarAcessoEditor(context));
    } else {
      return this.verificarAcessoEditor(context);
    }
  }

  private verificarAcessoEditor = (context: ExecutionContext): boolean => {
    const request = context.switchToHttp().getRequest();
    const usuario = request.user;

    if (!usuario) {
      throw new UnauthorizedException(
        'Acesso não autorizado. Usuário não identificado.',
      );
    }

    if (usuario.cargo !== Cargo.EDITOR && usuario.cargo !== Cargo.ADMIN) {
      throw new UnauthorizedException(
        'Acesso restrito a editores ou administradores.',
      );
    }

    return true;
  };
}
