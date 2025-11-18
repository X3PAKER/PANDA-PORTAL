let tg = window.Telegram.WebApp;
tg.expand(); // full height

// Lấy thông tin user Telegram
let user = tg.initDataUnsafe?.user;
if (user) {
  document.getElementById("username").innerText = `👤 ${user.first_name} (@${user.username || ""})`;
}

// Lấy ref từ link
const urlParams = new URLSearchParams(window.location.search);
const ref = urlParams.get("ref") || null;

// Chuyển tab
function openTab(page) {
  document.getElementById("tabFrame").src = `pages/${page}.html?ref=${ref}`;
}
