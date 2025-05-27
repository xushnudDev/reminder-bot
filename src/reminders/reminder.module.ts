import { forwardRef, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Reminders, RemindersSchema } from "./model";
import { ScheduleModule } from "@nestjs/schedule";
import { ReminderService } from "./reminder.service";
import { ReminderBot } from "src/bot/bot.update";
import { BotModule } from "src/bot/bot.module";

@Module({
    imports: [
        MongooseModule.forFeature([{name: Reminders.name,schema: RemindersSchema}]),
        ScheduleModule.forRoot(),
        forwardRef(() => BotModule),
    ],
    providers: [ReminderService,ReminderBot],
    exports: [ReminderService]
})

export class ReminderModule {}