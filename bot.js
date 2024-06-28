const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');
const express = require('express');

// Replace with your Telegram bot token
const botToken = process.env.BOT_TOKEN;
const bot = new TelegramBot(botToken, { polling: true });

// Start command handler
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
    bot.sendMessage(chatId, `
ᴡᴇʟᴄᴏᴍᴇ, <a href='tg://user?id=${msg.from.id}'>${msg.from.first_name}</a>.\n\n🌟 ɪ ᴀᴍ ᴀ ᴛᴇʀᴀʙᴏx ᴅᴏᴡɴʟᴏᴀᴅᴇʀ ʙᴏᴛ.\nsᴇɴᴅ ᴍᴇ ᴀɴʏ ᴛᴇʀᴀʙᴏx ʟɪɴᴋ ɪ ᴡɪʟʟ ᴅᴏᴡɴʟᴏᴀᴅ ᴡɪᴛʜɪɴ ғᴇᴡ sᴇᴄᴏɴᴅs\nᴀɴᴅ sᴇɴᴅ ɪᴛ ᴛᴏ ʏᴏᴜ ✨`, {
        parse_mode: "HTML",
        reply_to_message_id: msg.message_id,
            reply_markup: JSON.stringify({
                inline_keyboard: [[{ text: "ᴅᴇᴠᴇʟᴏᴘᴇʀ ⚡️", url: `tg://user?id=1008848605` }]],
                resize_keyboard: true,
    }),
      });
});

// Text message handler
bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  const message = msg.text;

  if (message === '/start') return;

  bot.sendChatAction(chatId, 'typing');

  const url = `https://teraboxvideodownloader.nepcoderdevs.workers.dev/?url=${message}`;

  try {
    const response = await axios.get(url);
    if (response.status === 200) {
      const data = response.data;
      const resolutions = data.response[0].resolutions;
      const fastDownloadLink = resolutions['Fast Download'];
      const hdVideoLink = resolutions['HD Video'];
      const thumbnailUrl = data.response[0].thumbnail;
      const videoTitle = data.response[0].title;

      const tinyurlApi = 'http://tinyurl.com/api-create.php?url=';
      const shortenedFastDownloadLink = (await axios.get(tinyurlApi + fastDownloadLink)).data;
      const shortenedHdVideoLink = (await axios.get(tinyurlApi + hdVideoLink)).data;

      const options = {
        reply_markup: JSON.stringify({
          inline_keyboard: [
            [
              { text: '⚡️ 𝗙𝗔𝗦𝗧 𝗗𝗢𝗪𝗡𝗟𝗔𝗢𝗗', url: shortenedFastDownloadLink },
              { text: '🩵 𝗛𝗗 𝗩𝗜𝗗𝗘𝗢', url: shortenedHdVideoLink }
            ],
            [
              { text: 'ᴊᴏɪɴ ❤️🚀', url: 'http://t.me/FLIXCHECKER' }
            ]
          ]
        }),
        parse_mode: 'HTML'
      };

      const messageText = `🎬 <b>Title:</b> ${videoTitle}\nMade with ❤️ by @FLIXCHECKER`;

      bot.sendPhoto(chatId, thumbnailUrl, { caption: messageText, ...options });
    } else {
      bot.sendMessage(chatId, '❌ <b>Error fetching data from Terabox API</b>', { parse_mode: 'HTML' });
    }
  } catch (e) {
    bot.sendMessage(chatId, `❌ <b>Error: ${e.message}</b>`, { parse_mode: 'HTML' });
  }
});

// Set up an express server for health check
const app = express();
const PORT = process.env.PORT || 8000;

app.get('/health', (req, res) => {
    res.status(200).send('Bot Alive');
});

app.listen(PORT, () => {
    console.log(`Bot running on port ${PORT}`);
});
