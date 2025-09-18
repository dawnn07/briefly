import { Context } from 'telegraf'

export default (ctx: Context) => {
  ctx.reply('Available commands:\n/start - Start the bot\n/help - Show this help message\n/roast - Roast a random user in the chat\n/summarize - Summarize the chat\n/taixiu - Play Tài Xỉu game\nJust send any text and I will summarize it for you! ✨')
}
