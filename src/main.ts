import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigKey } from './common/config';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.enableCors({
        origin: '*',
    });
    const configService = app.get(ConfigService);
    await app.listen(configService.get(ConfigKey.PORT));
}
bootstrap();
