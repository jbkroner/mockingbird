/** express.js setup */
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const cors = require('cors');
const app = express();
const port = 9000;
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

/** discord.js setup */
const Discord = require('discord.js');
const client = new Discord.Client();
const config = require('./config.json');
voiceConnectionMap = new Map(); // map channelIds to Connections
guildMap = new Map(); // map guildIds to guilds

client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles){
  const command = require(`./commands/${file}`);
  client.commands.set(command.name, command);
}

// test
app.post('/api/testDynamicCommands', (req, res) => {
  client.commands.get('test').execute(undefined, undefined);
  res.status(204).send();
})

/** log the bot in on server start */
client.login(config.key); 

/** discord event handlers */
client.once('ready', () => {
    console.log('mockingbird is logged in! ready to receive commands...');
});

/** getChannels */
app.post('/api/getChannels', (req, res) => {
  console.log('getChannels was called...')
  res.send(client.commands.get('getChannels').execute(client));
})

/** getVoiceChannels */
app.post('/api/getVoiceChannels', (req, res) => {
  console.log('getVoiceChannels was called...')
  res.send(client.commands.get('getVoiceChannels').execute(client));
})

/**  makeVoiceConnection - api endpoint */
app.post('/api/makeVoiceConnection', (req, res) => {
  if(req === undefined){
    console.log(`makeVoiceConnection: received an undefined request`);
    res.status(400).send('undefined request');
  }
  if(voiceConnectionMap.get(req.body.channelId) != undefined) {
      console.log(`makeVoiceConnection: received voice connection request to an already mapped channel: ${req.body.channelId}`);
      res.status(400).send('connection already mapped');
      return;
  }

  // attempt to make the voice connection
  // this call does not handle bad id or no id right now
  let status = client.commands.get('makeVoiceConnection').execute(client, req, voiceConnectionMap) != undefined
  if(status === true){
    console.log(status);
    console.log(`makeVoiceConnection error: ${status}`);
    res.status(400).send(`makeVoiceConnection error: ${status}`);
    return;
  }

  res.status(204).send('connection made and mapped');
})

/** closeVoiceConnection */
app.post('/api/closeVoiceConnection', (req, res) => {
  connection = voiceConnectionMap.get(req.body.channelId);
  if(connection === undefined) {
    res.status(400).send('this connection is not mapped');
    return;
  }
  client.commands.get('closeVoiceConnection').execute(req, connection, voiceConnectionMap);
  res.status(204).send();
})

/** playSample */
app.post('/api/playSample', (req, res) => {

  connection = voiceConnectionMap.get(req.body.channelId);
  sample = req.body.sampleName;
  if(connection === undefined) {
    res.status(400).send('undefined channelId');
    return;
  }

  client.commands.get('playSample').execute(client, req, voiceConnectionMap, fs);

  res.status(204).send();
})

app.listen(port, () => console.log(`ready for api calls at localhost:${port}`));