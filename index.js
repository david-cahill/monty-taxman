var Botkit = require('botkit')
var bot = Botkit.slackbot()

bot.spawn({
  token: process.env.token
}).startRTM(function(err, bot, payload) {
  if(err) {throw new Error(err)}
})

bot.hears('hello','direct_message,direct_mention,mention', function(bot, message) {
  // bot.startConversation(message,function(err,convo) {

  //   convo.say('All your vitamin c are belong to us.');

  // })
  bot.reply(message, 'All your vitamin c are belong to us.')
})
