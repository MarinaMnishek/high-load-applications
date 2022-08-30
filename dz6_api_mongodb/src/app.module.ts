import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BreedsModule } from './breeds/breeds.module';

@Module({
  imports: [BreedsModule, MongooseModule.forRoot('mongodb://localhost/nest')],
  // imports: [BreedsModule, MongooseModule.forRoot('mongodb+srv://Mnishek:Djkuj64ljycr@cluster0.hyu3avu.mongodb.net/nestjs')],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
