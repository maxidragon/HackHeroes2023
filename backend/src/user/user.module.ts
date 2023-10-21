import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { SettingsModule } from './settings/settings.module';

@Module({
  imports: [SettingsModule],
  providers: [UserService],
  controllers: [UserController],
})
export class UserModule {}
