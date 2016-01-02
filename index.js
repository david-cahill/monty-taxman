var Botkit = require('botkit')
var tracker = require('pivotaltracker')
var R = require('ramda')
var bot = Botkit.slackbot()
var pivotal = new tracker.Client(process.env.pttoken)

bot.spawn({
  token: process.env.token
}).startRTM(function(err, bot, payload) {
  if(err) {throw new Error(err)}
})

/*
 @taxman list all
 PMs you a link with the pivotal tracker project to view all the tickets in the web UI
 */
bot.hears('list all','direct_message,direct_mention,mention', function(bot, message) {
  bot.startPrivateConversation(message, function(err, convo) {
    convo.say("You can view all the project stories here: https://www.pivotaltracker.com/n/projects/1479718/")
  })
})


/*
 @taxman list my tickets
 PMs your personal assigned tickets
 */
bot.hears(['list my tickets', 'list available'],'direct_message,direct_mention,mention', function(bot, message) {
  bot.startPrivateConversation(message, function(err, convo) {
    pivotal.project(1479718).stories.all(function(err, stories) {
      var ownedStories = R.filter( function(story) {
        return (story.requestedById == 1850810 || R.contains(1850810, story.ownerIds) && story.currentState != "accepted" || "delivered" || "finished")
      }, stories)
      convo.say("Here are your requested tickets:")
      var results = ownedStories.map(function(story) {
        return ("id: " + story.id + "\n" +
                  "url: " + story.url + "\n" +
                  "type: " + story.type + "\n" +
                  "point estimate: " + story.estimate + "\n" +
                  "name: " + story.name + "\n" +
                  "description: " + story.description + "\n")
      })
      convo.say("```" + results + "```")
    })
  })
})
// pivotal.project(1479718).memberships.all(function(err, all) {console.log(all)})
