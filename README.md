# Telegram Summarizer Bot

A demo version of a Telegram bot that summarizes messages in group chats. Built with TypeScript.

## Features
- Summarizes recent messages in a chat
- Simple `/summarize` command for quick summaries
- `/start` and `/roast` commands for demo purposes
- Modular code structure for easy extension

## Getting Started

### Prerequisites
- Node.js (v16+ recommended)
- Telegram Bot Token (from @BotFather)

### Installation
1. Clone the repository:
   ```pwsh
   git clone <repo-url>
   cd telegram-summarizer-bot
   ```
2. Install dependencies:
   ```pwsh
   npm install
   ```
3. Configure your bot token:
   - Create a `.env` file in the root directory
   - Add your token:
     ```env
     BOT_TOKEN=your_token_here
     OPENAI_API_KEY=your_token_here
     ```

### Running the Bot
```pwsh
npm start
```

## Usage
- Add the bot to your Telegram group
- Use `/summarize` to get a summary of recent messages
- Try `/start` and `/roast` for demo commands

## Project Structure
```
src/
  bot.ts           # Main bot logic
  index.ts         # Entry point
  commands/        # Command handlers
    roast.ts
    start.ts
    summarize.ts
  services/
    summarizer.ts  # Summarization logic
  utils/
    logger.ts      # Logging utility
    recentMessages.ts
    recentUsers.ts
```

## License
MIT
