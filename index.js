var Botkit = require('botkit')
var bot = Botkit.slackbot()

bot.spawn({
  token: process.env.token
}).startRTM(function(err, bot, payload) {
  if(err) {throw new Error(err)}
})

bot.hears('hey', 'direct_message, direct_mention, mention', function(bot, message) {
  bot.reply(message, 'All your vitamin c are belong to us.')
})
