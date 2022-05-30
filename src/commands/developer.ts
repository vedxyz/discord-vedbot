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
  toggleevent: async (interaction: CommandInteraction) => {
    const eventName = interaction.options.getString("event");

    if (eventName === null) {
      await interaction.reply({
        embeds: [
          new MessageEmbed()
            .setTitle("VedBot Events")
            .setDescription("Lists events available for this server. Commands not included.")
            .setTimestamp()
            .setFooter({ text: `${vedbot.events.size} event(s) loaded in total.` })
            .setColor("RED")
            .setThumbnail(interaction.client.user?.avatarURL() || "")
            .addFields(
              vedbot.events.map((event) => ({
                name: `${event.name} | ${event.state ? "ENABLED" : "DISABLED"}`,
                value: event.description || "No description added.",
                inline: false,
              }))
            ),
        ],
      });
    } else {
      const event = vedbot.events.find((_event) => _event.name === eventName);

      if (event) {
        event.state = !event.state;
        await interaction.reply(`Event "${eventName}" is now **${event.state ? "ENABLED" : "DISABLED"}**.`);
      } else {
        await interaction.reply(`Event "${eventName}" is not available.`);
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
    .addSubcommand((toggleevent) =>
      toggleevent
        .setName("toggleevent")
        .setDescription("List or toggle VedBot events")
        .addStringOption((event) => event.setName("event").setDescription("Event to be toggled").setRequired(false))
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
