import { Command, Ctx, Start, Update } from 'nestjs-telegraf';
import { ReminderService } from 'src/reminders/reminder.service';
import { Context } from 'telegraf';

@Update()
export class ReminderBot {
  constructor(private readonly reminderService: ReminderService) {}

  @Start()
  async start(@Ctx() ctx: Context) {
    const chat = ctx.chat;
    if (chat?.type === 'private') {
      const firstName = chat.first_name;
      await ctx.reply(
        `👋 Salom ${firstName}! Menga /remind buyrug'ini yuboring. Masalan: /remind 30m kitob o'qing!`,
      );
    } else {
      await ctx.reply(
        `👋 Salom! Guruh chatida ism ko'rsatilmaydi. Menga /remind buyrug'ini yuboring.`,
      );
    }
  }

  @Command('remind')
  async handleRemind(
    @Ctx() ctx: Context & { message: { text: string } },
  ): Promise<any> {
    const text = ctx.message?.text;
    const args = text?.split(' ').slice(1);

    if (!args || args.length < 2) {
      return ctx.reply('❗ Foydalanish: /remind <vaqt> <xabar>');
    }

    const time = args[0];
    const message = args.slice(1).join(' ');

    const chatId = ctx.chat?.id ?? ctx.from?.id;
    if (!chatId) {
      return ctx.reply('❌ Chat ID aniqlanmadi.');
    }

    const reminder = await this.reminderService.createReminder(chatId, time, message);

    return ctx.reply(`✅ Eslatma saqlandi: "${reminder.message}" (${time} dan keyin)`);
  }

  @Command('myreminders')
  async myReminders(@Ctx() ctx: Context): Promise<any> {
    const chatId = ctx.chat?.id ?? ctx.from?.id;
    if (!chatId) {
      return ctx.reply('❌ Chat ID aniqlanmadi.');
    }

    const reminders = await this.reminderService.getReminders(chatId);

    if (!reminders.length) {
      return ctx.reply('📭 Sizda eslatmalar yo‘q');
    }

    const list = reminders
      .map((r) => `🕒 ${new Date(r.time).toLocaleString()} – ${r.message} (ID: ${r._id})`)
      .join('\n');

    return ctx.reply(list);
  }

  @Command('delete')
  async delete(
    @Ctx() ctx: Context & { message: { text: string } },
  ): Promise<any> {
    const [_, id] = ctx.message.text.split(' ');
    if (!id) return ctx.reply('❌ Format: /delete <id>');

    try {
      await this.reminderService.deleteReminder(id);
      return ctx.reply('🗑️ Eslatma o‘chirildi');
    } catch (e) {
      return ctx.reply('❌ Topilmadi yoki xato ID');
    }
  }
}
