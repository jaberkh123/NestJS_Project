import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateSignalDto {
  @ApiProperty() @IsString() deviceId: string;
  @ApiProperty({ description: 'timestamp (ms)' }) @IsNumber() time: number;
  @ApiProperty() @IsNumber() dataLength: number;
  @ApiProperty({ description: 'bytes' }) @IsNumber() dataVolume: number;
  @ApiProperty({ required: false }) @IsOptional() meta?: Record<string, any>;
}
