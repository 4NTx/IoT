import { Injectable, NestMiddleware } from '@nestjs/common';
import * as fs from 'fs-extra';

@Injectable()
export class CopiarTemplateMiddleWare implements NestMiddleware {
    async use(req: any, res: any, next: () => void) {
        const srcPath = 'src/email/templates';
        const destPath = 'dist/email/templates';

        const existente = await fs.pathExists(destPath);

        if (!existente) {
            try {
                await fs.copy(srcPath, destPath);
                console.log('Templates copiadas com sucesso.');
            } catch (error) {
                console.error('Erro ao copiar templates.', error);
            }
        }

        next();
    }
}