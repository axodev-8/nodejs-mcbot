const mineflayer = require('mineflayer')
const rl = require('readline')
const AutoAuth = require('mineflayer-auto-auth')

if (process.argv.length < 4 || process.argv.length > 6) {
  console.log('Usage: node filename.js <host> [<name>] [<password>]')
  process.exit(1)
}
const bot = mineflayer.createBot({
    host: process.argv[2],
    port: 25565,
    username: process.argv[3] ? process.argv[3] : 'echo',
    version: '1.20',
    plugins: [AutoAuth],
    AutoAuth: {
      logging: true,
      password: process.argv[4],
      ignoreRepeat: true
    }
})


bot.on('kicked', (reason, loggedIn) => console.log(reason, loggedIn))
bot.on('error', err => console.log(err))

bot.on('spawn', () => {
  console.log('Spawned as ' + bot.username);
  callAction()
})

bot.on('serverAuth',function() {
  console.log("Authed as " + bot.username);
  callAction()
})

/*
// Control Movement
var moveinterval = 2;
var maxrandom = 5;
var lasttime = -1;
var moving = 0;
var connected = 0;
var actions = [ 'forward', 'back', 'left', 'right']
var lastaction;
var pi = 3.14159;

bot.on('chat', function(username, message) {
  if (username === bot.username) return;
  console.log(message);
});

bot.on('health',function() {
    if(bot.food < 15) {
        bot.activateItem();
        console.log("Ate something");
    }
});

bot.on('time', function() {
    if (connected <1) {
        return;
    }
    if (lasttime<0) {
        lasttime = bot.time.age;
    } else {
        var randomadd = Math.random() * maxrandom * 20;
        var interval = moveinterval*20 + randomadd;
        if (bot.time.age - lasttime > interval) {
            if (moving == 1) {
                bot.setControlState(lastaction,false);
                moving = 0;
                lasttime = bot.time.age;
            } else {
                var yaw = Math.random()*pi - (0.5*pi);
                var pitch = Math.random()*pi - (0.5*pi);
                bot.look(yaw,pitch,false);

                lastaction = actions[Math.floor(Math.random() * actions.length)];
                bot.setControlState(lastaction,true);
                moving = 1;
                lasttime = bot.time.age;
                bot.activateItem();
            }
        }
    }
});

bot.on('spawn',function() {
    connected=1;
});

bot.on('end', function () {
    console.log("Disconnected.")
    bot.quit();
    lasttime = -1;
    moving = 0;
    connected=0;
});*/

// Command executing
function action_bot(action, args) {
  switch (action) {
    case 'say':
      let message = args.join(" ");
      if (message.startsWith('/')) {
        message = message.replace('/', './')
        bot.chat(message);
      } else {
        bot.chat(message);
      }
      break
    case 'run':
      let command = args.join(" ");
      if (!command.startsWith('/')) {
        command = '/' + command
        bot.chat(command);
      } else {
        bot.chat(command);
      }
      break
    default:
      console.log('Unknown action');
      break
}}

const readline = rl.createInterface({
  input: process.stdin,
  output: process.stdout
});


function callAction() {
  readline.question('Action: ', (input) => {
    const [action, ...args] = input.trim().split(' ');
    action_bot(action, args);
    callAction();
  });
}

bot.on('end', function () {
    console.log("Disconnected.")
});
