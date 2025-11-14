import TelegramBot from "node-telegram-bot-api";
import dotenv from "dotenv";
dotenv.config();

// Token bot Telegram trong .env
const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });

// URL game WebApp — đổi nếu deploy
const WEBAPP_URL = process.env.WEBAPP_URL || "http://YOUR-IP:3000";

// Khi user nhập /start
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;

  bot.sendMessage(
    chatId,
    `🐼 Chào mừng đến *PANDA Portal*!  
🎮 Bấm PLAY GAME để bắt đầu.`,
    {
      parse_mode: "Markdown",
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "🎮 PLAY GAME",
              web_app: { url: WEBAPP_URL }  // Mở WebApp
            }
          ]
        ]
      }
    }
  );
});

// Khi WebApp gửi dữ liệu về bot
bot.on("web_app_data", (msg) => {
  const data = JSON.parse(msg.web_app_data.data);
  console.log("📩 DATA WebApp gửi về Bot:", data);

  bot.sendMessage(msg.chat.id, `🔓 Dữ liệu bạn gửi về Bot: \n\`${JSON.stringify(data, null, 2)}\``, {
    parse_mode: "Markdown"
  });
});

console.log("🤖 Bot Telegram đang chạy...");
