const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "rule",
  aliases: ["getrule"],
  description: "Get rule(s) for the DH server.",
  args: false,
  usage: "[ID]",
  guilds: ["dh"],
  permissions: false,
  execute(message, args) {
    
    delete require.cache[require.resolve("../config.json")];
    const cfg = require("../config.json");
    
    let ruleID = args[0];
    
    let ruleEmbed = new MessageEmbed()
      .setTitle(message.guild.name + " Kurallar")
      .setTimestamp()
      .setFooter(`Teşekkürler.`)
      .setColor("ORANGE")
      .setThumbnail(message.guild.iconURL());
    
    if (ruleID === undefined) {
      
      let ruleStack = cfg.dh.rules.map((rule, idx) => rule.length ? { index: idx + 1, content: rule } : false).filter(e => e);
      
      return message.channel.send(
        ruleEmbed.addFields(ruleStack.map(rule => ({ name: `Kural #${rule.index}`, value: rule.content, inline: false })))
      );
      
    }
    
    // Check for errors in command syntax
    if (![...ruleID].every(char => Number.isInteger(parseInt(char))) || ruleID < 1 || ruleID > cfg.dh.rules.length) {
      
      return message.reply(
        `Usage: \`${cfg.prefix}${this.name} ${this.usage}\`\n` + 
        `Note: Leave ID argument blank to list all rules. There are ${cfg.dh.rules.length} rules.`
      );
      
    } else if (!cfg.dh.rules[ruleID - 1].length) {
      return message.reply(`Rule #${ruleID} is blank.`);
    }
    
    message.channel.send(ruleEmbed.addField(`Kural #${ruleID}`, cfg.dh.rules[ruleID - 1], false));
    //message.channel.send(`**#${ruleID}:** ${cfg.dh.rules[ruleID - 1]}`);
    
  }
};
