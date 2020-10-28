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
voiceConnectionMap = new Map(); // map channelIds to Connections
guildMap = new Map(); // map guildIds to guilds

// join users voice channel when they send a message
// client.on('message', async message => {
//   if (message.member.voice.channel) {
//     const connection = await message.member.channelvoice.join();

//     // create a dispatcher
//     const dispatcher = connection.play(config.testFile, { volume: .5});

//     dispatcher.on('start', () => {
//       console.log('audio.mp3 is now playing!');
//     });

//     dispatcher.on('finish', () => {
//       console.log('audio.mp3 has finished playing!');
//       message.member.voice.channel.leave();
//     });

//     // Always remember to handle errors appropriately!
//     dispatcher.on('error', console.error);
//   }
// })

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


/** auth */
function auth(req){
  if(req === undefined) return false;
  return (req.body.testAuth === 'test-auth-value') ? true : false;
}

/** login */
app.post('/api/login/', (req, res) => {
    if (auth(req) == true){
      botLogin();
      res.send('it worked');
      return;
    }
    res.send('fail');
});

/** logout */
app.post('/api/logout/', (req, res) => {
    /** discord bot login and logging */
    console.log('trying to logout bot...')
    client.destroy(); 
    console.log('bot logged out!');
    res.send('bot logged out!')
});

/** getChannels */
app.post('/api/getChannels', (req, res) => {

  // see if we have a valid client -- null is not the right thing to check for
  if(client == null) res.send('client is null!')

  res.send(client.channels)
})

/** getVoiceChannels */
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

  // map the channel id to the connection
  voiceConnectionMap.set(req.body.channelId, connection);

  // create a dispatcher
  const dispatcher = connection.play(config.testFile, { volume: .5});

  // print events for debug
  dispatcher.on('start', () => {
    console.log('audio.mp3 is now playing!');
  });

  // // dc after the file has finished playing
  // dispatcher.on('finish', () => {
  //   channel.leave();
  // });

  return;
}

/** leaveVoiceChannel */
app.post('/api/leaveVoiceChannel', (req, res) => {
  voiceConnectionMap.delete(req.body.channelId);
  channel.leave();
  res.send(req.body);
})

/** playSample */
app.post('/api/playSample', (req, res) => {

  connection = voiceConnectionMap.get(req.body.channelId);
  if(connection === undefined) {
    res.send('channel id returned undefiend');
    return;
  }
  
  // create a dispatcher
  const dispatcher = connection.play(req.body.sampleName, { volume: .5});

  // print events for debug
  dispatcher.on('start', () => {
    console.log(`Now playing sample: ${req.body.sampleName}`);
  });

  res.send(req.body);
})

app.listen(port, () => console.log(`hello we are listing on port ${port}`));