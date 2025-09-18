import { Context } from 'telegraf';
import { getUsers } from '../utils/recentUsers';
import { generateToast } from '../services/roastService.ts';

export default async function roastCommand(ctx: Context) {
  if (!ctx.chat) {
    await ctx.reply('Chat information is unavailable.');
    return;
  }
  const chatId = ctx.chat.id;
  const users = getUsers(chatId);

  if (users.length === 0) {
    await ctx.reply('No one to roast yet!');
    return;
  }

  const randomUser = users[Math.floor(Math.random() * users.length)];
  const randomInsult = await generateToast();

  await ctx.reply(`@${randomUser.name} ${randomInsult}`);
}
