import { Context } from 'telegraf';
import { Markup } from 'telegraf';
import { placeBet, rollDice, getBalance, getUserStats, getUserBet, clearBet, getLeaderboard, addBalance } from '../services/gameService';

const taixiuCommand = async (ctx: Context) => {
  if (!ctx.from) return;
  
  const userId = ctx.from.id;
  const userName = ctx.from.username || ctx.from.first_name;
  const messageText = 'text' in (ctx.message ?? {}) ? (ctx.message as { text: string }).text : undefined;
  const args = (messageText ?? '').split(' ').slice(1);

  if (args.length === 0) {
    await showMainMenu(ctx, userId, userName);
    return;
  }

  const command = args[0].toLowerCase();

  switch (command) {
    case 'tai':
    case 'xiu':
      await handleBet(ctx, userId, command as 'tai' | 'xiu', args[1]);
      break;

    case 'roll':
      await handleRoll(ctx, userId);
      break;

    case 'balance':
    case 'bal':
      await showBalance(ctx, userId);
      break;

    case 'stats':
    case 'stat':
      await showStats(ctx, userId, userName);
      break;

    case 'top':
    case 'leaderboard':
      await showLeaderboard(ctx);
      break;

    case 'bonus':
      await claimBonus(ctx, userId);
      break;

    case 'reset':
      await resetBalance(ctx, userId);
      break;

    case 'help':
      await showHelp(ctx);
      break;

    default:
      await ctx.reply('❌ Lệnh không hợp lệ. Dùng /taixiu help để xem hướng dẫn.');
  }
};

async function showMainMenu(ctx: Context, userId: number, userName: string) {
  const balance = getBalance(userId);
  const currentBet = getUserBet(userId);
  
  const keyboard = Markup.inlineKeyboard([
    [
      Markup.button.callback('🎲 Chơi ngay', 'taixiu_quickplay'),
      Markup.button.callback('💰 Số dư', 'taixiu_balance')
    ],
    [
      Markup.button.callback('📊 Thống kê', 'taixiu_stats'),
      Markup.button.callback('🏆 BXH', 'taixiu_top')
    ],
    [
      Markup.button.callback('🎁 Bonus', 'taixiu_bonus'),
      Markup.button.callback('❓ Hướng dẫn', 'taixiu_help')
    ]
  ]);

  let message = `🎰 **TÀI XỈU CASINO** 🎰\n\n`;
  message += `👋 Chào ${userName}!\n`;
  message += `💰 Số dư: ${balance.toLocaleString()} điểm\n`;
  
  if (currentBet) {
    message += `🎯 Cược hiện tại: ${currentBet.choice.toUpperCase()} ${currentBet.amount} điểm\n`;
    message += `⚡ Dùng /taixiu roll để quay!\n`;
  }
  
  message += `\nChọn hành động:`;

  await ctx.reply(message, keyboard);
}

async function handleBet(ctx: Context, userId: number, choice: 'tai' | 'xiu', amountStr?: string) {
  if (!amountStr) {
    await showBetMenu(ctx, choice);
    return;
  }

  const amount = parseInt(amountStr);
  if (!amount || amount <= 0) {
    await ctx.reply('❌ Số tiền phải là số dương');
    return;
  }

  const result = placeBet(userId, choice, amount);
  
  if (result.error) {
    await ctx.reply(`❌ ${result.error}`);
    return;
  }

  const choiceEmoji = choice === 'tai' ? '🔴 TÀI' : '🔵 XỈU';
  await ctx.reply(
    `✅ Đã đặt cược ${choiceEmoji} ${amount.toLocaleString()} điểm\n\n` +
    `🎲 Dùng /taixiu roll để quay xúc xắc!`
  );
}

async function showBetMenu(ctx: Context, choice: 'tai' | 'xiu') {
  const choiceEmoji = choice === 'tai' ? '🔴 TÀI' : '🔵 XỈU';
  const keyboard = Markup.inlineKeyboard([
    [
      Markup.button.callback('100', `bet_${choice}_100`),
      Markup.button.callback('500', `bet_${choice}_500`),
      Markup.button.callback('1K', `bet_${choice}_1000`)
    ],
    [
      Markup.button.callback('2K', `bet_${choice}_2000`),
      Markup.button.callback('5K', `bet_${choice}_5000`),
      Markup.button.callback('10K', `bet_${choice}_10000`)
    ],
    [
      Markup.button.callback('🔙 Quay lại', 'taixiu_menu')
    ]
  ]);

  await ctx.reply(`Chọn số tiền cược cho ${choiceEmoji}:`, keyboard);
}

async function handleRoll(ctx: Context, userId: number) {
  const currentBet = getUserBet(userId);
  
  if (!currentBet) {
    await ctx.reply('❌ Bạn chưa đặt cược! Dùng: /taixiu tai 100');
    return;
  }

  const result = rollDice(userId);
  await ctx.reply(typeof result === 'string' ? result : result.message ?? JSON.stringify(result));
}

async function showBalance(ctx: Context, userId: number) {
  const balance = getBalance(userId);
  await ctx.reply(`💰 **Số dư tài khoản**\n\n${balance.toLocaleString()} điểm`);
}

async function showStats(ctx: Context, userId: number, userName: string) {
  const stats = getUserStats(userId);
  
  const message = `📊 **Thống kê ${userName}**\n\n` +
    `💰 Số dư: ${stats.balance.toLocaleString()} điểm\n` +
    `🎮 Tổng ván chơi: ${stats.totalGames}\n` +
    `🏆 Số ván thắng: ${stats.wins}\n` +
    `💸 Số ván thua: ${stats.losses}\n` +
    `📈 Tỷ lệ thắng: ${stats.winRate}%\n` +
    `💵 Tổng tiền đã cược: ${stats.totalBet.toLocaleString()}\n` +
    `💎 Tổng tiền thắng: ${stats.totalWon.toLocaleString()}`;

  await ctx.reply(message);
}

async function showLeaderboard(ctx: Context) {
  const top10 = getLeaderboard(10);
  
  if (top10.length === 0) {
    await ctx.reply('📈 Chưa có dữ liệu bảng xếp hạng');
    return;
  }

  let message = '🏆 **BẢNG XẾP HẠNG TOP 10** 🏆\n\n';
  
  top10.forEach((player, index) => {
    const rank = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}.`;
    message += `${rank} User ${player.userId}: ${player.balance.toLocaleString()} điểm\n`;
  });

  await ctx.reply(message);
}

async function claimBonus(ctx: Context, userId: number) {
  // Simple daily bonus - 1000 points
  const bonusAmount = 1000;
  const newBalance = addBalance(userId, bonusAmount);
  
  await ctx.reply(
    `🎁 **NHẬN BONUS THÀNH CÔNG!**\n\n` +
    `+${bonusAmount.toLocaleString()} điểm\n` +
    `💰 Số dư mới: ${newBalance.toLocaleString()} điểm`
  );
}

async function resetBalance(ctx: Context, userId: number) {
  addBalance(userId, 1000 - getBalance(userId));
  await ctx.reply('🔄 Đã reset số dư về 1000 điểm');
}

async function showHelp(ctx: Context) {
  const helpText = `❓ **HƯỚNG DẪN CHƠI TÀI XỈU** ❓\n\n` +
    `🎲 **Cách chơi:**\n` +
    `• Đặt cược TÀI (11-18) hoặc XỈU (3-10)\n` +
    `• Bot tung 3 xúc xắc\n` +
    `• Đoán đúng = thắng x2 tiền cược\n\n` +
    `📝 **Lệnh cơ bản:**\n` +
    `• /taixiu - Menu chính\n` +
    `• /taixiu tai 1000 - Cược TÀI 1000 điểm\n` +
    `• /taixiu xiu 500 - Cược XỈU 500 điểm\n` +
    `• /taixiu roll - Quay xúc xắc\n` +
    `• /taixiu balance - Xem số dư\n` +
    `• /taixiu stats - Thống kê cá nhân\n` +
    `• /taixiu bonus - Nhận bonus\n\n` +
    `💡 **Mẹo:**\n` +
    `• Có thể đặt cược và roll trong 1 lệnh\n` +
    `• Dùng menu button để chơi nhanh hơn`;

  await ctx.reply(helpText);
}

export default taixiuCommand;