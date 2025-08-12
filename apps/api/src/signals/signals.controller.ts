import { Controller, Get, Post, Body, Param, Query, Patch, Delete } from '@nestjs/common';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { SignalsService } from './signals.service';
import { CreateSignalDto } from './dto/create-signal.dto';
import { UpdateSignalDto } from './dto/update-signal.dto';

@ApiTags('signals')
@Controller('signals')
export class SignalsController {
  constructor(private readonly service: SignalsService) {}

  @Post()
  create(@Body() dto: CreateSignalDto) {
    return this.service.create(dto);
  }

  // optional filters: deviceId, from, to, limit, skip
  @Get()
  @ApiQuery({ name: 'deviceId', required: false })
  @ApiQuery({ name: 'from', required: false, description: 'timestamp ms' })
  @ApiQuery({ name: 'to', required: false, description: 'timestamp ms' })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'skip', required: false })
  findAll(
    @Query('deviceId') deviceId?: string,
    @Query('from') from?: string,
    @Query('to') to?: string,
    @Query('limit') limit = '50',
    @Query('skip') skip = '0',
  ) {
    const filter: any = {};
    if (deviceId) filter.deviceId = deviceId;
    if (from || to) {
      filter.time = {};
      if (from) filter.time.$gte = Number(from);
      if (to) filter.time.$lte = Number(to);
    }
    return this.service.findAll(filter, Number(limit), Number(skip));
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateSignalDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
