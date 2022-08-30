import { Module } from '@nestjs/common';
import { BreedsService } from './breeds.service';
import { BreedsController } from './breeds.controller';
import { Breed, BreedSchema } from 'src/schemas/breed.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Breed.name, schema: BreedSchema }]),
  ],
  controllers: [BreedsController],
  providers: [BreedsService],
})
export class BreedsModule {}
