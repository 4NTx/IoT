import { Controller, Post, Body, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { AutenticacaoService } from './autenticacao.service';
import { RegistroDto } from './dto/registro.dto';
import { LoginDto } from './dto/login.dto';

@Controller('autenticacao')
export class AutenticacaoController {
  constructor(private readonly autenticacaoService: AutenticacaoService) {}

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
}
