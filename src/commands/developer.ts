import { CommandInteraction, MessageEmbed } from "discord.js";
import utils from "../utils/utils";
import fsutils from "../utils/fsutils";
import { BotCommand } from "../utils/interface";
import { ids } from "../database/database";
import { vedbot } from "../settings";
import { subscriptionState } from "../utils/mealsubservice";

const subcommands = {
  killbot: async (interaction: CommandInteraction) => {
    await interaction.reply("```=> Killing the bot.```");
    await utils.exitBot();
  },
  reload: async (interaction: CommandInteraction) => {
    const filename = interaction.options.getString("filename", true);

    let file;
    let fileCollection;

    if (vedbot.commands.has(filename)) {
      file = vedbot.commands.get(filename);
      fileCollection = vedbot.commands;
    } else if (vedbot.modules.has(filename)) {
      file = vedbot.modules.get(filename);
      fileCollection = vedbot.modules;
    }

    if (!file || !fileCollection) {
      await interaction.reply(`There is no loaded file with name \`${filename}\`!`);
    } else {
      try {
        fsutils.botfiles.reload(fileCollection, filename);

        await interaction.reply(`File \`${filename}.js\` was reloaded!`);
      } catch (error) {
        console.error(error);
        await interaction.reply({
          content: `There was an error while reloading file \`${filename}.js\`:\n\`${error}\``,
          ephemeral: true,
        });
      }
    }
  },
  togglemodule: async (interaction: CommandInteraction) => {
    const availableModules = vedbot.modules.filter((module) =>
      module.guilds.some(async (srv) => (await ids.getServerId(srv)) === interaction.guild?.id)
    );

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
              availableModules.map((module) => ({
                name: `${module.name} | ${module.state ? "ENABLED" : "DISABLED"}`,
                value: module.description || "No description added.",
                inline: false,
              }))
            ),
        ],
      });
    } else {
      const module = availableModules.find((_module) => _module.name === moduleName);

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
  data: {
    name: "developer",
    description: "Contains utility commands for the developer of this bot.",
    defaultPermission: false,
    options: [
      {
        name: "killbot",
        description: "Kills the bot.",
        type: "SUB_COMMAND",
      },
      {
        name: "reload",
        description: "Reloads a bot command/module file.",
        type: "SUB_COMMAND",
        options: [
          {
            name: "filename",
            description: "BotFile to be reloaded",
            type: "STRING",
            required: true,
            choices: fsutils.botfiles
              .getAllFileNamesSync(vedbot.commands, vedbot.modules)
              .map((filename) => ({ name: filename, value: filename.slice(0, -3) })),
          },
        ],
      },
      {
        name: "togglemodule",
        description: "List or toggle VedBot modules for the current server.",
        type: "SUB_COMMAND",
        options: [
          {
            name: "module",
            description: "Module to be toggled",
            type: "STRING",
            required: false,
          },
        ],
      },
      {
        name: "togglesubs",
        description: "Toggle VedBot cafeteria subscription notifications.",
        type: "SUB_COMMAND",
      },
    ],
  },
  permissions: [utils.permissions.getOwner()],
  guilds: ["dh", "cs", "cr"],
  async execute(interaction) {
    const subcommand = interaction.options.getSubcommand() as keyof typeof subcommands;

    await subcommands[subcommand](interaction);
  },
};

export default command;
