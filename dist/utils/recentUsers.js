const usersByChat = {};
export function addUser(chatId, userId, name) {
    if (!usersByChat[chatId])
        usersByChat[chatId] = [];
    if (!usersByChat[chatId].some(u => u.id === userId)) {
        usersByChat[chatId].push({ id: userId, name });
    }
}
export function getUsers(chatId) {
    return usersByChat[chatId] || [];
}
