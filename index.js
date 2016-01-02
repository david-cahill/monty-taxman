var Botkit = require('botkit')
var controller = Botkit.slackbot()

var bot = controller.spawn({
  token: process.env.token
})

bot.startRTM(function(err, bot, payload) {
  if(err) {throw new Error(err)}
})

bot.hears('hey', 'direct_message, direct_mention, mention', function(bot, message) {
  bot.reply(message, 'All your vitamin c are belong to us.')
})
