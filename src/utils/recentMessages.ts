const MAX_MESSAGES = 1000;

export const recentMessages: Record<number, string[]> = {};

export function addMessage(chatId: number, text: string) {
  if (!recentMessages[chatId]) {
    recentMessages[chatId] = [];
  }

  recentMessages[chatId].push(text);

  if (recentMessages[chatId].length > MAX_MESSAGES) {
    recentMessages[chatId].shift();
  }
}

export function getMessages(chatId: number, count?: number): string[] {
  const msgs = recentMessages[chatId] || [];
  if (!count) return msgs;
  return msgs.slice(-count);
}
