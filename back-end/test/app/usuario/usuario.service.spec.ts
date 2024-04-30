
import { Test, TestingModule } from '@nestjs/testing';
import { UsuarioService } from '../../../src/usuario/usuario.service';
import { Cargo, Usuario } from '../../../src/usuario/entities/usuario.entity';
import { CriarUsuarioDto } from '../../../src/usuario/dto/criar-usuario.dto';
import { LoginUsuarioDto } from '../../../src/usuario/dto/login-usuario.dto';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('UsuarioService', () => {
    let service: UsuarioService;
    let usuarioRepository: Repository<Usuario>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UsuarioService,
                {
                    provide: getRepositoryToken(Usuario),
                    useClass: Repository,
                },
            ],
        }).compile();

        service = module.get<UsuarioService>(UsuarioService);
        usuarioRepository = module.get<Repository<Usuario>>(getRepositoryToken(Usuario));
    });

    describe('create', () => {
        it('deve criar e salvar um novo usuario', async () => {
            const criarUsuarioDto: CriarUsuarioDto = {
                nome_usuario: 'UsuarioTeste',
                email: 'teste@exemplo.com',
                senha: 'senha123',
                cargo: Cargo.USUARIO,
            };

            jest.spyOn(usuarioRepository, 'findOne').mockResolvedValue(null);
            jest.spyOn(usuarioRepository, 'create').mockReturnValue(criarUsuarioDto as unknown as Usuario);
            jest.spyOn(usuarioRepository, 'save').mockResolvedValue(criarUsuarioDto as unknown as Usuario);

            const result = await service.create(criarUsuarioDto);

            expect(result).toBe(criarUsuarioDto);
            expect(usuarioRepository.create).toHaveBeenCalledWith(criarUsuarioDto);
            expect(usuarioRepository.save).toHaveBeenCalledWith(criarUsuarioDto);
        });

        it('deve lançar BadRequestException se o usuario já existir', async () => {
            const criarUsuarioDto: CriarUsuarioDto = {
                nome_usuario: 'UsuarioTeste',
                email: 'teste@exemplo.com',
                senha: 'senha123',
                cargo: Cargo.USUARIO,
            };

            const usuarioExistente: Usuario = {
                id: 1,
                nome_usuario: 'UsuarioTeste',
                email: 'teste@exemplo.com',
                senha: 'hashedsenha123',
                cargo: Cargo.USUARIO,
            } as Usuario;

            jest.spyOn(usuarioRepository, 'findOne').mockResolvedValue(usuarioExistente);

            await expect(service.create(criarUsuarioDto)).rejects.toThrow(BadRequestException);
        });
    });

    describe('encontrarPorLogin', () => {
        it('deve retornar o usuario se encontrado', async () => {
            const loginDto: LoginUsuarioDto = {
                login: 'UsuarioTeste',
                senha: 'senha123',
            };

            const usuarioMock = {
                id: 1,
                nome_usuario: 'UsuarioTeste',
                email: 'teste@exemplo.com',
                senha: 'hashedsenha123',
            } as Usuario;

            jest.spyOn(usuarioRepository, 'findOne').mockResolvedValue(usuarioMock);

            const result = await service.encontrarPorLogin(loginDto);

            expect(result).toBe(usuarioMock);
        });

        it('deve lançar NotFoundException se o usuario não for encontrado', async () => {
            const loginDto: LoginUsuarioDto = {
                login: 'UsuarioTeste',
                senha: 'senha123',
            };

            jest.spyOn(usuarioRepository, 'findOne').mockResolvedValue(undefined);

            await expect(service.encontrarPorLogin(loginDto)).rejects.toThrow(NotFoundException);
        });
    });

    describe('procurarPorID', () => {
        it('deve retornar o usuario se encontrado', async () => {
            const usuarioMock = {
                id: 1,
                nome_usuario: 'UsuarioTeste',
                email: 'teste@exemplo.com',
                senha: 'senhaHashed123',
            } as Usuario;

            jest.spyOn(usuarioRepository, 'findOne').mockResolvedValue(usuarioMock);

            const result = await service.procurarPorID(1);

            expect(result).toBe(usuarioMock);
        });

        it('deve lançar NotFoundException se o usuario não for encontrado', async () => {
            jest.spyOn(usuarioRepository, 'findOne').mockResolvedValue(undefined);

            await expect(service.procurarPorID(1)).rejects.toThrow(NotFoundException);
        });
    });
});
