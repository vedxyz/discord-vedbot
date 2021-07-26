/* eslint-disable global-require */
/* eslint-disable radix */
import { MessageEmbed } from "discord.js";
import { BotCommand } from "../vedbot";

export default {
  name: "rule",
  aliases: ["getrule"],
  description: "Get rule(s) for the DH server.",
  args: false,
  usage: "[ID]",
  guilds: ["dh"],
  permissions: [],
  execute(message, args) {
    
    if (!message.guild) return "";
    
    delete require.cache[require.resolve("../config.json")];
    const cfg = require("../config.json");
    
    const ruleID = parseInt(args[0]);
    
    const ruleEmbed = new MessageEmbed()
      .setTitle(`${message.guild.name  } Kurallar`)
      .setTimestamp()
      .setFooter(`Teşekkürler.`)
      .setColor("ORANGE")
      .setThumbnail(message.guild.iconURL() || "");
    
    if (ruleID === undefined) {
      
      const ruleStack = cfg.servers.dh.rules.map((rule: string, idx: number) => rule.length ? { index: idx + 1, content: rule } : false).filter((e: any) => e);
      
      return message.channel.send(
        ruleEmbed.addFields(ruleStack.map((rule: { index: number; content: string; }) => ({ name: `Kural #${rule.index}`, value: rule.content, inline: false })))
      );
      
    }
    
    // Check for errors in command syntax
    if (Number.isInteger(ruleID) || ruleID < 1 || ruleID > cfg.dh.rules.length) {
      
      return message.reply(
        `Usage: \`${cfg.prefix}${this.name} ${this.usage}\`\n` + 
        `Note: Leave ID argument blank to list all rules. There are ${cfg.dh.rules.length} rules.`
      );
      
    } 
    
    if (!cfg.dh.rules[ruleID - 1].length) {
      return message.reply(`Rule #${ruleID} is blank.`);
    }
    
    return message.channel.send(ruleEmbed.addField(`Kural #${ruleID}`, cfg.dh.rules[ruleID - 1], false));
    
  }
} as BotCommand;
