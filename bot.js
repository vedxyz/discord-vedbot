// https://discord.com/api/oauth2/authorize?client_id=747882956520947814&permissions=8&scope=bot

const fs = require("fs"); 
const Discord = require('discord.js');
const cfg = require('./config.json');
const client = new Discord.Client();

let logChannel = "747640224687063051"; // sunucu-log
let modChannel = "747640969675145247"; // mod-sohbet
let entryChannel = "747640369998594168"; // giriş-kanalı
let ruleChannel = "747640189521887392"; // kurallar
let roleChannel = "747640528107208766"; // rol-seçimi
let englishChannel = "757528071183007827"; // english

let ruleMessage_1 = "747986938035699733"; // Rule message part 1
let ruleMessage_2 = "747987100091154524"; // Rule message part 2
let ruleMessage = "747987290625802331"; // Actual rule reaction message
let roleMessage = "747994966109847662"; // Role reaction message

let roleRulesConfirmation_roleID = "748022553502548009"; // Role that keeps track of whether rules were confirmed

let role9_roleID = "747937428987445298"; // Role for 9th grade
let role10_roleID = "747937642662068254"; // Role for 10th grade
let role11_roleID = "747937653768585217"; // Role for 11th grade
let role12_roleID = "747937661393829988"; // Role for 12th grade
let roleUni_roleID = "747937764745412678"; // Role for university undergraduates 
let roleGrad_roleID = "747937816155258881"; // Role for highschool graduates

let roleMF_roleID = "747939067030667274"; // Role for MathScience
let roleTM_roleID = "747938960923426956"; // Role for TurkishMath
let roleTS_roleID = "747939082151264346"; // Role for TurkishSocial
let roleDIL_roleID = "747939096097194165"; // Role for Linguistics

let roleMemberConfirmed_roleID = "747940776981561365"; // Role for final confirmation of members

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
  
  logChannel.send("=> VedBot has initialized successfully.");
  
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
  
});

client.on('message', message => {
  
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
  
  logChannel.send(`:o: -> Joined the server: **${member.displayName}**#${member.user.discriminator}`);
  
  entryChannel.send(`Merhaba <@${member.id}> :),\nSunucunun tamamına erişmek için;\n1- <#${ruleChannel.id}>'ı onaylamanız\n2- <#${roleChannel.id}> kanalından bölüm ve sınıf seçmeniz\ngerekmekte.`);
  
});

client.on('guildMemberRemove', member => {
  
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
