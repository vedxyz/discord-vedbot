// https://discord.com/api/oauth2/authorize?client_id=747882956520947814&permissions=8&scope=bot

const fs = require("fs"); 
const Discord = require('discord.js');
const cfg = require('./config.json');
const client = new Discord.Client();

let logChannel = "734656031975538769"; // sunucu-log
let modChannel = "732522268160294915"; // mod-sohbet
let entryChannel = "747482854891585587"; // giriş-kanalı
let ruleChannel = "748339001680855150"; // kurallar
let roleChannel = "733985125020336163"; // rol-seçimi
let englishChannel = "757528071183007827"; // english

let ruleMessage_1 = "748343437815971881"; // Rule message part 1
let ruleMessage_2 = "748343468518015146"; // Rule message part 2
let ruleMessage = "748343495630127114"; // Actual rule reaction message
let roleMessage = "748345920885751838"; // Role reaction message

let roleRulesConfirmation_roleID = "748497006632370276"; // Role that keeps track of whether rules were confirmed

let role9_roleID = "747564711003947110"; // Role for 9th grade
let role10_roleID = "747480172831178783"; // Role for 10th grade
let role11_roleID = "747337717230075926"; // Role for 11th grade
let role12_roleID = "747337599781175437"; // Role for 12th grade
let roleUni_roleID = "747336531055869974"; // Role for university undergraduates 
let roleGrad_roleID = "747337898801627206"; // Role for highschool graduates

let roleMF_roleID = "732233176126324788"; // Role for MathScience
let roleTM_roleID = "732233054642372632"; // Role for TurkishMath
let roleTS_roleID = "732233226894180423"; // Role for TurkishSocial
let roleDIL_roleID = "732233196707774464"; // Role for Linguistics

let roleMemberConfirmed_roleID = "732149516735873045"; // Role for final confirmation of members

let logChannel_CS = "802972980371128420"; // bot-log  802972980371128420
let crCommandChannel = "715297879132078131";

let csServer = "774334667972280320"; // real 774334667972280320
let crServer = "237606889863512074"; 

let sectionRoles = {
  "CS1021": "802122896864182304", // 802122896864182304
  "CS1022": "802122943940263946", // 802122943940263946
  "CS1023": "802122991361720372"  // 802122991361720372
};

const isDigit = n => n >= 0 && n <= 9;

client.once('ready', () => {
  
  console.log('>> Ready!');
  
  // Grab required channels
  let clientChannelCache = client.channels.cache;
  logChannel = clientChannelCache.get(logChannel);
  modChannel = clientChannelCache.get(modChannel);
  entryChannel = clientChannelCache.get(entryChannel);
  ruleChannel = clientChannelCache.get(ruleChannel);
  roleChannel = clientChannelCache.get(roleChannel);
  
  logChannel.send("```=> VedBot is running.```");
  
  // Fetch required messages
  ruleChannel.messages.fetch(ruleMessage).then(msg => ruleMessage = msg);
  ruleChannel.messages.fetch(ruleMessage_1).then(msg => ruleMessage_1 = msg);
  ruleChannel.messages.fetch(ruleMessage_2).then(msg => ruleMessage_2 = msg);
  roleChannel.messages.fetch(roleMessage).then(msg => roleMessage = msg);
  
  // Construct a set to prevent misactions caused by removal of reactions by the bot
  client.recentlyRemovedReactions = new Set();
  
  // Set modules to ON by default
  client.gayetiyiModule = true;
  client.mizyazModule = true;
  client.harunabiModule = true;
  
  // CS server
  logChannel_CS = clientChannelCache.get(logChannel_CS);
  logChannel_CS.send("```=> VedBot is running.```");
  
  // CR server
  crCommandChannel = clientChannelCache.get(crCommandChannel);
  
});

client.on('voiceStateUpdate', (oldState, newState) => {
  
  if (oldState.guild.id === crServer && oldState.member.id === "234395307759108106" && newState.channelID === null) {
    
    crCommandChannel.send({ files: ["https://cdn.discordapp.com/attachments/795054934470557728/814976435021283429/5kuavjmbnhz11.png"] });
    
    console.log("update voice");
  }
  
});

client.on('message', message => {
  
  if (message.channel.type === "dm" && message.author.id !== client.user.id) {
    
    message.channel.send("Sorry, I'm currently functional only if you reach out to me on the server, rather than with a private message like this.\nIf you needed help, try calling `" + cfg.prefix + "help` on the server.\nIf that ***really*** doesn't solve your problem, contact <@123867745191198720>.")
    return;
    
  }
  
  if (message.guild === null || message.guild.id === crServer) return;
  
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
    
    
    return;
  }
  
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
    
    // Harun abi module
    let regExp_harunabi = /\bharun abi\S*/i;
    let harunabiFlag = message.content.match(regExp_harunabi);
    
    if (harunabiFlag !== null && harunabiFlag.length > 0 && client.harunabiModule) {
      
      message.channel.send(`<@${message.author.id}> Aaa demek ki harun abi muhabbeti o yani kadın olduğuma inanmıyorlar demek kiii mxlwkdmxsşşsöcmsşqödmdlaşs gerçekten mi yaa xkşamdödşsşdmdöd oha söylemişti bi arkadaş burda değişik insanlar var diye demek ki ondanmış dlspdmcmsşdlmfdl cidden çok iyi yaaa 😂`);
      return;
      
    }
    
    // Gayet iyi module
    let keywords = [["kız", "kızla", "kızlarla", "kızı", "kızın", "kızların", "kıza", "kızlı", "kızlar", "kiz", "kizla", "kizlarla", "kizi", "kizin", "kizlarin", "kiza", "kizli", "kizlar"], 
                    ["erkek", "erkekle", "erkeklerle", "erkeği", "erkegi", "erkeğin", "erkegin", "erkeklerin", "erkeğe", "erkege", "erkekli", "erkekler"], 
                    ["voleybol", "basketbol", "halısaha", "halisaha", "tenis", "badminton", "futbol", "bilardo", "yuzme", "yüzme", "havuz", "deniz", "güreş", "gures", "parti"], 
                    ["karışık", "beraber", "birlikte", "karşılıklı", "karisik", "karsilikli", "toplu", "topluca"]];
    
    keywords.forEach((e, i) => e.some(word => msg.indexOf(word) !== -1 ? true : false) ? keywords[i] = true : null);
    
    if (client.gayetiyiModule && keywords.every(e => e === true)) {
      
      let localResponse = message.channel.id !== englishChannel ? "gayet iyi" : "very well";
      message.channel.send(`> ${message.content.replace(/^> .*\n/, "")}\n<@${message.author.id}> **${localResponse}** <:afro:744923369279062156>`);
      return;
      
    }
    
    // Mizyaz module
    let regExp_mizyaz = /[i|İ]slo+[ş|s]\S*/i;
    let mizyazFlag = message.content.match(regExp_mizyaz);
    
    if (mizyazFlag !== null && mizyazFlag.length > 0 && client.mizyazModule && message.author.id !== "644968168040955904") {
      
      message.delete();
      message.channel.send(`<@${message.author.id}> says to <@644968168040955904>:\n> ${message.content.replace(/^> .*\n/, "")}`);
      return;
      
    }
    
  }
  
  // Commands module
  
  if (!message.content.startsWith(cfg.prefix)) return;
  
  let args = message.content.slice(cfg.prefix.length).split(" ");
  let command = args.shift();
  let guildmember = message.guild.members.cache.get(message.author.id);
  
  if (guildmember.hasPermission("ADMINISTRATOR")) { // Admin commands
    
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
      
      logChannel.send("=> Killing the bot.").then(() => process.exit());
      return;
      
    }
    
    
    if (command === "togglemodule") {
      
      if (args.length === 0) {
        
        message.channel.send(`Modules:\n_mizyaz_ -> **${client.mizyazModule ? "ENABLED" : "DISABLED"}**\n_gayetiyi_ -> **${client.gayetiyiModule ? "ENABLED" : "DISABLED"}**\n_harunabi_ -> **${client.harunabiModule ? "ENABLED" : "DISABLED"}**`);
        return;
        
      }
      
      let moduleKey = args[0] + "Module";
      if (client.hasOwnProperty(moduleKey)) {
        
        client[moduleKey] = !client[moduleKey];
        message.channel.send(`"${args[0]}" module is now **${client[moduleKey] ? "ENABLED" : "DISABLED"}**.`);
        
      } else {
        
        message.channel.send("No such module exists at this time.");
        
      }
      
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
  
  // Mizyaz's ID is 644968168040955904
  if (command === "togglemodule" && message.author.id === "644968168040955904") {
      
    if (args.length === 0) {
      
      message.channel.send("Toggle the _mizyaz_ module by using \`v!togglemodule mizyaz\`.");
      return;
      
    }
    
    if (args[0] === "mizyaz") {
      
      client.mizyazModule = client.mizyazModule ? false : true;
      message.channel.send(`"mizyaz" module is now **${client.mizyazModule ? "ENABLED" : "DISABLED"}**.`);
      
    }
    
    return;
    
  }
  
  
  if (command === "gayetiyikeywords") {
    
    let keywords = [["kız", "kızla", "kızlarla", "kızı", "kızın", "kızların", "kıza", "kızlı", "kızlar", "kiz", "kizla", "kizlarla", "kizi", "kizin", "kizlarin", "kiza", "kizli", "kizlar"], 
                    ["erkek", "erkekle", "erkeklerle", "erkeği", "erkegi", "erkeğin", "erkegin", "erkeklerin", "erkeğe", "erkege", "erkekli", "erkekler"], 
                    ["voleybol", "basketbol", "halısaha", "halisaha", "tenis", "badminton", "futbol", "bilardo", "yuzme", "yüzme", "havuz", "deniz", "güreş", "gures", "parti"], 
                    ["karışık", "beraber", "birlikte", "karşılıklı", "karisik", "karsilikli", "toplu", "topluca"]];
    
    message.channel.send("Use at least one word from each category to make a very well message <:afro:744923369279062156>:\n\n" + keywords.map(e => e.join(", ")).join("\n---\n"));
    return;
    
  }
  
  
  if (command === "help") {
    
    message.channel.send("**Commands** (prefix them with " + cfg.prefix + "):\n" +
                          "->setrule (admin)\n" +
                          "->killbot (admin)\n" +
                          "->togglemodule (admin)\n" +
                          "->rule\n" +
                          "->gayetiyikeywords\n" +
                          "->help");
    return;
    
  }
  
  
  // Add more commands here
  // ...
  
  message.channel.send(`> \`${message.content}\`\n<@${message.author.id}> Unfortunately, no such command exists for me at this time, or you don't have the permission to use it ¯\\_(ツ)\_/¯.`);
  
});

client.on('guildMemberAdd', member => {
  
  if (member.guild.id === csServer || member.guild.id === crServer) {
    return;
  }
  
  logChannel.send(`:o: -> Joined the server: **${member.displayName}**#${member.user.discriminator}`);
  
  entryChannel.send(`Merhaba <@${member.id}> :),\nSunucunun tamamına erişmek için;\n1- <#${ruleChannel.id}>'ı onaylamanız\n2- <#${roleChannel.id}> kanalından bölüm ve sınıf seçmeniz\ngerekmekte.`);
  
});

client.on('guildMemberRemove', member => {
  
  if (member.guild.id === crServer || member.guild.id === csServer) {
    return;
  }
  
  logChannel.send(`:x: -> Left the server: **${member.displayName}**#${member.user.discriminator}`);
  
});



function roleSwitchSafety (caller, gradecheck, guildmember, reaction, memberID) {
  
  if (caller !== "🇦" && gradecheck[0]) {
    gradecheck[0] = false;
    guildmember.roles.remove(role9_roleID);
    reaction.message.reactions.cache.get("🇦").users.remove(memberID);
  } 
  
  if (caller !== "🇧" && gradecheck[1]) {
    gradecheck[1] = false;
    guildmember.roles.remove(role10_roleID);
    reaction.message.reactions.cache.get("🇧").users.remove(memberID);
  } 
  
  if (caller !== "🇨" && gradecheck[2]) {
    gradecheck[2] = false;
    guildmember.roles.remove(role11_roleID);
    reaction.message.reactions.cache.get("🇨").users.remove(memberID);
  } 
  
  if (caller !== "🇩" && gradecheck[3]) {
    gradecheck[3] = false;
    guildmember.roles.remove(role12_roleID);
    reaction.message.reactions.cache.get("🇩").users.remove(memberID);
  } 
  
  if (caller !== "🇲" && gradecheck[4]) {
    gradecheck[4] = false;
    guildmember.roles.remove(roleGrad_roleID);
    reaction.message.reactions.cache.get("🇲").users.remove(memberID);
  } 
  
  if (caller !== "🇺" && gradecheck[5]) {
    gradecheck[5] = false;
    guildmember.roles.remove(roleUni_roleID);
    reaction.message.reactions.cache.get("🇺").users.remove(memberID);
  }
  
}


client.on('messageReactionAdd', function (reaction, member) {
  
  if (reaction.message.guild.id === crServer || reaction.message.guild.id === csServer) {
    return;
  }
  
  if (reaction.message.id === ruleMessage.id || reaction.message.id === roleMessage.id) {
    
    let guildmember = reaction.message.guild.members.cache.get(member.id);
    
    let gradeCheckArray = [guildmember.roles.cache.has(role9_roleID),
                      guildmember.roles.cache.has(role10_roleID),
                      guildmember.roles.cache.has(role11_roleID),
                      guildmember.roles.cache.has(role12_roleID),
                      guildmember.roles.cache.has(roleGrad_roleID),
                      guildmember.roles.cache.has(roleUni_roleID)];
    let gradeCheckFlag = gradeCheckArray.indexOf(true);
    
    let reactionConfirmsRules = false;
    
    let emojiName = reaction.emoji.name;
    
    if (reaction.message.id === ruleMessage.id) {
      
      if (emojiName === "👍") {
        guildmember.roles.add(roleRulesConfirmation_roleID);
        reactionConfirmsRules = true;
      } else {
        reaction.users.remove(member.id);
        return;
      }
      
    } else if (reaction.message.id === roleMessage.id) {
      
      if (!guildmember.roles.cache.has(roleMemberConfirmed_roleID)) {
        if (emojiName === "🔴") {
          guildmember.roles.add(roleMF_roleID);
        } else if (emojiName === "🔵") {
          guildmember.roles.add(roleTM_roleID);
        } else if (emojiName === "🟢") {
          guildmember.roles.add(roleTS_roleID);
        } else if (emojiName === "🟣") {
          guildmember.roles.add(roleDIL_roleID);
        } else if (emojiName === "🇦") {
          
          guildmember.roles.add(role9_roleID);
          gradeCheckArray[0] = true;
          
          if (gradeCheckFlag !== -1) roleSwitchSafety("🇦", gradeCheckArray, guildmember, reaction, member.id);
          
        } else if (emojiName === "🇧") {
          
          guildmember.roles.add(role10_roleID);
          gradeCheckArray[1] = true;
            
          if (gradeCheckFlag !== -1) roleSwitchSafety("🇧", gradeCheckArray, guildmember, reaction, member.id);
            
        } else if (emojiName === "🇨") {
          
          guildmember.roles.add(role11_roleID);
          gradeCheckArray[2] = true;
            
          if (gradeCheckFlag !== -1) roleSwitchSafety("🇨", gradeCheckArray, guildmember, reaction, member.id);
          
        } else if (emojiName === "🇩") {
          
          guildmember.roles.add(role12_roleID);
          gradeCheckArray[3] = true;
            
          if (gradeCheckFlag !== -1) roleSwitchSafety("🇩", gradeCheckArray, guildmember, reaction, member.id);
          
        } else if (emojiName === "🇲") {
          
          guildmember.roles.add(roleGrad_roleID);
          gradeCheckArray[4] = true;
            
          if (gradeCheckFlag !== -1) roleSwitchSafety("🇲", gradeCheckArray, guildmember, reaction, member.id);
          
        } else if (emojiName === "🇺") {
          
          guildmember.roles.add(roleUni_roleID);
          gradeCheckArray[5] = true;
            
          if (gradeCheckFlag !== -1) roleSwitchSafety("🇺", gradeCheckArray, guildmember, reaction, member.id);
          
        } else {
          reaction.users.remove(member.id);
        }
        
      } else {
        
        if (emojiName === "🇷") {
          
          guildmember.roles.remove(roleMemberConfirmed_roleID);
          guildmember.roles.remove(roleMF_roleID);
          guildmember.roles.remove(roleTS_roleID);
          guildmember.roles.remove(roleTM_roleID);
          guildmember.roles.remove(roleDIL_roleID);
          reaction.message.reactions.cache.get("🔴").users.remove(member.id);
          reaction.message.reactions.cache.get("🟣").users.remove(member.id);
          reaction.message.reactions.cache.get("🔵").users.remove(member.id);
          reaction.message.reactions.cache.get("🟢").users.remove(member.id);
          
          roleSwitchSafety(null, gradeCheckArray, guildmember, reaction, member.id);
          
          reaction.users.remove(member.id);
          logChannel.send(`:regional_indicator_r: -> **${guildmember.displayName}**#${member.discriminator} just reset their roles.`);
          return;
          
        } else {
          reaction.users.remove(member.id);
        }
        
      }
      
    }
    
    
    if (guildmember.roles.cache.has(roleRulesConfirmation_roleID) || reactionConfirmsRules) {
      
      let countgrade = gradeCheckArray.reduce((acc, val) => acc += val ? 1 : 0, 0);
      let hasTS = roleMessage.reactions.cache.has("🟢");
      let hasTM = roleMessage.reactions.cache.has("🔵");
      let hasMF = roleMessage.reactions.cache.has("🔴");
      let hasDIL = roleMessage.reactions.cache.has("🟣");
      
      if ((guildmember.roles.cache.has(roleMF_roleID) || 
           guildmember.roles.cache.has(roleTM_roleID) ||
           guildmember.roles.cache.has(roleTS_roleID) ||
           guildmember.roles.cache.has(roleDIL_roleID) ) && countgrade === 1) {
        
        guildmember.roles.add(roleMemberConfirmed_roleID);
        
        if (gradeCheckArray[0]) {
          client.recentlyRemovedReactions.add(`${member.id}A`);
          roleMessage.reactions.cache.get("🇦").users.remove(member.id);
        } 
        if (gradeCheckArray[1]) {
          client.recentlyRemovedReactions.add(`${member.id}B`);
          roleMessage.reactions.cache.get("🇧").users.remove(member.id);
        } 
        if (gradeCheckArray[2]) {
          client.recentlyRemovedReactions.add(`${member.id}C`);
          roleMessage.reactions.cache.get("🇨").users.remove(member.id);
        } 
        if (gradeCheckArray[3]) {
          client.recentlyRemovedReactions.add(`${member.id}D`);
          roleMessage.reactions.cache.get("🇩").users.remove(member.id);
        } 
        if (gradeCheckArray[4]) {
          client.recentlyRemovedReactions.add(`${member.id}M`);
          roleMessage.reactions.cache.get("🇲").users.remove(member.id);
        } 
        if (gradeCheckArray[5]) {
          client.recentlyRemovedReactions.add(`${member.id}U`);
          roleMessage.reactions.cache.get("🇺").users.remove(member.id);
        }
        if (hasMF) {
          client.recentlyRemovedReactions.add(`${member.id}MF`);
          roleMessage.reactions.cache.get("🔴").users.remove(member.id);
        }
        if (hasTM) {
          client.recentlyRemovedReactions.add(`${member.id}TM`);
          roleMessage.reactions.cache.get("🔵").users.remove(member.id);
        }
        if (hasTS) {
          client.recentlyRemovedReactions.add(`${member.id}TS`);
          roleMessage.reactions.cache.get("🟢").users.remove(member.id);
        }
        if (hasDIL) {
          client.recentlyRemovedReactions.add(`${member.id}DIL`);
          roleMessage.reactions.cache.get("🟣").users.remove(member.id);
        }
        
      }
      
    }
    
  } else if (reaction.message.id === ruleMessage_1.id || reaction.message.id === ruleMessage_2.id) {
    reaction.users.remove(member.id);
  }
  
});


client.on("messageReactionRemove", function (reaction, member) {
  
  //console.log(client.recentlyRemovedReactions);
  if (reaction.message.guild.id === crServer || reaction.message.guild.id === csServer) {
    return;
  }
  
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
  
  if ((reaction.message.id === ruleMessage.id || reaction.message.id === roleMessage.id)) {
    
    let emojiname = reaction.emoji.name;
    
    if (emojiname === "👍" && reaction.message.id === ruleMessage.id) {
      guildmember.roles.remove(roleRulesConfirmation_roleID);
    } else if (reaction.message.id === roleMessage.id) {
      if (emojiname === "🔴") {
        guildmember.roles.remove(roleMF_roleID);
      } else if (emojiname === "🟢") {
        guildmember.roles.remove(roleTS_roleID);
      } else if (emojiname === "🟣") {
        guildmember.roles.remove(roleDIL_roleID);
      } else if (emojiname === "🇦") {
        guildmember.roles.remove(role9_roleID);
      } else if (emojiname === "🇧") {
        guildmember.roles.remove(role10_roleID);
      } else if (emojiname === "🇨") {
        guildmember.roles.remove(role11_roleID);
      } else if (emojiname === "🇩") {
        guildmember.roles.remove(role12_roleID);
      } else if (emojiname === "🇲") {
        guildmember.roles.remove(roleGrad_roleID);
      } else if (emojiname === "🇺") {
        guildmember.roles.remove(roleUni_roleID);
      } else if (emojiname === "🔵") {
        if (client.recentlyRemovedReactions.has(`${member.id}TM`)) return client.recentlyRemovedReactions.delete(`${member.id}TM`);
        guildmember.roles.remove(roleTM_roleID);
      } 
    } 
  }
});



client.login(cfg.token);
