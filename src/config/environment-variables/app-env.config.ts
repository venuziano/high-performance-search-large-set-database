import { Global, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Global()
@Injectable()
export class AppEnvConfigService {
  constructor(private configService: ConfigService) {}

  get apiPort(): number {
    return this.configService.get<number>('API_PORT', 3010);
  }

  get pgDBType(): string {
    return this.configService.get<string>('PG_TYPE', 'postgres');
  }

  get dbHost(): string {
    return this.configService.get<string>('HOST', 'host.docker.internal');
  }

  get pgDBPort(): number {
    return this.configService.get<number>('PG_PORT', 5432);
  }

  get dbUsername(): string {
    return this.configService.get<string>('USERNAME');
  }

  get dbName(): string {
    return this.configService.get<string>('DATABASE');
  }

  get dbPassword(): string {
    return this.configService.get<string>('PASSWORD');
  }
}
