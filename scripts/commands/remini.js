const axios = require('axios');
const fs = require('fs-extra');

module.exports.config = {
  name: "remini",
  version: "2.2",
  hasPermssion: 0,
  credits: "Hazeyy",
  description: "( 𝚁𝚎𝚖𝚒𝚗𝚒 )",
  commandCategory: "𝚗𝚘 𝚙𝚛𝚎𝚏𝚒𝚡",
  usages: "( 𝙴𝚗𝚌𝚑𝚊𝚗𝚌𝚎 𝙸𝚖𝚊𝚐𝚎𝚜 )",
  usePrefix: false,
  cooldowns: 2,
};

module.exports.handleEvent = async function ({ api, event }) {
  if (!(event.body.indexOf("remini") === 0 || event.body.indexOf("Remini") === 0)) return;
  const args = event.body.split(/\s+/);
  args.shift();

  const pathie = __dirname + `/cache/zombie.jpg`;
  const { threadID, messageID } = event;

  const photoUrl = event.messageReply.attachments[0] ? event.messageReply.attachments[0].url : args.join(" ");

  if (!photoUrl) {
    api.sendMessage("Please reply to a image to proceed enhancing.", threadID, messageID);
    return;
  }

  api.sendMessage("enhancing, please wait a moment...", threadID, async () => {
    try {
      const response = await axios.get(`https://api.kenliejugarap.com/reminibymarjhun/?url=${encodeURIComponent(photoUrl)}`);
      const processedImageURL = response.data.image_data;
      const img = (await axios.get(processedImageURL, { responseType: "arraybuffer" })).data;

      fs.writeFileSync(pathie, Buffer.from(img, 'binary'));

      api.sendMessage({
        body: "Enhanced Successfully!",
        attachment: fs.createReadStream(pathie)
      }, threadID, () => fs.unlinkSync(pathie), messageID);
    } catch (error) {
      api.sendMessage(`error processing image: ${error}`, threadID, messageID);
    }
  });
};

module.exports.run = async function ({ api, event }) {};
