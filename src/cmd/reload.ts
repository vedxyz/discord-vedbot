import utils from "../utils";
import { BotCommand, vedbot } from "../vedbot";

export default {
  name: "reload",
  aliases: [],
  description: "Reloads a file",
  args: true,
  usage: "[command/module name]...",
  guilds: [],
  permissions: [],
  allowedUser: ["123867745191198720"],
  execute(message, args) {
    args.forEach(async (arg) => {
      let file;
      let fileCollection;

      if (vedbot.commands.has(arg)) {
        file = vedbot.commands.get(arg);
        fileCollection = vedbot.commands;
      } else if (vedbot.modules.has(arg)) {
        file = vedbot.modules.get(arg);
        fileCollection = vedbot.modules;
      }

      if (!file || !fileCollection) {
        message.reply(`There is no loaded file with name \`${arg}\`!`);
      } else {
        try {
          utils.reloadBotFile(fileCollection, file.name);

          message.reply(`File \`${file.name}.js\` was reloaded!`);
        } catch (error) {
          // eslint-disable-next-line no-console
          console.error(error);
          message.reply(`There was an error while reloading file \`${file.name}.js\`:\n\`${error.message}\``);
        }
      }
    });
  },
} as BotCommand;
