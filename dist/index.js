import * as dotenv from 'dotenv';
dotenv.config();
import { bot } from './bot';
bot.launch();
console.log('Bot is running');
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
