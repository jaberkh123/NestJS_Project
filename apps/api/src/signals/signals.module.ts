import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SignalsController } from './signals.controller';
import { SignalsService } from './signals.service';
import { Signal, SignalSchema } from './signals.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Signal.name, schema: SignalSchema }])],
  controllers: [SignalsController],
  providers: [SignalsService],
  exports: [SignalsService], // برای استفاده در RabbitMQ در گام بعدی
})
export class SignalsModule {}
