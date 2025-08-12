import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type SignalDocument = HydratedDocument<Signal>;

@Schema({ collection: 'signals', timestamps: true })
export class Signal {
  @Prop({ required: true, index: true })
  deviceId: string;

  @Prop({ required: true }) // timestamp in ms
  time: number;

  @Prop({ required: true })
  dataLength: number;

  @Prop({ required: true })
  dataVolume: number; // bytes

  @Prop({ type: Object })
  meta?: Record<string, any>;
}

export const SignalSchema = SchemaFactory.createForClass(Signal);
SignalSchema.index({ deviceId: 1, time: -1 });
