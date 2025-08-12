import { Module, OnModuleInit } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RabbitService } from './rabbit.service';
import { SignalsModule } from '../signals/signals.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), SignalsModule],
  providers: [RabbitService],
})
export class RabbitModule implements OnModuleInit {
  constructor(private readonly rabbit: RabbitService) {}
  async onModuleInit() {
    await this.rabbit.init();
  }
}
