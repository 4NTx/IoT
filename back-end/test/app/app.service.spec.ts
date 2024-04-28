import { Test, TestingModule } from '@nestjs/testing';
import { AppService } from '../../src/app.service';

describe('AppService', () => {
    let service: AppService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [AppService],
        }).compile();

        service = module.get<AppService>(AppService);
    });

    it('deve estar definido', () => {
        expect(service).toBeDefined();
    });

    it('deve retornar "Hello World!" ao chamar getHello()', () => {
        expect(service.getHello()).toBe('Hello World!');
    });
});
