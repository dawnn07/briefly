const MAX_MESSAGES = 1000;
export const recentMessages = {};
export function addMessage(chatId, text) {
    if (!recentMessages[chatId]) {
        recentMessages[chatId] = [];
    }
    recentMessages[chatId].push(text);
    if (recentMessages[chatId].length > MAX_MESSAGES) {
        recentMessages[chatId].shift();
    }
}
export function getMessages(chatId, count) {
    const msgs = recentMessages[chatId] || [];
    if (!count)
        return msgs;
    return msgs.slice(-count);
}
