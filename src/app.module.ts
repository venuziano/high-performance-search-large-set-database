import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { DatabaseModule } from './database/database.module';
import { BookModule } from './book/book.module';

@Module({
  imports: [
    // External Modules
    ConfigModule.forRoot(),

    // Application Modules
    BookModule,

    // Config modules
    DatabaseModule,
  ],
})
export class AppModule {}
