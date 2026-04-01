import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // 1. 开启跨域，允许前端访问
  app.enableCors({
    origin: 'http://localhost:5173', // 前端地址
    credentials: true
  });
  await app.listen(3000);
  console.log('后端服务已启动，端口：3000')
}
bootstrap();