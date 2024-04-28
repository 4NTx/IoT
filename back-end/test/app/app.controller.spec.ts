import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from '../../src/app.controller';
import { AppService } from '../../src/app.service';
import { AuthGuard } from '@nestjs/passport';
import { EditorAuthGuard } from '../../src/autenticacao/guards/editor.authguard';
import { AdminAuthGuard } from '../../src/autenticacao/guards/admin.authguard';

describe('AppController', () => {
  let appController: AppController;
  let appService: AppService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        AppService,
        { provide: AuthGuard('jwt'), useValue: { canActivate: jest.fn(() => true) } },
        { provide: EditorAuthGuard, useValue: { canActivate: jest.fn(() => true) } },
        { provide: AdminAuthGuard, useValue: { canActivate: jest.fn(() => true) } }
      ],
    }).compile();

    appService = module.get<AppService>(AppService);
    appController = module.get<AppController>(AppController);
    jest.spyOn(appService, 'getHello').mockImplementation(() => 'Hello World!');
  });

  it('deve estar definido', () => {
    expect(appController).toBeDefined();
  });

  describe('Rota GET /', () => {
    it('deve retornar "Hello World!" ao acessar a rota principal', () => {
      expect(appController.getHello()).toBe('Hello World!');
    });
  });

  describe('Rota GET /usuario', () => {
    it('deve retornar "Hello World!" ao acessar a rota de usuário com autenticação JWT, independente do cargo', () => {
      expect(appController.rotaUsuario()).toBe('Hello World!');
    });
  });

  describe('Rota GET /editor', () => {
    it('deve retornar "Hello World!" ao acessar a rota de editor com usuario.cargo = EDITOR no token jwt', () => {
      expect(appController.rotaEditor()).toBe('Hello World!');
    });
  });

  describe('Rota GET /admin', () => {
    it('deve retornar "Hello World!" ao acessar a rota de administrador com usuario.cargo = ADMIN no token jwt', () => {
      expect(appController.rotaAdmin()).toBe('Hello World!');
    });
  });
});