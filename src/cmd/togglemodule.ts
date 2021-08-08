import { MessageEmbed } from "discord.js";
import { BotCommand, vedbot, cfg } from "../vedbot";

const ved = "123867745191198720";

export default {
  name: "togglemodule",
  aliases: ["tmod"],
  description: "",
  args: false,
  usage: "[module name]...",
  guilds: ["dh", "cr", "cs"],
  permissions: ["ADMINISTRATOR", ved],
  execute(message, args) {
    const availableModules = vedbot.modules.filter(
      (module) =>
        module.guilds.length !== 0 &&
        module.guilds.some((srv) => cfg.servers[srv as keyof typeof cfg.servers].id === message.guild?.id)
    );

    if (!args.length) {
      message.reply({
        embeds: [
          new MessageEmbed()
            .setTitle("VedBot Flexible Modules")
            .setDescription("Lists modules available for this server. Commands not included.")
            .setTimestamp()
            .setFooter(`${vedbot.modules.size - 1} modules loaded in total.`)
            .setColor("RED")
            .setThumbnail(message.client.user?.avatarURL() || "")
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
      args.forEach((arg) => {
        const module = availableModules.find((_module) => _module.name === arg);

        if (module) {
          module.state = !module.state;
          message.channel.send(`"${arg}" module is now **${module.state ? "ENABLED" : "DISABLED"}**.`);
        } else {
          message.channel.send(`"${arg}" module is not available.`);
        }
      });
    }
  },
} as BotCommand;
