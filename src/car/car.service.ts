import { Injectable } from '@nestjs/common'

import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { car } from '~/car/entities/car'

import { UpdateCarDto } from './dto/update-car.dto'

@Injectable()
export class CarService {
  constructor(
    @InjectRepository(car)
    private carRepository: Repository<car>,
  ) {}

  create(createCarDto: car) {
    this.carRepository.save(car)
  }

  findAll() {
    return `This action returns all car`
  }

  findOne(id: number) {
    return `This action returns a #${id} car`
  }

  update(id: number, updateCarDto: UpdateCarDto) {
    return `This action updates a #${id} car`
  }

  remove(id: number) {
    return `This action removes a #${id} car`
  }
}
