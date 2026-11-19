import { Controller, Get } from '@nestjs/common';

@Controller('health')
export class HealthController {
  @Get()
  check() {
    return {
      status: 'ok',
      service: 'brakebit-api',
      timestamp: new Date().toISOString(),
    };
  }
}
