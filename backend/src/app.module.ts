import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { DbModule } from './db/db.module';
import { VulcanService } from './vulcan/vulcan.service';
import { VulcanController } from './vulcan/vulcan.controller';
import { VulcanModule } from './vulcan/vulcan.module';

@Module({
  imports: [AuthModule, DbModule, VulcanModule],
  providers: [VulcanService],
  controllers: [VulcanController],
})
export class AppModule {}
