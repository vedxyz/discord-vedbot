// https://discord.com/api/oauth2/authorize?client_id=747882956520947814&permissions=8&scope=bot

const fs = require("fs"); 
const Discord = require('discord.js');
const cfg = require('./config.json');
const client = new Discord.Client();

let logchannel = "747640224687063051"; // sunucu-log
let modchannel = "747640969675145247"; // mod-sohbet
let entrychannel = "747640369998594168"; // giriş-kanalı
let rulechannel = "747640189521887392"; // kurallar
let rolechannel = "747640528107208766"; // rol-seçimi

let rulemessageM1 = "747986938035699733"; // Rule message part 1
let rulemessageM2 = "747987100091154524"; // Rule message part 2
let rulemessage = "747987290625802331"; // Actual rule reaction message
let rolemessage = "747994966109847662"; // Role reaction message

let ruleroleID = "748022553502548009"; // Role that keeps track of whether rules were confirmed

let role9roleID = "747937428987445298"; // Role for 9th grade
let role10roleID = "747937642662068254"; // Role for 10th grade
let role11roleID = "747937653768585217"; // Role for 11th grade
let role12roleID = "747937661393829988"; // Role for 12th grade
let roleUniroleID = "747937764745412678"; // Role for university undergraduates 
let roleGradroleID = "747937816155258881"; // Role for highschool graduates

let roleMFroleID = "747939067030667274"; // Role for MathScience
let roleTMroleID = "747938960923426956"; // Role for TurkishMath
let roleTSroleID = "747939082151264346"; // Role for TurkishSocial
let roleDILroleID = "747939096097194165"; // Role for Linguistics

let roleconfirmedID = "747940776981561365"; // Role for final confirmation of members

const isDigit = n => n >= 0 && n <= 9;

client.once('ready', () => {
  console.log('>> Ready!');
  
  // Grab required channels
  let clientChannelCache = client.channels.cache;
  logchannel = clientChannelCache.get(logchannel);
  modchannel = clientChannelCache.get(modchannel);
  entrychannel = clientChannelCache.get(entrychannel);
  rulechannel = clientChannelCache.get(rulechannel);
  rolechannel = clientChannelCache.get(rolechannel);
  
  logchannel.send("=> VedBot has initialized successfully.");
  
  // Fetch required messages
  rulechannel.messages.fetch(rulemessage).then(msg => rulemessage = msg);
  rulechannel.messages.fetch(rulemessageM1).then(msg => rulemessageM1 = msg);
  rulechannel.messages.fetch(rulemessageM2).then(msg => rulemessageM2 = msg);
  rolechannel.messages.fetch(rolemessage).then(msg => rolemessage = msg);
  
  // Construct a set to prevent misactions caused by removal of reactions by the bot
  client.recentlyRemovedReactions = new Set();
});

client.on('message', message => {
  
  // 747882956520947814 is the bot's ID.
  if (message.author.id !== "747882956520947814") {
    
    let msg = message.content.toLowerCase().split(" ");
    
    // Gayet iyi module
    let keywords = [["kız", "kızla", "kızlarla", "kızı", "kızın", "kızların", "kıza", "kızlı", "kiz", "kizla", "kizlarla", "kizi", "kizin", "kizlarin", "kiza", "kizli"], 
                    ["erkek", "erkekle", "erkeklerle", "erkeği", "erkegi", "erkeğin", "erkegin", "erkeklerin", "erkeğe", "erkege", "erkekli"], 
                    ["voleybol", "basketbol", "halısaha", "halisaha", "tenis", "badminton", "futbol", "bilardo"], 
                    ["karışık", "beraber", "birlikte", "karşılıklı", "karisik", "karsilikli", "toplu", "topluca"]];
    keywords.forEach((e, i) => e.some(word => msg.indexOf(word) !== -1 ? true : false) ? keywords[i] = true : null);
    if (keywords.every(e => e === true)) {
      message.channel.send(`> ${message.content.replace(/^> .*\n/, "")}\n<@${message.author.id}> **gayet iyi** <:afro:744923369279062156>`);
      return;
    }
    
  }
  
  // Commands module
  
  if (!message.content.startsWith(cfg.prefix)) return;
  
  let args = message.content.slice(cfg.prefix.length).split(" ");
  let command = args.shift();
  
  
  if (message.channel.id === modchannel.id) { // Admin commands
    
    if (command === "setrule") { // Command for setting community rules 
      
      let ruleID = args[0];
      let ruleContent = args.slice(1).join(" ");
      let ruleKey = `rule${ruleID}`;
      
      // Check for errors in command syntax
      if (ruleID < 1 || ruleID > 15 || ![...ruleID].every(isDigit)) {
        message.channel.send(`Usage: \`${cfg.prefix}setrule [ID] [rule content]\`\nNote: 0 < ID < 16\nExample: \`${cfg.prefix}setrule 7 The content of the rule to be set.\``);
        return;
      }
      
      console.log(`Writing to ${ruleKey}: ${ruleContent}`);
      cfg[ruleKey] = ruleContent;
      
      // Update config file with new rule
      fs.writeFile("config.json", JSON.stringify(cfg), err => { 
        
        if (err) throw err; 
        
        // Log the new rule
        console.log("Wrote new rule successfully.");
        message.channel.send(`**${ruleKey}:** ${cfg[ruleKey]}`);
      });
      
      return;
    }
    
    
    if (command === "killbot") { // Command for killing bot process
      modchannel.send("=> Killing the bot.").then(() => process.exit());
      return;
    }
    
    // Add more admin commands here
    // ...
    
  }
  
  if (command === "rule") { // Command for referencing rules
    
    let ruleID = args[0];
    let ruleKey = `rule${ruleID}`;
    
    if (!args.length) {
      let ruleStack = [];
      
      for (let i = 1; i <= 15; i++) {
        ruleKey = "rule" + i;
        ruleStack.push(`**#${i}:** ${cfg[ruleKey]}`);
      }
      
      message.channel.send(ruleStack.join("\n\n"), { split: true });
      
      return;
    }
    
    if (ruleID < 1 || ruleID > 15 || ![...ruleID].every(isDigit)) {
      message.channel.send(`Usage: \`${cfg.prefix}rule [ID]\`\nNote: 0 < ID < 16\nLeave ID option blank to list all rules.`);
      
      return;
    }
    
    message.channel.send(`**#${ruleID}:** ${cfg[ruleKey]}`);
    return;
  }
  
  // Add more commands here
  // ...
  
  
  
  
  
  message.channel.send(`> \`${message.content}\`\n<@${message.author.id}> Unfortunately, no such command exists for me at this time ¯\\_(ツ)\_/¯.`);
  
});

client.on('guildMemberAdd', member => {
  logchannel.send(`:o: -> Joined the server: **${member.displayName}**#${member.user.discriminator}`);
  
  entrychannel.send(`Merhaba <@${member.id}> :),\nSunucunun tamamına erişmek için;\n1- <#${rulechannel.id}>'ı onaylamanız\n2- <#${rolechannel.id}> kanalından bölüm ve sınıf seçmeniz\ngerekmekte.`);
});

client.on('guildMemberRemove', member => {
  logchannel.send(`:x: -> Left the server: **${member.displayName}**#${member.user.discriminator}`);
});



function roleSwitchSafety (caller, gradecheck, guildmember, reaction, memberID) {
  
  if (caller !== "🇦" && gradecheck[0]) {
    gradecheck[0] = false;
    guildmember.roles.remove(role9roleID);
    reaction.message.reactions.cache.get("🇦").users.remove(memberID);
  } 
  
  if (caller !== "🇧" && gradecheck[1]) {
    gradecheck[1] = false;
    guildmember.roles.remove(role10roleID);
    reaction.message.reactions.cache.get("🇧").users.remove(memberID);
  } 
  
  if (caller !== "🇨" && gradecheck[2]) {
    gradecheck[2] = false;
    guildmember.roles.remove(role11roleID);
    reaction.message.reactions.cache.get("🇨").users.remove(memberID);
  } 
  
  if (caller !== "🇩" && gradecheck[3]) {
    gradecheck[3] = false;
    guildmember.roles.remove(role12roleID);
    reaction.message.reactions.cache.get("🇩").users.remove(memberID);
  } 
  
  if (caller !== "🇲" && gradecheck[4]) {
    gradecheck[4] = false;
    guildmember.roles.remove(roleGradroleID);
    reaction.message.reactions.cache.get("🇲").users.remove(memberID);
  } 
  
  if (caller !== "🇺" && gradecheck[5]) {
    gradecheck[5] = false;
    guildmember.roles.remove(roleUniroleID);
    reaction.message.reactions.cache.get("🇺").users.remove(memberID);
  }
  
}


client.on('messageReactionAdd', function (reaction, member) {
  
  if (reaction.message.id === rulemessage.id || reaction.message.id === rolemessage.id) {
    
    let guildmember = reaction.message.guild.members.cache.get(member.id);
    
    let gradecheck = [guildmember.roles.cache.has(role9roleID),
                      guildmember.roles.cache.has(role10roleID),
                      guildmember.roles.cache.has(role11roleID),
                      guildmember.roles.cache.has(role12roleID),
                      guildmember.roles.cache.has(roleGradroleID),
                      guildmember.roles.cache.has(roleUniroleID)];
    let grade = gradecheck.indexOf(true);
    
    let reactionConfirmsRules = false;
    
    let emojiname = reaction.emoji.name;
    
    if (reaction.message.id === rulemessage.id) {
      
      if (emojiname === "👍") {
        guildmember.roles.add(ruleroleID);
        reactionConfirmsRules = true;
      } else {
        reaction.users.remove(member.id);
        return;
      }
      
    } else if (reaction.message.id === rolemessage.id) {
      
      if (!guildmember.roles.cache.has(roleconfirmedID)) {
        if (emojiname === "🔴") {
          guildmember.roles.add(roleMFroleID);
        } else if (emojiname === "🔵") {
          guildmember.roles.add(roleTMroleID);
        } else if (emojiname === "🟢") {
          guildmember.roles.add(roleTSroleID);
        } else if (emojiname === "🟣") {
          guildmember.roles.add(roleDILroleID);
        } else if (emojiname === "🇦") {
          
          guildmember.roles.add(role9roleID);
          gradecheck[0] = true;
          
          if (grade !== -1) roleSwitchSafety("🇦", gradecheck, guildmember, reaction, member.id);
          
        } else if (emojiname === "🇧") {
          
          guildmember.roles.add(role10roleID);
          gradecheck[1] = true;
            
          if (grade !== -1) roleSwitchSafety("🇧", gradecheck, guildmember, reaction, member.id);
            
        } else if (emojiname === "🇨") {
          
          guildmember.roles.add(role11roleID);
          gradecheck[2] = true;
            
          if (grade !== -1) roleSwitchSafety("🇨", gradecheck, guildmember, reaction, member.id);
          
        } else if (emojiname === "🇩") {
          
          guildmember.roles.add(role12roleID);
          gradecheck[3] = true;
            
          if (grade !== -1) roleSwitchSafety("🇩", gradecheck, guildmember, reaction, member.id);
          
        } else if (emojiname === "🇲") {
          
          guildmember.roles.add(roleGradroleID);
          gradecheck[4] = true;
            
          if (grade !== -1) roleSwitchSafety("🇲", gradecheck, guildmember, reaction, member.id);
          
        } else if (emojiname === "🇺") {
          
          guildmember.roles.add(roleUniroleID);
          gradecheck[5] = true;
            
          if (grade !== -1) roleSwitchSafety("🇺", gradecheck, guildmember, reaction, member.id);
          
        } else {
          reaction.users.remove(member.id);
        }
        
      } else {
        
        if (emojiname === "🇷") {
          
          guildmember.roles.remove(roleconfirmedID);
          guildmember.roles.remove(roleMFroleID);
          guildmember.roles.remove(roleTSroleID);
          guildmember.roles.remove(roleTMroleID);
          guildmember.roles.remove(roleDILroleID);
          reaction.message.reactions.cache.get("🔴").users.remove(member.id);
          reaction.message.reactions.cache.get("🟣").users.remove(member.id);
          reaction.message.reactions.cache.get("🔵").users.remove(member.id);
          reaction.message.reactions.cache.get("🟢").users.remove(member.id);
          
          roleSwitchSafety(null, gradecheck, guildmember, reaction, member.id);
          
          reaction.users.remove(member.id);
          logchannel.send(`:regional_indicator_r: -> **${guildmember.displayName}**#${member.discriminator} just reset their roles.`);
          return;
          
        } else {
          reaction.users.remove(member.id);
        }
        
      }
      
    }
    
    
    if (guildmember.roles.cache.has(ruleroleID) || reactionConfirmsRules) {
      
      let countgrade = gradecheck.reduce((acc, val) => acc += val ? 1 : 0, 0);
      let hasTS = rolemessage.reactions.cache.has("🟢");
      let hasTM = rolemessage.reactions.cache.has("🔵");
      let hasMF = rolemessage.reactions.cache.has("🔴");
      let hasDIL = rolemessage.reactions.cache.has("🟣");
      
      if ((guildmember.roles.cache.has(roleMFroleID) || 
           guildmember.roles.cache.has(roleTMroleID) ||
           guildmember.roles.cache.has(roleTSroleID) ||
           guildmember.roles.cache.has(roleDILroleID) ) && countgrade === 1) {
        
        guildmember.roles.add(roleconfirmedID);
        
        if (gradecheck[0]) {
          client.recentlyRemovedReactions.add(`${member.id}A`);
          rolemessage.reactions.cache.get("🇦").users.remove(member.id);
        } 
        if (gradecheck[1]) {
          client.recentlyRemovedReactions.add(`${member.id}B`);
          rolemessage.reactions.cache.get("🇧").users.remove(member.id);
        } 
        if (gradecheck[2]) {
          client.recentlyRemovedReactions.add(`${member.id}C`);
          rolemessage.reactions.cache.get("🇨").users.remove(member.id);
        } 
        if (gradecheck[3]) {
          client.recentlyRemovedReactions.add(`${member.id}D`);
          rolemessage.reactions.cache.get("🇩").users.remove(member.id);
        } 
        if (gradecheck[4]) {
          client.recentlyRemovedReactions.add(`${member.id}M`);
          rolemessage.reactions.cache.get("🇲").users.remove(member.id);
        } 
        if (gradecheck[5]) {
          client.recentlyRemovedReactions.add(`${member.id}U`);
          rolemessage.reactions.cache.get("🇺").users.remove(member.id);
        }
        if (hasMF) {
          client.recentlyRemovedReactions.add(`${member.id}MF`);
          rolemessage.reactions.cache.get("🔴").users.remove(member.id);
        }
        if (hasTM) {
          client.recentlyRemovedReactions.add(`${member.id}TM`);
          rolemessage.reactions.cache.get("🔵").users.remove(member.id);
        }
        if (hasTS) {
          client.recentlyRemovedReactions.add(`${member.id}TS`);
          rolemessage.reactions.cache.get("🟢").users.remove(member.id);
        }
        if (hasDIL) {
          client.recentlyRemovedReactions.add(`${member.id}DIL`);
          rolemessage.reactions.cache.get("🟣").users.remove(member.id);
        }
        
      }
      
    }
    
  } else if (reaction.message.id === rulemessageM1.id || reaction.message.id === rulemessageM2.id) {
    reaction.users.remove(member.id);
  }
  
});


client.on("messageReactionRemove", function (reaction, member) {
  
  //console.log(client.recentlyRemovedReactions);
  
  if (client.recentlyRemovedReactions.has(`${member.id}A`)) return client.recentlyRemovedReactions.delete(`${member.id}A`);
  if (client.recentlyRemovedReactions.has(`${member.id}B`)) return client.recentlyRemovedReactions.delete(`${member.id}B`);
  if (client.recentlyRemovedReactions.has(`${member.id}C`)) return client.recentlyRemovedReactions.delete(`${member.id}C`);
  if (client.recentlyRemovedReactions.has(`${member.id}D`)) return client.recentlyRemovedReactions.delete(`${member.id}D`);
  if (client.recentlyRemovedReactions.has(`${member.id}M`)) return client.recentlyRemovedReactions.delete(`${member.id}M`);
  if (client.recentlyRemovedReactions.has(`${member.id}U`)) return client.recentlyRemovedReactions.delete(`${member.id}U`);
  if (client.recentlyRemovedReactions.has(`${member.id}MF`)) return client.recentlyRemovedReactions.delete(`${member.id}MF`);
  if (client.recentlyRemovedReactions.has(`${member.id}TS`)) return client.recentlyRemovedReactions.delete(`${member.id}TS`);
  if (client.recentlyRemovedReactions.has(`${member.id}DIL`)) return client.recentlyRemovedReactions.delete(`${member.id}DIL`);
  if (client.recentlyRemovedReactions.has(`${member.id}TM`)) return client.recentlyRemovedReactions.delete(`${member.id}TM`);
  

  let guildmember = reaction.message.guild.members.cache.get(member.id);
  
  if ((reaction.message.id === rulemessage.id || reaction.message.id === rolemessage.id)) {
    
    let emojiname = reaction.emoji.name;
      
    if (emojiname === "👍" && reaction.message.id === rulemessage.id) {
      guildmember.roles.remove(ruleroleID);
    } else if (reaction.message.id === rolemessage.id) {
      if (emojiname === "🔴") {
        guildmember.roles.remove(roleMFroleID);
      } else if (emojiname === "🟢") {
        guildmember.roles.remove(roleTSroleID);
      } else if (emojiname === "🟣") {
        guildmember.roles.remove(roleDILroleID);
      } else if (emojiname === "🇦") {
        guildmember.roles.remove(role9roleID);
      } else if (emojiname === "🇧") {
        guildmember.roles.remove(role10roleID);
      } else if (emojiname === "🇨") {
        guildmember.roles.remove(role11roleID);
      } else if (emojiname === "🇩") {
        guildmember.roles.remove(role12roleID);
      } else if (emojiname === "🇲") {
        guildmember.roles.remove(roleGradroleID);
      } else if (emojiname === "🇺") {
        guildmember.roles.remove(roleUniroleID);
      } else if (emojiname === "🔵") {
        if (client.recentlyRemovedReactions.has(`${member.id}TM`)) return client.recentlyRemovedReactions.delete(`${member.id}TM`);
        guildmember.roles.remove(roleTMroleID);
      } 
    } 
  }
});



client.login(cfg.token);
