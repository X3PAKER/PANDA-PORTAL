import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import fs from "fs";
import crypto from "crypto";
import { fileURLToPath } from "url";

dotenv.config();

// ========== PATH ==========
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const PORT = process.env.PORT || 3000;

// ========== MIDDLEWARE ==========
app.use(bodyParser.json());
app.use(cors());
app.use(express.static(path.join(__dirname, "public")));
app.use("/modules", express.static(path.join(__dirname, "public/modules")));

// ========== USER DATABASE ==========
const DATA_DIR = path.join(__dirname, "data");
const USER_FILE = path.join(DATA_DIR, "users.json");

if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR);
if (!fs.existsSync(USER_FILE)) fs.writeFileSync(USER_FILE, "{}");

let users = JSON.parse(fs.readFileSync(USER_FILE, "utf8") || "{}");
function saveUsers() {
  fs.writeFileSync(USER_FILE, JSON.stringify(users, null, 2));
}

// ========== TELEGRAM LOGIN ==========
app.post("/auth/telegram", (req, res) => {
  try {
    const { initData } = req.body;
    if (!initData) return res.json({ success: false, message: "thiếu initData" });

    const secret = crypto
      .createHmac("sha256", "WebAppData")
      .update(process.env.BOT_TOKEN)
      .digest();

    const url = new URLSearchParams(initData);
    const hash = url.get("hash");
    url.delete("hash");

    const dataCheck = [...url.entries()]
      .map(([k, v]) => `${k}=${v}`)
      .sort()
      .join("\n");

    const hmac = crypto.createHmac("sha256", secret).update(dataCheck).digest("hex");
    if (hmac !== hash) return res.json({ success: false, message: "initData không hợp lệ" });

    const tgUser = JSON.parse(url.get("user")); // { id, first_name, username, ... }
    const key = `tg_${tgUser.id}`;

    if (!users[key]) {
      users[key] = {
        telegram_id: tgUser.id,
        name: tgUser.first_name,
        username: tgUser.username,
        createdAt: new Date().toISOString(),
        balance: 0,
        energy: 0
      };
      saveUsers();
      console.log("🐼 Tạo user Telegram mới:", key);
    } else {
      console.log("🔑 Telegram login:", key);
    }

    return res.json({ success: true, user: users[key] });
  } catch (err) {
    console.error("❌ Lỗi /auth/telegram:", err);
    res.json({ success: false, message: "Lỗi máy chủ!" });
  }
});

// ========== ROUTES ==========
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

app.get("/game.html", (req, res) => {
  res.sendFile(path.join(__dirname, "public/game.html"));
});

// ========== START SERVER ==========
app.listen(PORT, () =>
  console.log(`🚀 PANDA PORTAL đang chạy tại http://localhost:${PORT}`)
);
