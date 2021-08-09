import utils from "../utils";
import { BotCommand, cfg } from "../vedbot";

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
        choices: Array.from({ length: cfg.servers.dh.rules.length }, (_, i) => ({ name: `${i + 1}`, value: i + 1 })),
      },
    ],
  },
  guilds: ["dh"],
  execute(interaction) {
    const ruleID = interaction.options.getInteger("id");

    const ruleEmbed = utils.getRuleEmbedBase(interaction);

    console.log(`guild: ${interaction.guild}`);
    
    if (ruleID === null) {
      const ruleStack = cfg.servers.dh.rules
        .map((rule: string, idx: number) => (rule.length ? { index: idx + 1, content: rule } : false))
        .filter((e: unknown) => e);

      interaction.reply({
        embeds: [
          ruleEmbed.addFields(
            ruleStack.map((rule: { index: number; content: string }) => ({
              name: `Kural #${rule.index}`,
              value: rule.content,
              inline: false,
            }))
          ),
        ],
      });
    } else if (!cfg.servers.dh.rules[ruleID - 1].length) {
      interaction.reply({ content: `Rule #${ruleID} is blank.`, ephemeral: true });
    } else {
      interaction.reply({
        embeds: [ruleEmbed.addField(`Kural #${ruleID}`, cfg.servers.dh.rules[ruleID - 1], false)],
      });
    }
  },
};

export default command;
