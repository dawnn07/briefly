const usersByChat: Record<number, { id: number; name: string }[]> = {};

export function addUser(chatId: number, userId: number, name: string) {
  if (!usersByChat[chatId]) usersByChat[chatId] = [];
  
  if (!usersByChat[chatId].some(u => u.id === userId)) {
    usersByChat[chatId].push({ id: userId, name });
  }
}

export function getUsers(chatId: number) {
  return usersByChat[chatId] || [];
}
