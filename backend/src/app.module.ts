import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { DbModule } from './db/db.module';
import { VulcanService } from './vulcan/vulcan.service';
import { VulcanController } from './vulcan/vulcan.controller';
import { VulcanModule } from './vulcan/vulcan.module';
import { TodoModule } from './todo/todo.module';
import { SettingsModule } from './settings/settings.module';

@Module({
  imports: [AuthModule, DbModule, VulcanModule, TodoModule, SettingsModule],
  providers: [VulcanService],
  controllers: [VulcanController],
})
export class AppModule {}
