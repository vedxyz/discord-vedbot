import { SlashCommandBuilder } from "@discordjs/builders";
import utils from "../utils/utils";
import { BotCommand } from "../utils/interface";
import { rules } from "../database/database";

const command: BotCommand = {
  data: new SlashCommandBuilder()
    .setName("rule")
    .setDescription("Get rule(s) for the server")
    .setDefaultPermission(true)
    .addIntegerOption((id) => id.setName("id").setDescription("ID of a rule").setRequired(false)),
  guilds: ["dh"],
  async execute(interaction) {
    const ruleID = interaction.options.getInteger("id");

    const ruleEmbed = utils.getRuleEmbedBase(interaction);

    if (ruleID === null) {
      const allRules = await rules.getAll(interaction.guildId);

      await interaction.reply({
        embeds: [
          ruleEmbed.addFields(
            allRules.map((rule) => ({
              name: `Rule #${rule.index}`,
              value: rule.content,
              inline: false,
            }))
          ),
        ],
      });
    } else if (!(await rules.exists(interaction.guildId, ruleID))) {
      await interaction.reply({ content: `Rule #${ruleID} doesn't exist.`, ephemeral: true });
    } else {
      await interaction.reply({
        embeds: [ruleEmbed.addField(`Rule #${ruleID}`, (await rules.get(interaction.guildId, ruleID)).content, false)],
      });
    }
  },
};

export default command;
