import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ProducerService } from './producer.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const producer = app.get(ProducerService);
  await producer.run();     // یک‌بار ارسال؛ برای ارسال پیوسته بعداً تایمر می‌ذاریم
  await app.close();
}
bootstrap();
