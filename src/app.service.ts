import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    console.log('anything v31');

    return 'Hello World! v23121 x';
  }
}
