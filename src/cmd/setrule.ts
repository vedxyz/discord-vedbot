import utils from "../utils";
import { BotCommand, cfg } from "../vedbot";

const command: BotCommand = {
  data: {
    name: "setrule",
    description: "Set rules for the DH server.",
    defaultPermission: true,
    options: [
      {
        name: "id",
        description: "ID of a rule",
        type: "INTEGER",
        required: true,
        choices: Array.from({ length: cfg.servers.dh.rules.length }, (_, i) => ({ name: `${i + 1}`, value: i + 1 })),
      },
      {
        name: "content",
        description: "New content of rule",
        type: "STRING",
        required: false,
      }
    ],
  },
  guilds: ["dh"],
  execute(interaction) {
    const ruleID = interaction.options.getInteger("id", true);
    const ruleContent = interaction.options.getString("content") ?? "";

    console.log(`Writing rule to #${ruleID}: ${ruleContent.substring(0, 50)}${ruleContent.length > 50 ? "..." : ""}`);
    cfg.servers.dh.rules[ruleID - 1] = ruleContent;

    utils
      .saveConfig(cfg)
      .then(() => {
        interaction.reply({
          embeds: [utils.getRuleEmbedBase(interaction).addField(`Kural #${ruleID}`, ruleContent, false)],
        });
      })
      .catch((error) => {
        console.error(error);
        interaction.reply("There was a problem saving the rule.");
      });
  },
};

export default command;
