import utils from "../utils";
import { BotCommand, cfg, vedbot } from "../vedbot";

console.log(`Filenames (static): ${utils.botfiles.getAllFileNames(vedbot.commands, vedbot.modules)}`);

const command: BotCommand = {
  data: {
    name: "reload",
    description: "Reloads a file",
    defaultPermission: false,
    options: [
      {
        name: "filename",
        description: "BotFile to be reloaded",
        type: "STRING",
        required: true,
        choices: utils
          .botfiles.getAllFileNames(vedbot.commands, vedbot.modules)
          .map((filename) => ({ name: filename, value: filename.slice(0, -3) })),
      },
    ],
  },
  permissions: [
    utils.permissions.getOwner(cfg)
  ],
  guilds: ["dh", "cs", "cr"],
  execute(interaction) {
    const filename = interaction.options.getString("filename", true);

    let file;
    let fileCollection;

    console.log(`Filenames: ${utils.botfiles.getAllFileNames(vedbot.commands, vedbot.modules)}`);
    
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
};

export default command;
