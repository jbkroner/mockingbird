const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 9000;


/** discord imports */
const Discord = require('discord.js');
const client = new Discord.Client();
const config = require('./config.json');


/** discord audio stuff */

// join users voice channel when they send a message
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

let audioFiles = [];

app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// api functions
function botLogin(){
    client.login(config.key); 
}

// discord events
client.once('ready', () => {
    console.log('bot ready!');
});


function auth(req){
  if(req === undefined) return false;
  return (req.body.testAuth === 'test-auth-value') ? true : false;
}

// login
app.post('/api/login/', (req, res) => {
    if (auth(req) == true){
      botLogin();
      res.send('it worked');
      return;
    }
    res.send('fail');
});

// logout
app.post('/api/logout/', (req, res) => {
    /** discord bot login and logging */
    console.log('trying to logout bot...')
    client.destroy(); 
    console.log('bot logged out!');
    res.send('bot logged out!')
});

// getChannels
app.post('/api/getChannels', (req, res) => {

  // see if we have a valid client -- null is not the right thing to check for
  if(client == null) res.send('client is null!')

  res.send(client.channels)
})

// get voice channels only
app.post('/api/getVoiceChannels', (req, res) => {
  res.send(client.channels);
})

/**  joinVoiceChannel - join the birb-sounds channel */
app.post('/api/joinVoiceChannel', (req, res) => {
  if(auth(req) == false) {res.send('joining channel failed - auth');return;}
  joinVoiceChannel(req);
  res.send(req.body);
})

async function joinVoiceChannel(req){
  // find the birb-sounds channel
  channel = await client.channels.fetch(req.body.channelId);

  // join the birb sounds channel
  const connection = await channel.join();

  // create a dispatcher
  const dispatcher = connection.play(config.testFile, { volume: .5});

  // print events for debug
  dispatcher.on('start', () => {
    console.log('audio.mp3 is now playing!');
  });

  // dc after the file has finished playing
  dispatcher.on('finish', () => {
    channel.leave();
  });

  return;
}

app.listen(port, () => console.log(`hello we are listing on port ${port}`));