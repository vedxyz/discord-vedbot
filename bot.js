// https://discord.com/api/oauth2/authorize?client_id=747882956520947814&permissions=8&scope=bot

const fs = require("fs"); 
const Discord = require('discord.js');
const cfg = require('./config.json');
const client = new Discord.Client();

let logchannel = "747640224687063051"; // sunucu-log
let modchannel = "747640969675145247"; // moderasyon-sohbet
let entrychannel = "747640369998594168"; // giriş-kanalı
let rulechannel = "747640189521887392"; // kurallar
let rolechannel = "747640528107208766"; // rol-seçimi

let rulemessageM1 = "747986938035699733"; // Rule message 1
let rulemessageM2 = "747987100091154524"; // Rule message 2
let rulemessage = "747987290625802331"; // Actual rule message
let rolemessage = "747994966109847662";

let ruleroleid = "748022553502548009";

let role9roleid = "747937428987445298";
let role10roleid = "747937642662068254";
let role11roleid = "747937653768585217";
let role12roleid = "747937661393829988";
let roleUniroleid = "747937764745412678";
let roleGradroleid = "747937816155258881";

let roleMFroleid = "747939067030667274";
let roleTMroleid = "747938960923426956";
let roleTSroleid = "747939082151264346";
let roleDILroleid = "747939096097194165";

let roleconfirmedid = "747940776981561365";

const isDigit = n => n >= 0 && n <= 9;

client.once('ready', () => {
  console.log('Ready!');
  
  logchannel = client.channels.cache.get(logchannel);
  logchannel.send("=> Bot has initialized successfully.");
  
  modchannel = client.channels.cache.get(modchannel);
  entrychannel = client.channels.cache.get(entrychannel);
  rulechannel = client.channels.cache.get(rulechannel);
  rolechannel = client.channels.cache.get(rolechannel);
  
  rulechannel.messages.fetch(rulemessage).then(message => rulemessage = message);
  rulechannel.messages.fetch(rulemessageM1).then(message => rulemessageM1 = message);
  rulechannel.messages.fetch(rulemessageM2).then(message => rulemessageM2 = message);
  rolechannel.messages.fetch(rolemessage).then(message => rolemessage = message);
  
  client.recentlyRemovedReactions = new Set();
});

client.on('message', message => {
  if (message.channel.id === modchannel.id) { // Admin commands
    
    if (message.content.startsWith(`${cfg.prefix}kural set`)) {
      let str = message.content.split(" ");
      let ruleid = str[3];
      let rule = str.slice(4).join(" ");
      let rulekey = "rule" + ruleid;
      
      if (ruleid < 1 || ruleid > 15 || ![...ruleid].every(isDigit)) {
        message.channel.send("\`Usage: !v kural set [id] [kural]\`\nEn fazla 15 kural.");
        return;
      }
      
      console.log(`${rulekey}: ${rule}`);
      cfg[rulekey] = rule;
      
      fs.writeFile("config.json", JSON.stringify(cfg), err => { 
        if (err) throw err;  
        console.log("Done writing rules.");
        message.channel.send(`${rulekey}: ${cfg[rulekey]}`);
      }); 
    }
    
    
    if (message.content === `${cfg.prefix}kill bot`) {
      modchannel.send("Killing the bot.");
      process.exit();
    }
    
    
  }
  
  if (message.content.startsWith(`${cfg.prefix}kural`) && !message.content.startsWith(`${cfg.prefix}kural set`)) {
    let str = message.content.split(" ");
    let ruleid = str.length === 2 ? undefined : str.length === 3 ? str[2] : -1;
    let rulekey = "rule" + ruleid;
    
    if (ruleid !== undefined && (ruleid < 1 || ruleid > 15 || ![...ruleid].every(isDigit))) {
      message.channel.send("\`Usage: !v kural [id]\`\nEn fazla 15 kural.\nTüm kuralları listelemek için id boş bırakın.");
      return;
    }
    
    if (ruleid === undefined) {
      let rulestack = [];
      
      for (let i = 1; i <= 15; i++) {
        rulekey = "rule" + i;
        let rulestr = `**#${i}:** ${cfg[rulekey]}`;
        
        rulestack.push(rulestr);
      }
      
      message.channel.send(rulestack.join("\n\n"), { split: true });
      
      return;
    }
    
    message.channel.send(`**#${ruleid}:** ${cfg[rulekey]}`);
  }
  
  
  
});

client.on('guildMemberAdd', member => {
  logchannel.send(`:o:  Sunucuya yeni giriş yaptı: **${member.displayName}**#${member.user.discriminator}`);
  
  entrychannel.send(`Merhaba <@${member.id}> :),\nSunucunun tamamına erişmek için <#${rulechannel.id}>'ı onaylamanız ve <#${rolechannel.id}> yapmanız gerekmekte.`);
});

client.on('guildMemberRemove', member => {
  logchannel.send(`:x:  Sunucudan çıkış yaptı: **${member.displayName}**#${member.user.discriminator}`);
});


client.on('messageReactionAdd', function (reaction, member) {
  
  
  if (reaction.message.id === rulemessage.id || reaction.message.id === rolemessage.id) {
    
    let guildmember = reaction.message.guild.members.cache.get(member.id);
    
    let gradecheck = [guildmember.roles.cache.has(role9roleid),
                      guildmember.roles.cache.has(role10roleid),
                      guildmember.roles.cache.has(role11roleid),
                      guildmember.roles.cache.has(role12roleid),
                      guildmember.roles.cache.has(roleGradroleid),
                      guildmember.roles.cache.has(roleUniroleid)];
    let grade = gradecheck.indexOf(true);
    
    let resetting = false;
    let rulewasset = false;
    
    let emojiname = reaction.emoji.name;
    
    if (emojiname === "👍" && reaction.message.id === rulemessage.id) {
      guildmember.roles.add(ruleroleid);
      rulewasset = true;
    } else if (reaction.message.id === rolemessage.id && !guildmember.roles.cache.has(roleconfirmedid)) {
      if (emojiname === "🔴") {
        guildmember.roles.add(roleMFroleid);
      } else if (emojiname === "🔵") {
        guildmember.roles.add(roleTMroleid);
      } else if (emojiname === "🟢") {
        guildmember.roles.add(roleTSroleid);
      } else if (emojiname === "🟣") {
        guildmember.roles.add(roleDILroleid);
      } else if (emojiname === "🇦") {
        
        if (grade === -1) {
          guildmember.roles.add(role9roleid);
          gradecheck[0] = true;
        } else if (gradecheck[0]) {
          reaction.users.remove(member.id);
        } else {
          guildmember.roles.add(role9roleid);
          gradecheck[0] = true;
          
          if (gradecheck[1]) {
            gradecheck[1] = false;
            guildmember.roles.remove(role10roleid);
            reaction.message.reactions.cache.get("🇧").users.remove(member.id);
          } 
          if (gradecheck[2]) {
            gradecheck[2] = false;
            guildmember.roles.remove(role11roleid);
            reaction.message.reactions.cache.get("🇨").users.remove(member.id);
          } 
          if (gradecheck[3]) {
            gradecheck[3] = false;
            guildmember.roles.remove(role12roleid);
            reaction.message.reactions.cache.get("🇩").users.remove(member.id);
          } 
          if (gradecheck[4]) {
            gradecheck[4] = false;
            guildmember.roles.remove(roleGradroleid);
            reaction.message.reactions.cache.get("🇲").users.remove(member.id);
          } 
          if (gradecheck[5]) {
            gradecheck[5] = false;
            guildmember.roles.remove(roleUniroleid);
            reaction.message.reactions.cache.get("🇺").users.remove(member.id);
          }
          
        }
      } else if (emojiname === "🇧") {
        
        if (grade === -1) {
          guildmember.roles.add(role10roleid);
          gradecheck[1] = true;
        } else if (gradecheck[1]) {
          reaction.users.remove(member.id);
        } else {
          guildmember.roles.add(role10roleid);
          gradecheck[1] = true;
          
          if (gradecheck[0]) {
            gradecheck[0] = false;
            guildmember.roles.remove(role9roleid);
            reaction.message.reactions.cache.get("🇦").users.remove(member.id);
          } 
          if (gradecheck[2]) {
            gradecheck[2] = false;
            guildmember.roles.remove(role11roleid);
            reaction.message.reactions.cache.get("🇨").users.remove(member.id);
          } 
          if (gradecheck[3]) {
            gradecheck[3] = false;
            guildmember.roles.remove(role12roleid);
            reaction.message.reactions.cache.get("🇩").users.remove(member.id);
          } 
          if (gradecheck[4]) {
            gradecheck[4] = false;
            guildmember.roles.remove(roleGradroleid);
            reaction.message.reactions.cache.get("🇲").users.remove(member.id);
          } 
          if (gradecheck[5]) {
            gradecheck[5] = false;
            guildmember.roles.remove(roleUniroleid);
            reaction.message.reactions.cache.get("🇺").users.remove(member.id);
          }
          
        }
      } else if (emojiname === "🇨") {
        
        if (grade === -1) {
          guildmember.roles.add(role11roleid);
          gradecheck[2] = true;
        } else if (gradecheck[2]) {
          reaction.users.remove(member.id);
        } else {
          guildmember.roles.add(role11roleid);
          gradecheck[2] = true;
          
          if (gradecheck[0]) {
            gradecheck[0] = false;
            guildmember.roles.remove(role9roleid);
            reaction.message.reactions.cache.get("🇦").users.remove(member.id);
          } 
          if (gradecheck[1]) {
            gradecheck[1] = false;
            guildmember.roles.remove(role10roleid);
            reaction.message.reactions.cache.get("🇧").users.remove(member.id);
          } 
          if (gradecheck[3]) {
            gradecheck[3] = false;
            guildmember.roles.remove(role12roleid);
            reaction.message.reactions.cache.get("🇩").users.remove(member.id);
          } 
          if (gradecheck[4]) {
            gradecheck[4] = false;
            guildmember.roles.remove(roleGradroleid);
            reaction.message.reactions.cache.get("🇲").users.remove(member.id);
          } 
          if (gradecheck[5]) {
            gradecheck[5] = false;
            guildmember.roles.remove(roleUniroleid);
            reaction.message.reactions.cache.get("🇺").users.remove(member.id);
          }
          
        }
      } else if (emojiname === "🇩") {
        
        if (grade === -1) {
          guildmember.roles.add(role12roleid);
          gradecheck[3] = true;
        } else if (gradecheck[3]) {
          reaction.users.remove(member.id);
        } else {
          guildmember.roles.add(role12roleid);
          gradecheck[3] = true;
          
          if (gradecheck[0]) {
            gradecheck[0] = false;
            guildmember.roles.remove(role9roleid);
            reaction.message.reactions.cache.get("🇦").users.remove(member.id);
          } 
          if (gradecheck[2]) {
            gradecheck[2] = false;
            guildmember.roles.remove(role11roleid);
            reaction.message.reactions.cache.get("🇨").users.remove(member.id);
          } 
          if (gradecheck[1]) {
            gradecheck[1] = false;
            guildmember.roles.remove(role10roleid);
            reaction.message.reactions.cache.get("🇧").users.remove(member.id);
          } 
          if (gradecheck[4]) {
            gradecheck[4] = false;
            guildmember.roles.remove(roleGradroleid);
            reaction.message.reactions.cache.get("🇲").users.remove(member.id);
          } 
          if (gradecheck[5]) {
            gradecheck[5] = false;
            guildmember.roles.remove(roleUniroleid);
            reaction.message.reactions.cache.get("🇺").users.remove(member.id);
          }
          
        }
      } else if (emojiname === "🇲") {
        
        if (grade === -1) {
          guildmember.roles.add(roleGradroleid);
          gradecheck[4] = true;
        } else if (gradecheck[4]) {
          reaction.users.remove(member.id);
        } else {
          guildmember.roles.add(roleGradroleid);
          gradecheck[4] = true;
          
          if (gradecheck[0]) {
            gradecheck[0] = false;
            guildmember.roles.remove(role9roleid);
            reaction.message.reactions.cache.get("🇦").users.remove(member.id);
          } 
          if (gradecheck[2]) {
            gradecheck[2] = false;
            guildmember.roles.remove(role11roleid);
            reaction.message.reactions.cache.get("🇨").users.remove(member.id);
          } 
          if (gradecheck[1]) {
            gradecheck[1] = false;
            guildmember.roles.remove(role10roleid);
            reaction.message.reactions.cache.get("🇧").users.remove(member.id);
          } 
          if (gradecheck[3]) {
            gradecheck[3] = false;
            guildmember.roles.remove(role12roleid);
            reaction.message.reactions.cache.get("🇩").users.remove(member.id);
          } 
          if (gradecheck[5]) {
            gradecheck[5] = false;
            guildmember.roles.remove(roleUniroleid);
            reaction.message.reactions.cache.get("🇺").users.remove(member.id);
          }
          
        }
      } else if (emojiname === "🇺") {
        
        if (grade === -1) {
          guildmember.roles.add(roleUniroleid);
          gradecheck[5] = true;
        } else if (gradecheck[5]) {
          reaction.users.remove(member.id);
        } else {
          guildmember.roles.add(roleUniroleid);
          gradecheck[5] = true;
          
          if (gradecheck[0]) {
            gradecheck[0] = false;
            guildmember.roles.remove(role9roleid);
            reaction.message.reactions.cache.get("🇦").users.remove(member.id);
          } 
          if (gradecheck[2]) {
            gradecheck[2] = false;
            guildmember.roles.remove(role11roleid);
            reaction.message.reactions.cache.get("🇨").users.remove(member.id);
          } 
          if (gradecheck[1]) {
            gradecheck[1] = false;
            guildmember.roles.remove(role10roleid);
            reaction.message.reactions.cache.get("🇧").users.remove(member.id);
          } 
          if (gradecheck[4]) {
            gradecheck[4] = false;
            guildmember.roles.remove(roleGradroleid);
            reaction.message.reactions.cache.get("🇲").users.remove(member.id);
          } 
          if (gradecheck[3]) {
            gradecheck[3] = false;
            guildmember.roles.remove(role12roleid);
            reaction.message.reactions.cache.get("🇩").users.remove(member.id);
          }
          
        }
      } else {
        reaction.users.remove(member.id);
      }
    } else if (reaction.message.id === rolemessage.id && emojiname === "🇷" && guildmember.roles.cache.has(roleconfirmedid)) {
      resetting = true;
      guildmember.roles.remove(roleconfirmedid);
      guildmember.roles.remove(roleMFroleid);
      guildmember.roles.remove(roleTSroleid);
      guildmember.roles.remove(roleTMroleid);
      guildmember.roles.remove(roleDILroleid);
      reaction.message.reactions.cache.get("🔴").users.remove(member.id);
      reaction.message.reactions.cache.get("🟣").users.remove(member.id);
      reaction.message.reactions.cache.get("🔵").users.remove(member.id);
      reaction.message.reactions.cache.get("🟢").users.remove(member.id);
      
      if (gradecheck[0]) {
        guildmember.roles.remove(role9roleid);
        reaction.message.reactions.cache.get("🇦").users.remove(member.id);
      } 
      if (gradecheck[1]) {
        guildmember.roles.remove(role10roleid);
        reaction.message.reactions.cache.get("🇧").users.remove(member.id);
      } 
      if (gradecheck[2]) {
        guildmember.roles.remove(role11roleid);
        reaction.message.reactions.cache.get("🇨").users.remove(member.id);
      } 
      if (gradecheck[3]) {
        guildmember.roles.remove(role12roleid);
        reaction.message.reactions.cache.get("🇩").users.remove(member.id);
      } 
      if (gradecheck[4]) {
        guildmember.roles.remove(roleGradroleid);
        reaction.message.reactions.cache.get("🇲").users.remove(member.id);
      } 
      if (gradecheck[5]) {
        guildmember.roles.remove(roleUniroleid);
        reaction.message.reactions.cache.get("🇺").users.remove(member.id);
      } 
      reaction.users.remove(member.id);
      logchannel.send(`:regional_indicator_r: -- :arrow_right: **${guildmember.displayName}**#${member.discriminator} rollerini resetledi.`);
    }
    
    if (reaction.message.id === rolemessage.id && guildmember.roles.cache.has(roleconfirmedid)) {
      reaction.users.remove(member.id);
    }
    
    if (guildmember.roles.cache.has(ruleroleid) || rulewasset) {
      let countgrade = gradecheck.reduce((acc, val) => acc += val ? 1 : 0, 0);
      let hasTS = rolemessage.reactions.cache.has("🟢");
      let hasTM = rolemessage.reactions.cache.has("🔵");
      let hasMF = rolemessage.reactions.cache.has("🔴");
      let hasDIL = rolemessage.reactions.cache.has("🟣");
      if ((guildmember.roles.cache.has(roleMFroleid) || 
           guildmember.roles.cache.has(roleTMroleid) ||
           guildmember.roles.cache.has(roleTSroleid) ||
           guildmember.roles.cache.has(roleDILroleid) ) && countgrade === 1 && !resetting) {
        
        guildmember.roles.add(roleconfirmedid);
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
        reaction.users.remove(member.id);
      }
    }
    
  } else if (reaction.message.id === rulemessageM1.id || reaction.message.id === rulemessageM2.id) {
    reaction.users.remove(member.id);
  }
});


client.on("messageReactionRemove", function (reaction, member) {
  
  console.log(client.recentlyRemovedReactions);
  
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
      guildmember.roles.remove(ruleroleid);
    } else if (reaction.message.id === rolemessage.id) {
      if (emojiname === "🔴") {
        guildmember.roles.remove(roleMFroleid);
      } else if (emojiname === "🟢") {
        guildmember.roles.remove(roleTSroleid);
      } else if (emojiname === "🟣") {
        guildmember.roles.remove(roleDILroleid);
      } else if (emojiname === "🇦") {
        guildmember.roles.remove(role9roleid);
      } else if (emojiname === "🇧") {
        guildmember.roles.remove(role10roleid);
      } else if (emojiname === "🇨") {
        guildmember.roles.remove(role11roleid);
      } else if (emojiname === "🇩") {
        guildmember.roles.remove(role12roleid);
      } else if (emojiname === "🇲") {
        guildmember.roles.remove(roleGradroleid);
      } else if (emojiname === "🇺") {
        guildmember.roles.remove(roleUniroleid);
      } else if (emojiname === "🔵") {
        if (client.recentlyRemovedReactions.has(`${member.id}TM`)) return client.recentlyRemovedReactions.delete(`${member.id}TM`);
        guildmember.roles.remove(roleTMroleid);
      } 
    } 
  }
});



client.login(cfg.token);
