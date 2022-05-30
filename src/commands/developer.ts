import { CommandInteraction, MessageEmbed } from "discord.js";
import { SlashCommandBuilder } from "@discordjs/builders";
import utils from "../utils/utils";
import { BotCommand } from "../utils/interface";
import { vedbot } from "../settings";
import { subscriptionState } from "../utils/mealsubservice";

const subcommands = {
  killbot: async (interaction: CommandInteraction) => {
    await interaction.reply("```=> Killing the bot.```");
    await utils.exitBot();
  },
  togglemodule: async (interaction: CommandInteraction) => {
    const moduleName = interaction.options.getString("module");

    if (moduleName === null) {
      await interaction.reply({
        embeds: [
          new MessageEmbed()
            .setTitle("VedBot Modules")
            .setDescription("Lists modules available for this server. Commands not included.")
            .setTimestamp()
            .setFooter({ text: `${vedbot.modules.size} modules loaded in total.` })
            .setColor("RED")
            .setThumbnail(interaction.client.user?.avatarURL() || "")
            .addFields(
              vedbot.modules.map((module) => ({
                name: `${module.name} | ${module.state ? "ENABLED" : "DISABLED"}`,
                value: module.description || "No description added.",
                inline: false,
              }))
            ),
        ],
      });
    } else {
      const module = vedbot.modules.find((_module) => _module.name === moduleName);

      if (module) {
        module.state = !module.state;
        await interaction.reply(`"${moduleName}" module is now **${module.state ? "ENABLED" : "DISABLED"}**.`);
      } else {
        await interaction.reply(`"${moduleName}" module is not available.`);
      }
    }
  },
  togglesubs: async (interaction: CommandInteraction) => {
    subscriptionState.toggle();
    await interaction.reply({
      content: `Cafeteria subscriptions are now **${subscriptionState.state ? "ENABLED" : "DISABLED"}**`,
      ephemeral: true,
    });
  },
};

const command: BotCommand = {
  data: new SlashCommandBuilder()
    .setName("developer")
    .setDescription("Contains utility commands for the developer of this bot")
    .setDefaultPermission(false)
    .addSubcommand((killbot) => killbot.setName("killbot").setDescription("Kills the bot"))
    .addSubcommand((togglemodule) =>
      togglemodule
        .setName("togglemodule")
        .setDescription("List or toggle VedBot modules")
        .addStringOption((module) => module.setName("module").setDescription("Module to be toggled").setRequired(false))
    )
    .addSubcommand((togglesubs) =>
      togglesubs.setName("togglesubs").setDescription("Toggle VedBot cafeteria subscription notifications")
    ),
  permissions: [utils.permissions.getOwner()],
  guilds: ["dev"],
  async execute(interaction) {
    const subcommand = interaction.options.getSubcommand() as keyof typeof subcommands;

    await subcommands[subcommand](interaction);
  },
};

export default command;
