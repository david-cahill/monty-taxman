import Botkit from 'botkit'
const controller = Botkit.slackbot()

const bot = controller.spawn({
  token: process.env.token
})

bot.startRTM((err, bot, payload) => {
  if(err) {throw new Error(err)}
})

bot.hears('hey', 'direct_message, direct_mention, mention', (bot, message) => bot.reply(message, 'All your vitamin c are belong to us.'))
