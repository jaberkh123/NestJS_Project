import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { Signal, SignalDocument } from './signals.schema';
import { CreateSignalDto } from './dto/create-signal.dto';
import { UpdateSignalDto } from './dto/update-signal.dto';

@Injectable()
export class SignalsService {
  constructor(@InjectModel(Signal.name) private model: Model<SignalDocument>) {}

  create(dto: CreateSignalDto) {
    return this.model.create(dto);
  }

  findAll(filter: FilterQuery<SignalDocument> = {}, limit = 50, skip = 0) {
    return this.model.find(filter).sort({ time: -1 }).limit(limit).skip(skip).lean();
  }

  findOne(id: string) {
    return this.model.findById(id).lean();
  }

  update(id: string, dto: UpdateSignalDto) {
    return this.model.findByIdAndUpdate(id, dto, { new: true }).lean();
  }

  remove(id: string) {
    return this.model.findByIdAndDelete(id).lean();
  }
}
