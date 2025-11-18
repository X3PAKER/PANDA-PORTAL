import express from "express";
import dotenv from "dotenv";
import path from "path";
import cors from "cors";
import fs from "fs";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const DATA_DIR = path.join(__dirname, "data");
const USER_FILE = path.join(DATA_DIR, "users.json");

if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR);
if (!fs.existsSync(USER_FILE)) fs.writeFileSync(USER_FILE, "{}", "utf8");

let users = JSON.parse(fs.readFileSync(USER_FILE, "utf8"));
const saveUsers = () =>
  fs.writeFileSync(USER_FILE, JSON.stringify(users, null, 2), "utf8");

// ==================== AUTO LOGIN TELEGRAM ====================
app.post("/api/telegram-login", (req, res) => {
  const { telegramId, username } = req.body;
  if (!telegramId) return res.json({ success: false });

  if (!users[telegramId]) {
    users[telegramId] = {
      username: username || "Người chơi",
      createdAt: new Date().toISOString(),
      score: 0,
    };
    saveUsers();
    console.log("🆕 User mới:", telegramId, username);
  }

  res.json({ success: true, user: users[telegramId] });
});

// ==================== ROUTE WEB ====================
app.get("/", (_, res) => res.sendFile(path.join(__dirname, "public", "index.html")));
app.get("/game.html", (_, res) => res.sendFile(path.join(__dirname, "public", "game.html")));

app.listen(PORT, "0.0.0.0", () =>
  console.log(`🚀 Telegram Mini App chạy tại http://localhost:${PORT}`)
);
