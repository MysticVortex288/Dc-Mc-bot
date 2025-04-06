require('dotenv').config();
const mineflayer = require('mineflayer');
const { Client, GatewayIntentBits } = require('discord.js');

const discord = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

discord.once('ready', () => {
  console.log(`✅ Discord-Bot online als ${discord.user.tag}`);
});

discord.login(process.env.DISCORD_TOKEN);

// Minecraft-Bot erstellen
const bot = mineflayer.createBot({
  host: process.env.MC_SERVER,
  port: parseInt(process.env.MC_PORT),
  username: process.env.MC_USERNAME,
});

// Discord-Nachricht senden
function sendToDiscord(msg) {
  const channel = discord.channels.cache.get(process.env.DISCORD_CHANNEL);
  if (channel) channel.send(msg);
}

// Minecraft-Events
bot.on('playerJoined', (player) => {
  sendToDiscord(`✅ **${player.username}** ist dem Server beigetreten.`);
});

bot.on('playerLeft', (player) => {
  sendToDiscord(`❌ **${player.username}** hat den Server verlassen.`);
});

bot.on('chat', (username, message) => {
  // Beispiel: AntiCheat-Bot heißt "ACBot"
  if (username === 'ACBot' || username.toLowerCase().includes("anticheat")) {
    sendToDiscord(`🚨 **AntiCheat-Meldung**: ${message}`);
  }

  // Beispiel: Ban/Kick-Nachricht
  if (message.includes("gebannt") || message.includes("gekickt")) {
    sendToDiscord(`⛔ **Strafe erkannt**: ${message}`);
  }
});
discord.once('ready', async () => {
  console.log(`✅ Discord-Bot ist online als ${discord.user.tag}`);
  try {
    const channel = await discord.channels.fetch(process.env.DISCORD_CHANNEL);
    console.log(`✅ Kanal gefunden: ${channel.name}`);
    channel.send('✅ Testnachricht: Ich lebe!');
  } catch (error) {
    console.error('❌ Fehler beim Kanal-Zugriff:', error);
  }
});

