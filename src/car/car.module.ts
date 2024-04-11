import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';

import { car } from '~/car/entities/car';

import { CarController } from './car.controller';
import { CarService } from './car.service';

@Module({
  imports: [TypeOrmModule.forFeature([car])],
  controllers: [CarController],
  providers: [CarService],
})
export class CarModule {}
