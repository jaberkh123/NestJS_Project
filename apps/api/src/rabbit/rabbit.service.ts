import { Injectable, Logger } from '@nestjs/common';
import * as amqp from 'amqplib';
import { ConfigService } from '@nestjs/config';
import { SignalsService } from '../signals/signals.service';

@Injectable()
export class RabbitService {
  private readonly logger = new Logger(RabbitService.name);
  private conn!: amqp.Connection;
  private ch!: amqp.Channel;

  constructor(private cfg: ConfigService, private signals: SignalsService) {}

  async handleMessage(content: string) {
    const payload = JSON.parse(content);
    const deviceId = Object.keys(payload)[0];
    const body = payload[deviceId] || {};
    const dataArr = Array.isArray(body.data) ? body.data : [];
    const timestamp = Number(body.time) || Date.now();

    await this.signals.create({
      deviceId,
      time: timestamp,
      dataLength: dataArr.length,
      dataVolume: Buffer.byteLength(content, 'utf8'),
      meta: { sample: dataArr.slice(0, 3) },
    } as any);
  }

  async init() {
    const url = this.cfg.get<string>('RABBITMQ_URL')!;
    const queue = this.cfg.get<string>('RABBITMQ_QUEUE') || 'xray-queue';

    this.conn = await amqp.connect(url);
    this.ch = await this.conn.createChannel();
    await this.ch.assertQueue(queue, { durable: true });
    await this.ch.prefetch(10);

    this.logger.log(`RabbitMQ connected. Consuming from queue: ${queue}`);

    await this.ch.consume(
      queue,
      async (msg) => {
        if (!msg) return;
        try {
          const content = msg.content.toString();
          await this.handleMessage(content);   
          this.ch.ack(msg);
        } catch (err) {
          this.logger.error(`Consume failed: ${err}`);
          this.ch.nack(msg, false, false);
        }
      },
      { noAck: false },
    );
  }
}
