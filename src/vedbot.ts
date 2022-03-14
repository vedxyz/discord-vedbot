// https://discord.com/api/oauth2/authorize?client_id=747882956520947814&permissions=8&scope=applications.commands%20bot
// The bot is not set to public on the Developer Portal, and as such is open to invitation solely by me.

import Discord, { GuildMember } from "discord.js";
import { cfg, vedbot } from "./settings";
import { ids } from "./database/database";
import utils from "./utils/utils";

const { canExecuteModule } = utils;

const client = new Discord.Client({
  intents: [
    "GUILDS",
    "GUILD_MEMBERS",
    "GUILD_VOICE_STATES",
    "GUILD_MESSAGES",
    "GUILD_MESSAGE_REACTIONS",
    "DIRECT_MESSAGES",
  ],
  // partials: ["CHANNEL"], // Apparently required in order to receive DMs
  presence: {
    status: "idle",
    activities: [
      {
        type: "WATCHING",
        name: "for slash commands",
      },
    ],
  },
});
export default client;

client.once("ready", async () => {
  console.log(">> Ready!");

  // Register slash commands along with their permissions

  (await ids.getAllServers()).forEach(async ({ id: serverId, nickname }) => {
    const guildCommandManager = client.guilds.cache.get(serverId)?.commands;
    const guildCommands = vedbot.commands.filter((command) => command.guilds.includes(nickname));

    await guildCommandManager?.set([]);

    guildCommands.forEach(async (command) => {
      const guildCommand = await guildCommandManager?.create(command.data);
      if (Array.isArray(command.permissions)) await guildCommand?.permissions.set({ permissions: command.permissions });
    });
  });
});

client.on("interactionCreate", async (interaction) => {
  if (interaction.isCommand() && interaction.inGuild()) {
    try {
      await vedbot.commands.get(interaction.commandName).execute(interaction);
    } catch (error) {
      console.error(error);
      interaction.reply("**Error**: Unable to execute this command due to some kind of incompetence on my behalf.");
    }
  }
});

client.on("messageCreate", (message) => {
  if (message.author.id === client.user?.id || !message.inGuild()) return;

  ["mizyaz", "dhlink", "mentionimg"].forEach(async (moduleName) => {
    const module = vedbot.modules.get(moduleName);

    try {
      if (canExecuteModule(module, message.guild.id)) await module.onMessage?.(message);
    } catch (error) {
      console.error(error);
    }
  });
});

// client.on("voiceStateUpdate", (oldState, newState) => {});

client.on("guildMemberAdd", (member) => {
  const guildjoinleave = vedbot.modules.get("guildjoinleave");

  if (canExecuteModule(guildjoinleave, member.guild.id)) guildjoinleave?.onMemberJoin?.(member);
});

client.on("guildMemberRemove", (member) => {
  const guildjoinleave = vedbot.modules.get("guildjoinleave");

  if (canExecuteModule(guildjoinleave, member.guild.id)) guildjoinleave?.onMemberLeave?.(member as GuildMember);
});

// client.on("messageReactionAdd", (reaction, user) => {
//   const dhreactrolepicker = vedbot.modules.get("dhreactrolepicker");

//   if (canExecuteModule(dhreactrolepicker, reaction.message.guild?.id))
//     dhreactrolepicker?.onReactionAdd?.(reaction as MessageReaction, user as User);
// });

// client.on("messageReactionRemove", (reaction, user) => {
//   const dhreactrolepicker = vedbot.modules.get("dhreactrolepicker");

//   if (canExecuteModule(dhreactrolepicker, reaction.message.guild?.id))
//     dhreactrolepicker?.onReactionRemove?.(reaction as MessageReaction, user as User);
// });

client.login(cfg.token);

process.on("SIGINT", async () => {
  console.log("SIGINT caught!");
  await utils.exitBot();
});
