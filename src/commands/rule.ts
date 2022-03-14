import utils from "../utils/utils";
import { BotCommand } from "../utils/interface";
import { rules } from "../database/database";

const command: BotCommand = {
  data: {
    name: "rule",
    description: "Get rule(s) for the DH server.",
    defaultPermission: true,
    options: [
      {
        name: "id",
        description: "ID of a rule",
        type: "INTEGER",
        required: false,
      },
    ],
  },
  guilds: ["dh"],
  async execute(interaction) {
    const ruleID = interaction.options.getInteger("id");

    const ruleEmbed = utils.getRuleEmbedBase(interaction);

    if (ruleID === null) {
      const allRules = await rules.getAll(interaction.guildId);

      interaction.reply({
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
    } else if (!await rules.exists(interaction.guildId, ruleID)) {
      interaction.reply({ content: `Rule #${ruleID} doesn't exist.`, ephemeral: true });
    } else {
      interaction.reply({
        embeds: [ruleEmbed.addField(`Rule #${ruleID}`, (await rules.get(interaction.guildId, ruleID)).content, false)],
      });
    }
  },
};

export default command;
