import utils from "../utils";
import { BotCommand, vedbot, cfg } from "../vedbot";

export default {
  name: "setrule",
  aliases: [],
  description: "Set rules for the DH server.",
  args: true,
  usage: "[ID] [rule content]",
  guilds: ["dh"],
  permissions: ["ADMINISTRATOR"],
  execute(message, args) {
    const ruleID = parseInt(args.shift() || "", 10);
    const ruleContent = args.join(" ");

    if (Number.isInteger(ruleID) || ruleID < 1 || ruleID > cfg.servers.dh.rules.length) {
      message.reply(
        `Usage: \`${cfg.prefix}${this.name} ${this.usage}\`\n
         Example: \`${cfg.prefix}${this.name} 7 The content of the rule to be set.\`\n
         Note: Max rule ID is ${cfg.servers.dh.rules.length}.`
      );
    } else {
      console.log(`Writing rule to ${ruleID}: ${ruleContent}`);
      cfg.servers.dh.rules[ruleID - 1] = ruleContent;

      utils
        .saveConfig(cfg)
        .then(() => {
          vedbot.commands.get("rule")?.execute(message, [ruleID.toString()]);
        })
        .catch((err) => {
          console.error(err);
          message.reply("There was a problem saving the rule.");
        });
    }
  },
} as BotCommand;
