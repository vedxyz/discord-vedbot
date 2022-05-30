import { SlashCommandBuilder } from "@discordjs/builders";
import utils from "../utils/utils";
import { BotCommand } from "../utils/interface";
import { rules } from "../database/database";
import logger from "../utils/logger";

let adminPermissions: BotCommand["permissions"];
utils.permissions
  .getAdmins()
  .then((permissions) => {
    adminPermissions = permissions;
  })
  .catch(logger.error);

const command: BotCommand = {
  data: new SlashCommandBuilder()
    .setName("setrule")
    .setDescription("Set rules for the DH server")
    .setDefaultPermission(false)
    .addIntegerOption((id) => id.setName("id").setDescription("ID of a rule").setRequired(true))
    .addStringOption((content) =>
      content.setName("content").setDescription("New content of the rule").setRequired(false)
    ),
  permissions: [utils.permissions.getOwner(), ...(typeof adminPermissions !== "undefined" ? adminPermissions : [])],
  guilds: ["dh"],
  async execute(interaction) {
    const ruleID = interaction.options.getInteger("id", true);
    const ruleContent = interaction.options.getString("content") ?? "";

    if (ruleContent.length === 0) {
      await interaction.reply({ content: "You can't have zero-length rules.", ephemeral: true });
    }

    // logger.info(`Writing rule to #${ruleID}: ${ruleContent.substring(0, 50)}${ruleContent.length > 50 ? "..." : ""}`);

    try {
      await rules.set(interaction.guildId, { index: ruleID, content: ruleContent });
    } catch (error) {
      logger.error(error);
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
