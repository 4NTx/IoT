import { Controller, Post, Body, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { AutenticacaoService } from './autenticacao.service';
import { RegistroDto } from './dto/registro.dto';
import { LoginDto } from './dto/login.dto';
import { RedefinirSenhaDto } from './dto/redefinir-senha.dto';
import { EsqueciSenhaDto } from './dto/esqueci-senha.dto';

@Controller('autenticacao')
export class AutenticacaoController {
  constructor(private readonly autenticacaoService: AutenticacaoService) { }

  @UseGuards()
  @Post('registro')
  @HttpCode(HttpStatus.CREATED)
  async registrar(@Body() registroDto: RegistroDto) {
    const usuario = await this.autenticacaoService.registrar(registroDto);
    return { usuario, mensagem: 'Registro realizado com sucesso.' };
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto) {
    const token = await this.autenticacaoService.login(loginDto);
    return { token, mensagem: 'Login realizado com sucesso.' };
  }

  @Post('solicitar-recuperacao-senha')
  @HttpCode(HttpStatus.OK)
  async solicitarRecuperacaoSenha(@Body() esqueciSenhaDto: EsqueciSenhaDto) {
    await this.autenticacaoService.solicitarRecuperacaoSenha(esqueciSenhaDto);
    return { mensagem: 'E-mail de recuperação de senha enviado com sucesso.' };
  }

  @Post('redefinir-senha')
  @HttpCode(HttpStatus.OK)
  async redefinirSenha(@Body() redefinirSenhaDto: RedefinirSenhaDto) {
    await this.autenticacaoService.redefinirSenha(redefinirSenhaDto);
    return { mensagem: 'Senha redefinida com sucesso.' };
  }
}
