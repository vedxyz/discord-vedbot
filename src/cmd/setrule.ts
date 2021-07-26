/* eslint-disable no-console */
/* eslint-disable radix */
/* eslint-disable global-require */
/* eslint-disable consistent-return */
import fs from "fs";
import path from "path";
import { BotCommand, vedbot } from "../vedbot";

export default {
  name: "setrule",
  aliases: [],
  description: "Set rules for the DH server.",
  args: true,
  usage: "[ID] [rule content]",
  guilds: ["dh"],
  permissions: ["ADMINISTRATOR"],
  execute(message, args) {
    
    delete require.cache[require.resolve("../config.json")];
    const cfg = require("../config.json");
    
    const ruleID = parseInt(args.shift() || "");
    const ruleContent = args.join(" ");
    
    // Check for errors in command syntax
    if (Number.isInteger(ruleID) || ruleID < 1 || ruleID > cfg.dh.rules.length) {
      
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
        vedbot.commands.collection.get("rule")?.execute(message, [ruleID.toString()]);
      } catch (error) {
        console.log(error);
        message.reply("The rule was written, but something went wrong while showing it.");
      }
      
    });
    
  }
} as BotCommand;
