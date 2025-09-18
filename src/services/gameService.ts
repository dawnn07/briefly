interface UserBet {
  choice: 'tai' | 'xiu';
  amount: number;
  timestamp: number;
}

interface BetResult {
  success?: boolean;
  error?: string;
  balance?: number;
}

interface GameResult {
  dice: number[];
  sum: number;
  result: 'tai' | 'xiu';
  playerWon: boolean;
  winAmount: number;
  newBalance: number;
  message: string;
}

interface UserStats {
  balance: number;
  totalGames: number;
  wins: number;
  losses: number;
  totalBet: number;
  totalWon: number;
  winRate: number;
}

// Enhanced storage
const userBalances: Map<number, number> = new Map();
const userBets: Map<number, UserBet> = new Map();
const userStats: Map<number, Omit<UserStats, 'balance' | 'winRate'>> = new Map();

const DEFAULT_BALANCE = 1000;
const MIN_BET = 10;
const MAX_BET = 500;

function ensureUser(userId: number): void {
  if (!userBalances.has(userId)) {
    userBalances.set(userId, DEFAULT_BALANCE);
    userStats.set(userId, {
      totalGames: 0,
      wins: 0,
      losses: 0,
      totalBet: 0,
      totalWon: 0
    });
  }
}

function placeBet(userId: number, choice: 'tai' | 'xiu', amount: number): BetResult {
  ensureUser(userId);
  
  const balance = userBalances.get(userId)!;
  
  if (amount < MIN_BET) {
    return { error: `Cược tối thiểu ${MIN_BET} điểm` };
  }
  
  if (amount > MAX_BET) {
    return { error: `Cược tối đa ${MAX_BET} điểm` };
  }
  
  if (balance < amount) {
    return { error: 'Không đủ tiền', balance };
  }

  userBets.set(userId, {
    choice,
    amount,
    timestamp: Date.now()
  });

  return { success: true, balance };
}

function rollDice(userId: number): GameResult {
  ensureUser(userId);
  
  const dice: number[] = Array.from({ length: 3 }, () => 
    Math.floor(Math.random() * 6) + 1
  );
  
  const sum = dice.reduce((a, b) => a + b, 0);
  const result: 'tai' | 'xiu' = sum >= 11 ? 'tai' : 'xiu';
  
  // Get dice emojis
  const diceEmojis = dice.map(d => ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅'][d - 1]);
  
  let message = `🎲 ${diceEmojis.join(' ')} (${dice.join('-')})\n`;
  message += `📊 Tổng: ${sum} → ${result === 'tai' ? '🔴 TÀI' : '🔵 XỈU'}\n`;

  const userBet = userBets.get(userId);
  let playerWon = false;
  let winAmount = 0;
  let newBalance = userBalances.get(userId)!;

  if (userBet) {
    const { choice, amount } = userBet;
    const stats = userStats.get(userId)!;
    
    playerWon = choice === result;
    
    if (playerWon) {
      winAmount = amount * 2; // 2x payout
      newBalance += amount; // Win back bet + profit
      message += `🎉 **THẮNG** +${amount} điểm!\n`;
      stats.wins++;
      stats.totalWon += winAmount;
    } else {
      newBalance -= amount;
      message += `💸 **THUA** -${amount} điểm!\n`;
      stats.losses++;
    }
    
    // Update stats
    stats.totalGames++;
    stats.totalBet += amount;
    userStats.set(userId, stats);
    userBalances.set(userId, newBalance);
    userBets.delete(userId);
  } else {
    message += '⚠️ Bạn chưa đặt cược\n';
  }

  message += `💰 Số dư: ${newBalance.toLocaleString()} điểm`;

  return {
    dice,
    sum,
    result,
    playerWon,
    winAmount,
    newBalance,
    message
  };
}

function getBalance(userId: number): number {
  ensureUser(userId);
  return userBalances.get(userId)!;
}

function getUserStats(userId: number): UserStats {
  ensureUser(userId);
  const balance = userBalances.get(userId)!;
  const stats = userStats.get(userId)!;
  const winRate = stats.totalGames > 0 ? (stats.wins / stats.totalGames) * 100 : 0;

  return {
    balance,
    ...stats,
    winRate: Math.round(winRate * 100) / 100 
  };
}

function getUserBet(userId: number): UserBet | undefined {
  return userBets.get(userId);
}

function clearBet(userId: number): boolean {
  return userBets.delete(userId);
}

function hasBet(userId: number): boolean {
  return userBets.has(userId);
}

function addBalance(userId: number, amount: number): number {
  ensureUser(userId);
  const newBalance = userBalances.get(userId)! + amount;
  userBalances.set(userId, newBalance);
  return newBalance;
}

function getLeaderboard(limit: number = 10): Array<{ userId: number; balance: number }> {
  return Array.from(userBalances.entries())
    .sort(([, a], [, b]) => b - a)
    .slice(0, limit)
    .map(([userId, balance]) => ({ userId, balance }));
}

export {
  placeBet,
  rollDice,
  getBalance,
  getUserStats,
  getUserBet,
  clearBet,
  hasBet,
  addBalance,
  getLeaderboard,
  ensureUser,
  MIN_BET,
  MAX_BET,
  DEFAULT_BALANCE
};

export type { UserBet, BetResult, GameResult, UserStats };