const mineflayer = require('mineflayer');
const { Client, GatewayIntentBits } = require('discord.js');

// Discord-Client erstellen
const discord = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

// Discord ready
discord.once('ready', () => {
  console.log(`✅ Discord-Bot ist online als ${discord.user.tag}`);
});

// Bot einloggen
discord.login(process.env.DISCORD_TOKEN);

// Minecraft-Bot starten
const bot = mineflayer.createBot({
  host: process.env.MC_SERVER,         // z.B. server.aternos.me
  port: parseInt(process.env.MC_PORT), // 25565
  username: process.env.MC_USERNAME    // z.B. Bot123
});

// Funktion zum Senden an Discord
function sendToDiscord(message) {
  const channel = discord.channels.cache.get(process.env.DISCORD_CHANNEL);
  if (channel) channel.send(message);
}

// Spieler-Events erkennen
bot.on('playerJoined', (player) => {
  sendToDiscord(`✅ **${player.username}** ist dem Server beigetreten.`);
});

bot.on('playerLeft', (player) => {
  sendToDiscord(`❌ **${player.username}** hat den Server verlassen.`);
});

bot.on('chat', (username, message) => {
  if (username.toLowerCase().includes("anticheat")) {
    sendToDiscord(`🚨 **AntiCheat-Meldung** von ${username}: ${message}`);
  }
  if (message.includes("gebannt") || message.includes("gekickt")) {
    sendToDiscord(`⛔ **Strafe erkannt**: ${message}`);
  }
});
