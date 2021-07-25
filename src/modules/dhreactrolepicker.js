const cfg = require("../../config.json");

function roleSwitchSafety(caller, gradecheck, guildmember, reaction, memberID) {
  
  if (caller !== "🇦" && gradecheck[0]) {
    gradecheck[0] = false;
    guildmember.roles.remove(cfg.dh.roles.grade9);
    reaction.message.reactions.cache.get("🇦").users.remove(memberID);
  } 
  
  if (caller !== "🇧" && gradecheck[1]) {
    gradecheck[1] = false;
    guildmember.roles.remove(cfg.dh.roles.grade10);
    reaction.message.reactions.cache.get("🇧").users.remove(memberID);
  } 
  
  if (caller !== "🇨" && gradecheck[2]) {
    gradecheck[2] = false;
    guildmember.roles.remove(cfg.dh.roles.grade11);
    reaction.message.reactions.cache.get("🇨").users.remove(memberID);
  } 
  
  if (caller !== "🇩" && gradecheck[3]) {
    gradecheck[3] = false;
    guildmember.roles.remove(cfg.dh.roles.grade12);
    reaction.message.reactions.cache.get("🇩").users.remove(memberID);
  } 
  
  if (caller !== "🇲" && gradecheck[4]) {
    gradecheck[4] = false;
    guildmember.roles.remove(cfg.dh.roles.graduate);
    reaction.message.reactions.cache.get("🇲").users.remove(memberID);
  } 
  
  if (caller !== "🇺" && gradecheck[5]) {
    gradecheck[5] = false;
    guildmember.roles.remove(cfg.dh.roles.university);
    reaction.message.reactions.cache.get("🇺").users.remove(memberID);
  }
  
}

module.exports = {
  name: "dhreactrolepicker",
  description: "",
  state: true,
  guilds: ["dh"],
  onAdd(reaction, user, optional) {
    
    if (!this.guilds.some(srv => cfg[srv].id === reaction.message.guild.id) || !this.state) return;
    
    if (reaction.message.id === cfg.dh.messages.rules_c || reaction.message.id === cfg.dh.messages.roles) {
      
      let guildmember = reaction.message.guild.members.cache.get(user.id);
      
      let gradeCheckArray = [
        guildmember.roles.cache.has(cfg.dh.roles.grade9),
        guildmember.roles.cache.has(cfg.dh.roles.grade10),
        guildmember.roles.cache.has(cfg.dh.roles.grade11),
        guildmember.roles.cache.has(cfg.dh.roles.grade12),
        guildmember.roles.cache.has(cfg.dh.roles.graduate),
        guildmember.roles.cache.has(cfg.dh.roles.university)
      ];
      
      let gradeCheckFlag = gradeCheckArray.indexOf(true);
      
      let reactionConfirmsRules = false;
      
      let emojiName = reaction.emoji.name;
      
      if (reaction.message.id === cfg.dh.messages.rules_c) {
        
        if (emojiName === "👍") {
          guildmember.roles.add(cfg.dh.roles.confirmedRules);
          reactionConfirmsRules = true;
        } else {
          reaction.users.remove(user.id);
          return;
        }
        
      } else if (reaction.message.id === cfg.dh.messages.roles) {
        
        if (!guildmember.roles.cache.has(cfg.dh.roles.memberConfirmed)) {
          
          if (emojiName === "🔴") {
            guildmember.roles.add(cfg.dh.roles.mf);
          } else if (emojiName === "🔵") {
            guildmember.roles.add(cfg.dh.roles.tm);
          } else if (emojiName === "🟢") {
            guildmember.roles.add(cfg.dh.roles.ts);
          } else if (emojiName === "🟣") {
            guildmember.roles.add(cfg.dh.roles.dil);
          } else if (emojiName === "🇦") {
            
            guildmember.roles.add(cfg.dh.roles.grade9);
            gradeCheckArray[0] = true;
            
            if (gradeCheckFlag !== -1) roleSwitchSafety("🇦", gradeCheckArray, guildmember, reaction, user.id);
            
          } else if (emojiName === "🇧") {
            
            guildmember.roles.add(cfg.dh.roles.grade10);
            gradeCheckArray[1] = true;
            
            if (gradeCheckFlag !== -1) roleSwitchSafety("🇧", gradeCheckArray, guildmember, reaction, user.id);
            
          } else if (emojiName === "🇨") {
            
            guildmember.roles.add(cfg.dh.roles.grade11);
            gradeCheckArray[2] = true;
            
            if (gradeCheckFlag !== -1) roleSwitchSafety("🇨", gradeCheckArray, guildmember, reaction, user.id);
            
          } else if (emojiName === "🇩") {
            
            guildmember.roles.add(cfg.dh.roles.grade12);
            gradeCheckArray[3] = true;
            
            if (gradeCheckFlag !== -1) roleSwitchSafety("🇩", gradeCheckArray, guildmember, reaction, user.id);
            
          } else if (emojiName === "🇲") {
            
            guildmember.roles.add(cfg.dh.roles.graduate);
            gradeCheckArray[4] = true;
            
            if (gradeCheckFlag !== -1) roleSwitchSafety("🇲", gradeCheckArray, guildmember, reaction, user.id);
            
          } else if (emojiName === "🇺") {
            
            guildmember.roles.add(cfg.dh.roles.university);
            gradeCheckArray[5] = true;
            
            if (gradeCheckFlag !== -1) roleSwitchSafety("🇺", gradeCheckArray, guildmember, reaction, user.id);
            
          } else {
            
            reaction.users.remove(user.id);
            
          }
          
        } else {
          
          if (emojiName === "🇷") {
            
            guildmember.roles.remove(cfg.dh.roles.memberConfirmed);
            guildmember.roles.remove(cfg.dh.roles.mf);
            guildmember.roles.remove(cfg.dh.roles.ts);
            guildmember.roles.remove(cfg.dh.roles.tm);
            guildmember.roles.remove(cfg.dh.roles.dil);
            reaction.message.reactions.cache.get("🔴").users.remove(user.id);
            reaction.message.reactions.cache.get("🟣").users.remove(user.id);
            reaction.message.reactions.cache.get("🔵").users.remove(user.id);
            reaction.message.reactions.cache.get("🟢").users.remove(user.id);
            
            roleSwitchSafety(null, gradeCheckArray, guildmember, reaction, user.id);
            
            reaction.users.remove(user.id);
            optional.serverVars.dh.channels.log.send(`:regional_indicator_r: -> **${guildmember.displayName}**#${user.discriminator} just reset their roles.`);
            return;
            
          } else {
            
            reaction.users.remove(user.id);
            
          }
          
        }
        
      }
      
      
      if (guildmember.roles.cache.has(cfg.dh.roles.confirmedRules) || reactionConfirmsRules) {
        
        let countgrade = gradeCheckArray.reduce((acc, val) => acc += val ? 1 : 0, 0);
        let hasTS = optional.serverVars.dh.messages.roles.reactions.cache.has("🟢");
        let hasTM = optional.serverVars.dh.messages.roles.reactions.cache.has("🔵");
        let hasMF = optional.serverVars.dh.messages.roles.reactions.cache.has("🔴");
        let hasDIL = optional.serverVars.dh.messages.roles.reactions.cache.has("🟣");
        
        if ((guildmember.roles.cache.has(cfg.dh.roles.mf) || 
             guildmember.roles.cache.has(cfg.dh.roles.tm) ||
             guildmember.roles.cache.has(cfg.dh.roles.ts) ||
             guildmember.roles.cache.has(cfg.dh.roles.dil) ) && countgrade === 1) {
          
          guildmember.roles.add(cfg.dh.roles.memberConfirmed);
          
          if (gradeCheckArray[0]) {
            optional.serverVars.dh.reactionQueue.add(`${user.id}A`);
            optional.serverVars.dh.messages.roles.reactions.cache.get("🇦").users.remove(user.id);
          } 
          if (gradeCheckArray[1]) {
            optional.serverVars.dh.reactionQueue.add(`${user.id}B`);
            optional.serverVars.dh.messages.roles.reactions.cache.get("🇧").users.remove(user.id);
          } 
          if (gradeCheckArray[2]) {
            optional.serverVars.dh.reactionQueue.add(`${user.id}C`);
            optional.serverVars.dh.messages.roles.reactions.cache.get("🇨").users.remove(user.id);
          } 
          if (gradeCheckArray[3]) {
            optional.serverVars.dh.reactionQueue.add(`${user.id}D`);
            optional.serverVars.dh.messages.roles.reactions.cache.get("🇩").users.remove(user.id);
          } 
          if (gradeCheckArray[4]) {
            optional.serverVars.dh.reactionQueue.add(`${user.id}M`);
            optional.serverVars.dh.messages.roles.reactions.cache.get("🇲").users.remove(user.id);
          } 
          if (gradeCheckArray[5]) {
            optional.serverVars.dh.reactionQueue.add(`${user.id}U`);
            optional.serverVars.dh.messages.roles.reactions.cache.get("🇺").users.remove(user.id);
          }
          if (hasMF) {
            optional.serverVars.dh.reactionQueue.add(`${user.id}MF`);
            optional.serverVars.dh.messages.roles.reactions.cache.get("🔴").users.remove(user.id);
          }
          if (hasTM) {
            optional.serverVars.dh.reactionQueue.add(`${user.id}TM`);
            optional.serverVars.dh.messages.roles.reactions.cache.get("🔵").users.remove(user.id);
          }
          if (hasTS) {
            optional.serverVars.dh.reactionQueue.add(`${user.id}TS`);
            optional.serverVars.dh.messages.roles.reactions.cache.get("🟢").users.remove(user.id);
          }
          if (hasDIL) {
            optional.serverVars.dh.reactionQueue.add(`${user.id}DIL`);
            optional.serverVars.dh.messages.roles.reactions.cache.get("🟣").users.remove(user.id);
          }
          
        }
        
      }
      
    } else if (reaction.message.id === cfg.dh.messages.rules_p1 || reaction.message.id === cfg.dh.messages.rules_p2) {
      
      reaction.users.remove(user.id);
      
    }
    
  },
  onRemove(reaction, user, optional) {
    
    //console.log(optional.serverVars.dh.reactionQueue);
    if (!this.guilds.some(srv => cfg[srv].id === reaction.message.guild.id) || !this.state) return;
    
    if (optional.serverVars.dh.reactionQueue.has(`${user.id}A`)) return optional.serverVars.dh.reactionQueue.delete(`${user.id}A`);
    if (optional.serverVars.dh.reactionQueue.has(`${user.id}B`)) return optional.serverVars.dh.reactionQueue.delete(`${user.id}B`);
    if (optional.serverVars.dh.reactionQueue.has(`${user.id}C`)) return optional.serverVars.dh.reactionQueue.delete(`${user.id}C`);
    if (optional.serverVars.dh.reactionQueue.has(`${user.id}D`)) return optional.serverVars.dh.reactionQueue.delete(`${user.id}D`);
    if (optional.serverVars.dh.reactionQueue.has(`${user.id}M`)) return optional.serverVars.dh.reactionQueue.delete(`${user.id}M`);
    if (optional.serverVars.dh.reactionQueue.has(`${user.id}U`)) return optional.serverVars.dh.reactionQueue.delete(`${user.id}U`);
    if (optional.serverVars.dh.reactionQueue.has(`${user.id}MF`)) return optional.serverVars.dh.reactionQueue.delete(`${user.id}MF`);
    if (optional.serverVars.dh.reactionQueue.has(`${user.id}TS`)) return optional.serverVars.dh.reactionQueue.delete(`${user.id}TS`);
    if (optional.serverVars.dh.reactionQueue.has(`${user.id}DIL`)) return optional.serverVars.dh.reactionQueue.delete(`${user.id}DIL`);
    if (optional.serverVars.dh.reactionQueue.has(`${user.id}TM`)) return optional.serverVars.dh.reactionQueue.delete(`${user.id}TM`);
    
    
    let guildmember = reaction.message.guild.members.cache.get(user.id);
    
    if ((reaction.message.id === cfg.dh.messages.rules_c || reaction.message.id === cfg.dh.messages.roles)) {
      
      let emojiname = reaction.emoji.name;
      
      if (emojiname === "👍" && reaction.message.id === cfg.dh.messages.rules_c) {
        guildmember.roles.remove(cfg.dh.roles.confirmedRules);
      } else if (reaction.message.id === cfg.dh.messages.roles) {
        if (emojiname === "🔴") {
          guildmember.roles.remove(cfg.dh.roles.mf);
        } else if (emojiname === "🟢") {
          guildmember.roles.remove(cfg.dh.roles.ts);
        } else if (emojiname === "🟣") {
          guildmember.roles.remove(cfg.dh.roles.dil);
        } else if (emojiname === "🇦") {
          guildmember.roles.remove(cfg.dh.roles.grade9);
        } else if (emojiname === "🇧") {
          guildmember.roles.remove(cfg.dh.roles.grade10);
        } else if (emojiname === "🇨") {
          guildmember.roles.remove(cfg.dh.roles.grade11);
        } else if (emojiname === "🇩") {
          guildmember.roles.remove(cfg.dh.roles.grade12);
        } else if (emojiname === "🇲") {
          guildmember.roles.remove(cfg.dh.roles.graduate);
        } else if (emojiname === "🇺") {
          guildmember.roles.remove(cfg.dh.roles.university);
        } else if (emojiname === "🔵") {
          if (optional.serverVars.dh.reactionQueue.has(`${user.id}TM`)) return optional.serverVars.dh.reactionQueue.delete(`${user.id}TM`);
          guildmember.roles.remove(cfg.dh.roles.tm);
        }
      } 
    }
    
  }
};
