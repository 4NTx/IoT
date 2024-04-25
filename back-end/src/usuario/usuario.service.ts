import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from './entities/usuario.entity';
import { CriarUsuarioDto } from './dto/criar-usuario.dto';
import { LoginUsuarioDto } from './dto/login-usuario.dto';

@Injectable()
export class UsuarioService {
  constructor(
    @InjectRepository(Usuario)
    private usuarioRepository: Repository<Usuario>,
  ) { }

  async create(criarUsuarioDto: CriarUsuarioDto): Promise<Usuario> {
    await this.verificarDuplicidade(criarUsuarioDto);
    const usuario = this.usuarioRepository.create(criarUsuarioDto);
    return this.usuarioRepository.save(usuario);
  }

  async encontrarPorLogin(loginDto: LoginUsuarioDto): Promise<Usuario> {
    const usuario = await this.obterUsuarioPorLogin(loginDto);
    if (!usuario) {
      throw new NotFoundException(
        `Usuário com login '${loginDto.login}' não encontrado.`,
      );
    }
    return usuario;
  }

  private async verificarDuplicidade(
    criarUsuarioDto: CriarUsuarioDto,
  ): Promise<void> {
    const { nome_usuario, email } = criarUsuarioDto;
    const usuarioExistente = await this.usuarioRepository.findOne({
      where: [{ nome_usuario }, { email }],
    });

    if (usuarioExistente) {
      throw new BadRequestException(
        'O nome de usuário ou e-mail já está em uso.',
      );
    }
  }

  private async obterUsuarioPorLogin(
    loginDto: LoginUsuarioDto,
  ): Promise<Usuario | undefined> {
    const { login } = loginDto;
    return this.usuarioRepository.findOne({
      where: [{ nome_usuario: login }, { email: login }],
    });
  }

  async procurarPorID(id: number): Promise<Usuario> {
    const usuario = await this.usuarioRepository.findOne({ where: { id } });
    if (!usuario) {
      throw new NotFoundException(`Usuário com ID '${id}' não encontrado.`);
    }
    return usuario;
  }
}
