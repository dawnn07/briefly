import { Context } from 'telegraf';
import { getUsers } from '../utils/recentUsers';

const insults = [
  'Con lợn này',
  'Pock Pock, nghe tiếng con gà đâu đây',
  'Giảm cân đi bạn ơi',
  'Bạn có bồ chưa , mình có rồi nè hẹ hẹ',
  'Bạn có biết bạn trông như con lợn không?',
  'Nhắn loz j lắm z',
  'Bố mẹ bạn biết bạn gay chưa'
];

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
  const randomInsult = insults[Math.floor(Math.random() * insults.length)];

  await ctx.reply(`@${randomUser.name} ${randomInsult}`);
}
