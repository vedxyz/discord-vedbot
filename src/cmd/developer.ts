import { exec } from "child_process";
import { CommandInteraction, MessageEmbed } from "discord.js";
import path from "path";
import utils from "../utils";
import { BotCommand, cfg, vedbot } from "../vedbot";

const subcommands = {
  killbot: (interaction: CommandInteraction) => {
    interaction
      .reply("```=> Killing the bot.```")
      .then(() => exec(`pm2 stop ${path.join(__dirname, "..", "..", "ecosystem.config.js")}`));
  },
  reload: (interaction: CommandInteraction) => {
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
      interaction.reply(`There is no loaded file with name \`${filename}\`!`);
    } else {
      try {
        utils.botfiles.reload(fileCollection, filename);

        interaction.reply(`File \`${filename}.js\` was reloaded!`);
      } catch (error) {
        console.error(error);
        interaction.reply({
          content: `There was an error while reloading file \`${filename}.js\`:\n\`${error.message}\``,
          ephemeral: true,
        });
      }
    }
  },
  togglemodule: (interaction: CommandInteraction) => {
    const availableModules = vedbot.modules.filter((module) =>
      module.guilds.some((srv) => cfg.servers[srv].id === interaction.guild?.id)
    );

    const moduleName = interaction.options.getString("module");

    if (moduleName === null) {
      interaction.reply({
        embeds: [
          new MessageEmbed()
            .setTitle("VedBot Modules")
            .setDescription("Lists modules available for this server. Commands not included.")
            .setTimestamp()
            .setFooter(`${vedbot.modules.size} modules loaded in total.`)
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
        interaction.reply(`"${moduleName}" module is now **${module.state ? "ENABLED" : "DISABLED"}**.`);
      } else {
        interaction.reply(`"${moduleName}" module is not available.`);
      }
    }
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
            choices: utils.botfiles
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
    ],
  },
  permissions: [utils.permissions.getOwner(cfg)],
  guilds: ["dh", "cs", "cr"],
  execute(interaction) {
    const subcommand = interaction.options.getSubcommand() as keyof typeof subcommands;

    subcommands[subcommand](interaction);
  },
};

export default command;