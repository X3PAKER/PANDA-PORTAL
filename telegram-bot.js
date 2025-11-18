import TelegramBot from "node-telegram-bot-api";
import dotenv from "dotenv";

dotenv.config();

const token = process.env.TELEGRAM_BOT_TOKEN;
const webAppUrl = process.env.WEBAPP_URL;

if (!token) {
  console.error("❌ TELEGRAM_BOT_TOKEN không tồn tại trong file .env");
  process.exit(1);
}
if (!webAppUrl) {
  console.error("❌ WEBAPP_URL không tồn tại trong file .env");
  process.exit(1);
}

const bot = new TelegramBot(token, { polling: true });

bot.onText(/\/start/, (msg) => {
  bot.sendMessage(
    msg.chat.id,
    "🐼 Chào mừng đến PANDA PORTAL!\nNhấn vào nút dưới để mở Mini App 👇",
    {
      reply_markup: {
        keyboard: [
          [
            {
              text: "🚀 Mở PANDA Portal",
              web_app: { url: webAppUrl },
            },
          ],
        ],
        resize_keyboard: true,
      },
    }
  );
});

console.log("🤖 Telegram Bot đang chạy...");
