import { Cargo } from 'src/usuario/entities/usuario.entity';

export interface UsuarioSemSenha {
  id: number;
  email: string;
  nome_usuario: string;
  cargo: Cargo;
}

export interface JwtPayload {
  email: string;
  nome_usuario: string;
  id: number;
  cargo: string;
}
