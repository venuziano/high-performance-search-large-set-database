import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import Joi from 'joi';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      cache: true,
      validationSchema: Joi.object({
        API_PORT: Joi.number().required(),
        PG_TYPE: Joi.string().required(),
        HOST: Joi.string().required(),
        PG_PORT: Joi.number().required(),
        USERNAME: Joi.string().required(),
        PASSWORD: Joi.string().required(),
        DATABASE: Joi.string().required(),
      }),
    }),
  ],
})
export class AppModule {}
