import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import * as fs from 'fs-extra';

@Injectable()
export class AppInitService implements OnModuleInit {
    private readonly logger = new Logger();
    async onModuleInit() {
        const srcPath = 'src/email/templates';
        const destPath = 'dist/email/templates';
        const existente = await fs.pathExists(destPath);
        if (!existente) {
            try {
                await fs.copy(srcPath, destPath);
                this.logger.log('\x1b[33m[EMAIL] \x1b[35mTemplates copiadas com sucesso para o diretório final.');
            } catch (error) {
                this.logger.error('\x1b[33m[EMAIL] \x1b[31mErro ao copiar templates.', error);
            }
        }
    }
}
