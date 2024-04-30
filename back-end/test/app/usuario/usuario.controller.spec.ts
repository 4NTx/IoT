import { Test, TestingModule } from '@nestjs/testing';
import { UsuarioController } from '../../../src/usuario/usuario.controller';

describe('UsuarioController', () => {
    let controller: UsuarioController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [UsuarioController],
        }).compile();

        controller = module.get<UsuarioController>(UsuarioController);
    });

    it('deve estar definido', () => {
        expect(controller).toBeDefined();
    });

});
