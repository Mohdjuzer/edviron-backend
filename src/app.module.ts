import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OrdersModule } from './orders/orders.module';

@Module({
  imports: [
    // Load .env variables globally and make ConfigService available
    ConfigModule.forRoot({
      isGlobal: true, // Makes ConfigModule available everywhere without re-importing
    }),

    // Connect to MongoDB using the MONGODB_URI from environment variables
    // The exclamation mark asserts variable is not undefined (non-null assertion)
    MongooseModule.forRoot(process.env.MONGODB_URI!),
     OrdersModule, 
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
