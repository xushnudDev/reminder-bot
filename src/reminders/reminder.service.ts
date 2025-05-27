import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Reminders } from './model';
import { Model } from 'mongoose';
import { InjectBot } from 'nestjs-telegraf'; // ✅ Shu joyni qo‘shing
import { Telegraf } from 'telegraf';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class ReminderService {
  constructor(
    @InjectModel(Reminders.name) private reminderModel: Model<Reminders>,
    @InjectBot() private readonly bot: Telegraf<any>, // ✅ endi ishlaydi
  ) {}

  async createReminder(chatId: number, timeStr: string, message: string) {
    let time: Date;

    if (/\d+[mhd]/.test(timeStr)) {
      const unit = timeStr.slice(-1);
      const amount = parseInt(timeStr.slice(0, -1));
      time = new Date();

      if (unit === 'm') time.setMinutes(time.getMinutes() + amount);
      if (unit === 'h') time.setHours(time.getHours() + amount);
      if (unit === 'd') time.setDate(time.getDate() + amount);
    } else {
      time = new Date(timeStr);
    }

    return this.reminderModel.create({ chatId, time, message,sent: false });
  }

  async getReminders(chatId: number) {
    
    return this.reminderModel.find({ chatId, sent: false });
  }

  async deleteReminder(id: string) {
    if (!id) {
      throw new NotFoundException('Invalid reminder ID');
    }
    const result = await this.reminderModel.findOneAndDelete({ _id: id });
    if (!result) {
      throw new NotFoundException('Reminder not found');
    }
    return result;
  }

  @Cron(CronExpression.EVERY_30_MINUTES)
  async checkReminders() {
    const now = new Date();
    const reminders = await this.reminderModel.find({
      time: { $lt: now },
      sent: false,
    });

    for (const reminder of reminders) {
      await this.bot.telegram.sendMessage(reminder.chatId, `🔔 Eslatma: ${reminder.message}`);
      reminder.sent = true;
      await reminder.save();
    }
  }
}
