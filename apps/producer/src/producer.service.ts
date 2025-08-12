import { Injectable, Logger } from '@nestjs/common';
import * as amqp from 'amqplib';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class ProducerService {
  private readonly logger = new Logger(ProducerService.name);

  async run() {
    const url = process.env.RABBITMQ_URL || 'amqp://localhost:5672';
    const queue = process.env.RABBITMQ_QUEUE || 'xray-queue';
    const file = process.env.SAMPLE_PATH || path.join(__dirname, '..', 'data', 'sample.json');

    const raw = fs.readFileSync(file, 'utf8');
    const payload = JSON.parse(raw);

    const conn = await amqp.connect(url);
    const ch = await conn.createChannel();
    await ch.assertQueue(queue, { durable: true });

    // چند پیام برای دمو
    for (let i = 0; i < 3; i++) {
      ch.sendToQueue(queue, Buffer.from(JSON.stringify(payload)), { persistent: true });
      this.logger.log(`message ${i + 1} sent -> ${queue}`);
    }

    await ch.close();
    await conn.close();
  }
}
