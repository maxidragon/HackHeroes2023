import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { DbModule } from './db/db.module';
import { VulcanService } from './vulcan/vulcan.service';
import { VulcanController } from './vulcan/vulcan.controller';
import { VulcanModule } from './vulcan/vulcan.module';
import { TodoModule } from './todo/todo.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { UserModule } from './user/user.module';
import { FlashcardModule } from './flashcard/flashcard.module';
import { NotesModule } from './notes/notes.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    AuthModule,
    DbModule,
    VulcanModule,
    TodoModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
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
    UserModule,
    FlashcardModule,
    NotesModule,
  ],
  providers: [VulcanService],
  controllers: [VulcanController],
})
export class AppModule {}
