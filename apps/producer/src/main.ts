import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ProducerService } from './producer.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const svc = app.get(ProducerService);

  const mode = process.env.PRODUCER_MODE || 'loop';     // 'loop' یا 'once'
  const interval = Number(process.env.INTERVAL_MS ?? 10000); // پیش‌فرض 10s

  if (mode === 'loop') {
    const tick = async () => {
      try { await svc.run(); } catch (e) { console.error('send failed:', e); }
    };
    await tick();                            // اولین ارسال
    const timer = setInterval(tick, interval);

    const shutdown = async () => { clearInterval(timer); await app.close(); process.exit(0); };
    process.on('SIGINT', shutdown);
    process.on('SIGTERM', shutdown);
  } else {
    await svc.run();                          // فقط یک‌بار
    await app.close();
  }
}
bootstrap();
