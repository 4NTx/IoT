import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsuarioService } from 'src/usuario/usuario.service';
import { RegistroDto } from './dto/registro.dto';
import { LoginDto } from './dto/login.dto';
import { JwtPayload } from './autenticacao.interface';
import * as bcrypt from 'bcryptjs';
import { Cargo, Usuario } from '../usuario/entities/usuario.entity';
import { ConfigService } from '@nestjs/config';
import { UsuarioSemSenha } from './autenticacao.interface';
import { EmailService } from 'src/email/email.service';

@Injectable()
export class AutenticacaoService {
  constructor(
    private usuarioService: UsuarioService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private emailService: EmailService,
  ) { }

  async registrar(registroDto: RegistroDto): Promise<UsuarioSemSenha> {
    const saltRounds = parseInt(this.configService.get<string>('seguranca.saltRounds'));
    const senhaHashed = await bcrypt.hash(registroDto.senha, saltRounds);
    const usuarioCriado = await this.usuarioService.create({
      ...registroDto,
      senha: senhaHashed,
      cargo: Cargo.USUARIO,
    });
    this.emailService.enviarEmail(
      'boasVindas.hbs',
      { nome: usuarioCriado.nome_usuario },
      { to: usuarioCriado.email }
    );
    return this.eliminarDadosSensiveis(usuarioCriado);
  }

  async login(loginDto: LoginDto): Promise<{ access_token: string }> {
    const usuario = await this.usuarioService.encontrarPorLogin(loginDto);
    if (!usuario || !(await this.compararSenhas(loginDto.senha, usuario.senha))) {
      throw new UnauthorizedException('Credenciais inválidas');
    }
    const payload: JwtPayload = this.criarPayloadJwt(usuario);
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async compararSenhas(senhaNormal: string, senhaHashed: string): Promise<boolean> {
    return await bcrypt.compare(senhaNormal, senhaHashed);
  }

  private criarPayloadJwt(usuario: Usuario): JwtPayload {
    return {
      email: usuario.email,
      nome_usuario: usuario.nome_usuario,
      id: usuario.id,
      cargo: usuario.cargo,
    };
  }

  async eliminarDadosSensiveis(usuario: Usuario): Promise<UsuarioSemSenha> {
    const { senha, ...usuarioSemSenha } = usuario;
    return usuarioSemSenha;
  }
}
