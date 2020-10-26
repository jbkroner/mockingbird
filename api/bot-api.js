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

// configure body parser middleware
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


// login
app.post('/api/login/', (req, res) => {
    botLogin();
    res.send('bot logged in!');
});

// logout
app.post('/api/logout/', (req, res) => {
    /** discord bot login and logging */
    console.log('trying to logout bot...')
    client.destroy(); 
    console.log('bot logged out!');
    res.send('bot logged out!')
});

app.listen(port, () => console.log(`hello we are listing on port ${port}`));