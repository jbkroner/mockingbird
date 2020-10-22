var express = require('express');
var router = express.Router();

const Discord = require('discord.js');
const client = new Discord.Client();
const config = require('../config.json');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/testDiscord', function(req, res, next){
  res.render('testDiscord');
  // join users voice channel when they send a message
  client.login(config.key);
  console.log('this is happening');
  client.on('message', async message => {
  if (message.member.voice.channel) {
    const connection = await message.member.voice.channel.join();

    // create a dispatcher
    const dispatcher = connection.play(config.testFile, { volume: .5});

    dispatcher.on('start', () => {
      console.log('audio.mp3 is now playing!');
    });

    dispatcher.on('finish', () => {
      console.log('audio.mp3 has finished playing!');
      message.member.voice.channel.leave();
    });

    // Always remember to handle errors appropriately!
    dispatcher.on('error', console.error);
  }
})
});
module.exports = router;
