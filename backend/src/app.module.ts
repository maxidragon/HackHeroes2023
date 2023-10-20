import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { DbModule } from './db/db.module';
import { VulcanService } from './vulcan/vulcan.service';
import { VulcanController } from './vulcan/vulcan.controller';
import { VulcanModule } from './vulcan/vulcan.module';
import { TodoModule } from './todo/todo.module';
import { SettingsModule } from './settings/settings.module';
import { MailerModule } from '@nestjs-modules/mailer';

@Module({
  imports: [
    AuthModule,
    DbModule,
    VulcanModule,
    TodoModule,
    SettingsModule,
    MailerModule.forRootAsync({
      useFactory: () => ({
        transport: {
          host: process.env.SMTP_HOST,
          port: process.env.SMTP_PORT,
          secure: true,
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          },
        },
        defaults: {
          from: 'EduSphere',
        },
      }),
    }),
  ],
  providers: [VulcanService],
  controllers: [VulcanController],
})
export class AppModule {}
