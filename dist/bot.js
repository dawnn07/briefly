import { Telegraf } from 'telegraf';
import startCommand from './commands/start';
import summarizeCommand, { processSummarization } from './commands/summarize';
import * as dotenv from 'dotenv';
import { addMessage } from './utils/recentMessages';
import { addUser } from './utils/recentUsers';
import roastCommand from './commands/roast';
dotenv.config();
export const bot = new Telegraf(process.env.BOT_TOKEN);
bot.start(startCommand);
bot.command('summarize', summarizeCommand);
bot.command('roast', roastCommand);
bot.action(/^summarize_(\d+)$/, async (ctx) => {
    const lines = parseInt(ctx.match[1]);
    if (!ctx.chat) {
        await ctx.answerCbQuery('Chat information unavailable');
        return;
    }
    await ctx.answerCbQuery();
    await ctx.editMessageText(`✅ Selected: ${lines} lines\n\nProcessing summarization...`);
    await processSummarization(ctx, ctx.chat.id, lines);
});
bot.on('text', (ctx) => {
    const user = ctx.from;
    addMessage(ctx.chat.id, ctx.message.text);
    addUser(ctx.chat.id, user.id, user.username || `${user.first_name} ${user.last_name || ''}`);
});
