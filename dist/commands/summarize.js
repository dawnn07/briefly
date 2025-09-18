import { getMessages } from '../utils/recentMessages';
import { summarizeText } from '../services/summarizer';
import { Markup } from 'telegraf';
const summarizeCommand = async (ctx) => {
    if (!ctx.chat) {
        await ctx.reply('Chat information is unavailable.');
        return;
    }
    const chatId = ctx.chat.id;
    const messageText = 'text' in (ctx.message ?? {}) ? ctx.message.text : undefined;
    const parts = messageText?.trim().split(/\s+/) || [];
    if (parts.length > 1) {
        const lines = parseInt(parts[1]);
        if (lines && lines > 0) {
            // Process directly with the provided number
            await processSummarization(ctx, chatId, lines);
            return;
        }
    }
    const keyboard = Markup.inlineKeyboard([
        [
            Markup.button.callback('5 lines', 'summarize_5'),
            Markup.button.callback('10 lines', 'summarize_10'),
        ],
        [
            Markup.button.callback('25 lines', 'summarize_25'),
            Markup.button.callback('100 lines', 'summarize_100'),
        ]
    ]);
    await ctx.reply('Choose how many lines to summarize:', keyboard);
};
export const processSummarization = async (ctx, chatId, lines) => {
    const messages = getMessages(chatId, lines);
    if (!messages || messages.length === 0) {
        await ctx.reply('No recent messages to summarize.');
        return;
    }
    try {
        await ctx.reply('Summarizing messages... ⏳');
        const summary = await summarizeText(messages.join('\n'));
        await ctx.reply(`📄 Summary of last ${lines} messages:\n\n${summary}`);
    }
    catch (err) {
        console.error(err);
        await ctx.reply('Error summarizing messages.');
    }
};
export default summarizeCommand;
