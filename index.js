'use strict'
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
 @taxman hello
 Replies to you saying 'All your vitamin c are belong to us'
 */
bot.hears(['hey', 'hello'],'direct_message,direct_mention,mention', function(bot, message) {
  bot.reply(message, 'All your vitamin c are belong to us.')
})

/*
 @taxman list all
 PMs you a link with the pivotal tracker project to view all the tickets in the web UI
 */
bot.hears('list all','direct_message,direct_mention,mention', function(bot, message) {
  bot.startPrivateConversation(message, function(err, convo) {
    convo.say('You can view all the project stories here: https://www.pivotaltracker.com/n/projects/1479718/')
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
        // story.requestedById == 1850810 ||
        return (R.contains(1850810, story.ownerIds && story.currentState != "accepted" || "delivered" || "finished"))
      }, stories)
      convo.say("Here are your requested tickets:")
      ownedStories.map(function(story) {
        convo.say("id: " + story.id + "\n" +
                  "url: " + story.url + "\n" +
                  "type: " + story.type + "\n" +
                  "point estimate: " + story.estimate + "\n" +
                  "name: " + story.name + "\n" +
                  "description: " + story.description)
      })
    })
  })
})
// pivotal.project(1479718).memberships.all(function(err, all) {console.log(all)})

/*
 @taxman assign me #TicketId
 Privately pomodoros you
 // and makes sure to watch whether the finishing commit has the #TicketID
 Recommends ways to take a break
 // Delivers ticket on pivotal tracker
 When user says @taxman I've finished #TicketId
 Publicly tags the user on slack with "Give @ej a raise! This guy's on fire! He just finished #TicketID!!"
 /giphy boss
 */

bot.hears('assign me \#(.*)', 'direct_message,direct_mention,mention', function(bot, message) {
  pivotal.project(1479718).story(message.match[1]).update({currentState: 'started', ownedById: 1850810}, function(err, story) {
    if(err) { convo.say(err)}
  })
  bot.reply(message, "Okay I've assigned @ej to ticket #" + message.match[1])
  bot.startPrivateConversation(message, function(err, convo) {
    convo.say("I'm going to start reminding you to take breaks now from " + message.match[1])
    var myTimer = [25*60*1000,5*60*1000];
    var timer;
    function foo(loopindex) {
      clearInterval(timer)
      convo.say("Take a break");
      loopindex ? timer = setInterval(function() { foo(false) }, myTimer[0]) : timer = setInterval(function() { foo(true) }, myTimer[1])
    }
    foo(false)
    bot.hears("I'm done!", function(bot, message) {
      clearInterval(timer)
      bot.reply(message, '/giphy boss')
    })
  })
})

