import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
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
import { RedefinirSenhaDto } from './dto/redefinir-senha.dto';
import { EsqueciSenhaDto } from './dto/esqueci-senha.dto';
import { LoginUsuarioDto } from '@/usuario/dto/login-usuario.dto';
import { v4 as uuidv4 } from 'uuid';

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
    const urlCompleta = `${this.configService.get<string>('aplicacao.url')}:${this.configService.get<string>('aplicacao.porta')}`;
    const usuarioCriado = await this.usuarioService.create({
      ...registroDto,
      senha: senhaHashed,
      cargo: Cargo.USUARIO,
    });
    this.emailService.enviarEmail(
      'boasVindas.hbs',
      { nome: usuarioCriado.nome_usuario, url: urlCompleta },
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

  async solicitarRecuperacaoSenha(esqueciSenhaDto: EsqueciSenhaDto): Promise<void> {
    const loginDto = new LoginUsuarioDto();
    loginDto.login = esqueciSenhaDto.login;

    const usuario = await this.usuarioService.encontrarPorLogin(loginDto);
    if (!usuario) {
      throw new NotFoundException('Usuário não encontrado.');
    }

    const novoUUID = uuidv4();
    usuario.recuperacaoSenhaUUID = novoUUID;
    await this.usuarioService.atualizarUsuario(usuario);

    const urlCompleta = `${this.configService.get<string>('aplicacao.url')}:${this.configService.get<string>('aplicacao.porta')}`;

    this.emailService.enviarEmail(
      'recuperacaoSenha.hbs',
      { nome: usuario.nome_usuario, token: novoUUID, url: urlCompleta },
      { to: usuario.email }
    );
  }

  async redefinirSenha(redefinirSenhaDto: RedefinirSenhaDto): Promise<void> {
    const { token, novaSenha } = redefinirSenhaDto;

    const usuario = await this.usuarioService.procurarPorRecuperacaoUUID(token);
    if (!usuario) {
      throw new NotFoundException('Token inválido ou expirado.');
    }

    const senhaAtualIgual = await this.compararSenhas(novaSenha, usuario.senha);
    if (senhaAtualIgual) {
      throw new BadRequestException('A nova senha não pode ser igual à senha atual.');
    }

    const saltRounds = parseInt(this.configService.get<string>('seguranca.saltRounds'));
    const senhaHashed = await bcrypt.hash(novaSenha, saltRounds);
    usuario.senha = senhaHashed;
    usuario.recuperacaoSenhaUUID = uuidv4();
    await this.usuarioService.atualizarUsuario(usuario);
  }
}
