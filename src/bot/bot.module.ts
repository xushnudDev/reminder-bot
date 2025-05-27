import { forwardRef, Module } from "@nestjs/common";
import { ReminderBot } from "./bot.update";
import { ReminderModule } from "src/reminders/reminder.module";

@Module({
    imports: [forwardRef(() => ReminderModule)],
    providers: [ReminderBot],
    exports: [ReminderBot]
})
export class BotModule {}