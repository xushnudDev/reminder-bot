import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TelegrafModule } from 'nestjs-telegraf';
import { BotModule } from './bot/bot.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ReminderModule } from './reminders/reminder.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.MONGO_DB_URI as string),
    
    TelegrafModule.forRoot({
      token: process.env.BOT_TOKEN as string,
    }),
    ReminderModule,
    BotModule,
  ],
  
})
export class AppModule {}
