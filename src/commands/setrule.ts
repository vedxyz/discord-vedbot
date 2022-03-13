import utils from "../utils/utils";
import { cfg } from "../vedbot";
import { BotCommand } from "../utils/interface";
import { rules } from "../database/database";

const command: BotCommand = {
  data: {
    name: "setrule",
    description: "Set rules for the DH server.",
    defaultPermission: false,
    options: [
      {
        name: "id",
        description: "ID of a rule",
        type: "INTEGER",
        required: true,
      },
      {
        name: "content",
        description: "New content of rule",
        type: "STRING",
        required: false,
      },
    ],
  },
  permissions: [utils.permissions.getOwner(cfg), /* ...utils.permissions.getAdmins(cfg) */], // TODO
  guilds: ["dh"],
  async execute(interaction) {
    const ruleID = interaction.options.getInteger("id", true);
    const ruleContent = interaction.options.getString("content") ?? "";

    console.log(`Writing rule to #${ruleID}: ${ruleContent.substring(0, 50)}${ruleContent.length > 50 ? "..." : ""}`);

    try {
      await rules.set(interaction.guildId!, { index: ruleID, content: ruleContent });
    } catch (error) {
      console.error(error);
      interaction.reply("There was a problem saving the rule.");
    }

    interaction.reply({
      embeds: [
        utils
          .getRuleEmbedBase(interaction)
          .addField(`Rule #${ruleID}`, ruleContent || "*This rule has been cleared*", false),
      ],
    });
  },
};

export default command;
