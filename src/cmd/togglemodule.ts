import { MessageEmbed } from "discord.js";
import utils from "../utils";
import { BotCommand, vedbot, cfg } from "../vedbot";

const command: BotCommand = {
  data: {
    name: "togglemodule",
    description: "List or toggle VedBot modules for the current server",
    defaultPermission: false,
    options: [
      {
        name: "module",
        description: "Module to be toggled",
        type: "STRING",
        required: false,
      },
    ],
  },
  permissions: [
    utils.permissions.getOwner(cfg),
    ...utils.permissions.getAdmins(cfg),
  ],
  guilds: ["dh", "cr", "cs"],
  execute(interaction) {
    const availableModules = vedbot.modules.filter((module) =>
      module.guilds.some((srv) => cfg.servers[srv as keyof typeof cfg.servers].id === interaction.guild?.id)
    );

    const moduleName = interaction.options.getString("module");

    if (moduleName === null) {
      interaction.reply({
        embeds: [
          new MessageEmbed()
            .setTitle("VedBot Flexible Modules")
            .setDescription("Lists modules available for this server. Commands not included.")
            .setTimestamp()
            .setFooter(`${vedbot.modules.size - 1} modules loaded in total.`)
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

export default command;
