var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require("cors");

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var testAPIRouter = require("./routes/testAPI");
var testDiscord = require("./routes/testDiscord");

/** discord imports */
const Discord = require('discord.js');
const client = new Discord.Client();
const config = require('./config.json');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use("/testAPI", testAPIRouter);
app.use('/testDiscord', testDiscord);

/** discord bot login and logging */
client.login(config.key);

/** discord audio stuff */

// join users voice channel when they send a message
client.on('message', async message => {
  if (message.member.voice.channel) {
    const connection = await message.member.voice.channel.join();

    // create a dispatcher
    const dispatcher = connection.play('./media/test.ogg', { volume: .5});

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


client.once('ready', () => {
	console.log('mockingbird:  logged in');
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
