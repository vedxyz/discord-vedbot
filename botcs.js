// https://discord.com/api/oauth2/authorize?client_id=747882956520947814&permissions=8&scope=bot

const fs = require("fs"); 
const Discord = require('discord.js');
const cfg = require('./config.json');
const client = new Discord.Client();

let logChannel_CS = "802972980371128420"; // bot-log  802972980371128420

let csServer = "774334667972280320"; // real 774334667972280320

let sectionRoles = {
  "CS1021": "802122896864182304", // 802122896864182304
  "CS1022": "802122943940263946", // 802122943940263946
  "CS1023": "802122991361720372"  // 802122991361720372
};

client.once('ready', () => {
  
  console.log('>> Ready!');
  
  // Grab required channels
  let clientChannelCache = client.channels.cache;
  logChannel_CS = clientChannelCache.get(logChannel_CS);
  
  logChannel_CS.send("```=> VedBot has initialized successfully.```");
  
});

client.on('message', message => {
  
  if (message.channel.type === "dm") {
    
    message.channel.send("Sorry, I'm currently functional only if you reach out to me on the server, rather than with a private message like this.\nIf you needed help, try calling " + cfg.prefix + "help on the server.\nIf that ***really*** doesn't solve your problem, contact <@123867745191198720>.")
    
  }
  
  if (message.guild.id === csServer) {
    
    if (message.author.id !== client.user.id) {
      
      let msg = message.content.toLowerCase().split(/\s/);
      
      // Mobile-desktop forum link helper
      let DH_links = [];
      let regExp_linkDH = /^https?:\/\/(mobile|forum)\.donanimhaber.com\//i;
      
      msg.filter(e => e.startsWith("http")).forEach(function (e) { 
        
        let DH_convertedUrl = e.replace(regExp_linkDH, (match, p1) => "https://" + (p1.toLowerCase() === "mobile" ? "forum" : "mobile") + ".donanimhaber.com/");
        
        if (DH_convertedUrl !== e) DH_links.push(DH_convertedUrl);
        
      });
      
      if (DH_links.length) {
        
        let DH_linksString = DH_links.map((e, i) => "Link #" + (i + 1) + ": <" + e + ">").join("\n");
        message.reply("Alternate desktop/mobile link(s):\n" + DH_linksString);
        
      }
      
    }
    
    // Commands module
    
    if (!message.content.startsWith(cfg.prefix)) return;
    
    let args = message.content.slice(cfg.prefix.length).split(" ");
    let command = args.shift();
    let guildmember = message.guild.members.cache.get(message.author.id);
    
    if (guildmember.hasPermission("ADMINISTRATOR")) { // Admin commands
      
      if (command === "killbot") { // Command for killing bot process
        
        logChannel_CS.send("=> Killing the bot.").then(() => process.exit());
        return;
        
      }
      
      // Add more admin commands here
      // ...
      
    }
    
    if (command === "setrole") {
      
      let userToSet = message.guild.members.cache.get(message.author.id);
      
      if (args.length === 3) {
        
        if (sectionRoles.hasOwnProperty(args[0].toUpperCase() + args[1] + args[2])) {
          
          Object.entries(sectionRoles)
                .filter(e => e[0]
                .startsWith(args[0].toUpperCase() + args[1]))
                .map(e => e[1])
                .forEach(e => userToSet.roles.remove(e));
          
          setTimeout(() => userToSet.roles.add(sectionRoles[args[0].toUpperCase() + args[1] + args[2]]), 1500);
          
          message.react("👍");
          
        } else {
          
          message.reply("ERROR: Unrecognized arguments. Are you sure this course/section exists?");
          
        }
        
      } else {
        
        message.reply("ERROR: Insufficient arguments. Use `v!help` to see syntax.");
        
      }
      
      setTimeout(() => message.delete(), 30000);
      return;
      
    }
    
    if (command === "removerole") {
      
      let userToSet = message.guild.members.cache.get(message.author.id);
      
      if (args.length === 3) {
        
        if (sectionRoles.hasOwnProperty(args[0].toUpperCase() + args[1] + args[2])) {
          
          if (userToSet.roles.cache.has(sectionRoles[args[0].toUpperCase() + args[1] + args[2]])) {
            
            userToSet.roles.remove(sectionRoles[args[0].toUpperCase() + args[1] + args[2]]);
            
            message.react("👍");
            
          } else {
            
            message.reply("ERROR: You currently do not have this role.");
            
          }
          
        } else {
          
          message.reply("ERROR: Unrecognized arguments. Are you sure this course/section exists?");
          
        }
        
      } else {
        
        message.reply("ERROR: Insufficient arguments. Use `v!help` to see syntax.");
        
      }
      
      setTimeout(() => message.delete(), 30000);
      return;
      
    }
    
    if (command === "help") {
      
      message.channel.send("**How to use**:\n" +
                            "`v!setrole [DEPARTMENT] [COURSE ID] [SECTION]`\n" +
                            "`v!removerole [DEPARTMENT] [COURSE ID] [SECTION]`\n" +
                            "Example: `v!setrole CS 102 2`");
      return;
      
    }
    
    
    // Add more commands here
    // ...
    
    message.channel.send(`> \`${message.content}\`\n<@${message.author.id}> Unfortunately, no such command exists for me at this time, or you don't have the permission to use it ¯\\_(ツ)\_/¯.`);
    
  }
  
  
});



client.login(cfg.token);