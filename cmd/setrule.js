const fs = require("fs");
const path = require("path");

module.exports = {
  name: "setrule",
  aliases: false,
  description: "Set rules for the DH server.",
  args: true,
  usage: "[ID] [rule content]",
  guilds: ["dh"],
  permissions: ["ADMINISTRATOR"],
  execute(message, args) {
    
    delete require.cache[require.resolve("../config.json")];
    const cfg = require("../config.json");
    
    let ruleID = args.shift();
    let ruleContent = args.join(" ");
    
    // Check for errors in command syntax
    if (![...ruleID].every(char => Number.isInteger(parseInt(char))) || ruleID < 1 || ruleID > cfg.dh.rules.length) {
      
      return message.reply(
        `Usage: \`${cfg.prefix}${this.name} ${this.usage}\`\n` + 
        `Example: \`${cfg.prefix}${this.name} 7 The content of the rule to be set.\`\n` +
        `Note: Max rule ID is ${cfg.dh.rules.length}.`
      );
      
    }
    
    console.log(`Writing rule to ${ruleID}: ${ruleContent}`);
    cfg.dh.rules[ruleID - 1] = ruleContent;
    
    // Update config file with new rule
    fs.writeFile(path.join(__dirname, "..", "config.json"), JSON.stringify(cfg), err => { 
      
      if (err) throw err; 
      
      // Log the new rule
      console.log("Wrote new rule successfully.");
      
      try {
        message.client.commands.get("rule").execute(message, [ruleID]);
      } catch (error) {
        console.log(error);
        message.reply("The rule was written, but something went wrong in showing it.");
      }
      
    });
    
  }
};
