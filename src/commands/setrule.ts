import utils from "../utils/utils";
import { BotCommand } from "../utils/interface";
import { rules } from "../database/database";

let adminPermissions: BotCommand["permissions"];
utils.permissions
  .getAdmins()
  .then((permissions) => {
    adminPermissions = permissions;
  })
  .catch(console.error);

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
  permissions: [utils.permissions.getOwner(), ...(typeof adminPermissions !== "undefined" ? adminPermissions : [])],
  guilds: ["dh"],
  async execute(interaction) {
    const ruleID = interaction.options.getInteger("id", true);
    const ruleContent = interaction.options.getString("content") ?? "";

    if (ruleContent.length === 0) {
      await interaction.reply({ content: "You can't have zero-length rules.", ephemeral: true });
    }

    // console.log(`Writing rule to #${ruleID}: ${ruleContent.substring(0, 50)}${ruleContent.length > 50 ? "..." : ""}`);

    try {
      await rules.set(interaction.guildId, { index: ruleID, content: ruleContent });
    } catch (error) {
      console.error(error);
      await interaction.reply("There was a problem saving the rule.");
    }

    await interaction.reply({
      embeds: [
        utils
          .getRuleEmbedBase(interaction)
          .addField(`Rule #${ruleID}`, ruleContent || "*This rule has been cleared*", false),
      ],
    });
  },
};

export default command;
