import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ConfigModule } from 'src/config/app-custom-module.config';
import { AppEnvConfigService } from 'src/config/environment-variables/app-env.config';

@Global()
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule], // Import the module that provides AppConfigService
      useFactory: (config: AppEnvConfigService) => ({
        type: 'postgres',
        port: config.pgDBPort,
        host: config.dbHost,
        username: config.dbUsername,
        password: config.dbPassword,
        database: config.dbName,
        autoLoadEntities: true,
        synchronize: false,
        // synchronize: config.dbSynchronize,
        // logging: true,
      }),
      inject: [AppEnvConfigService], // Inject AppConfigService
    }),
  ],
})
export class DatabaseModule {}
