// https://discord.com/api/oauth2/authorize?client_id=747882956520947814&permissions=8&scope=applications.commands%20bot
// The bot is not set to public on the Developer Portal, and as such is open to invitation solely by me.

import Discord, { GuildMember, Message, MessageReaction, TextChannel, User } from "discord.js";
import { BotCommand, BotModule } from "./interface";
import utils, { BotFileCollection } from "./utils";

const cfg = utils.loadConfig();
const { canExecuteModule } = utils;

const client = new Discord.Client({
  intents: ["GUILD_MEMBERS", "GUILD_VOICE_STATES", "GUILD_MESSAGES", "GUILD_MESSAGE_REACTIONS", "DIRECT_MESSAGES"],
  // partials: ["CHANNEL"], // Apparently required in order to receive DMs
  presence: {
    status: "online",
    activities: [
      {
        name: "for slash commands",
        type: "WATCHING",
      },
    ],
  },
});

const vedbot = {
  commands: new BotFileCollection<BotCommand>("cmd"),
  modules: new BotFileCollection<BotModule>("modules"),
  guilds: {
    dh: {
      channels: new Map<string, TextChannel>(),
      messages: new Map<string, Message | undefined>(),
      reactionQueue: new Set<string>(),
    },
    cr: {
      channels: new Map<string, TextChannel>(),
    },
    cs: {
      channels: new Map<string, TextChannel>(),
    },
  },
};
const { dh } = vedbot.guilds;

// Grab and store commands & modules

utils.loadBotFiles(vedbot.modules, vedbot.commands);

// Begin here

client.once("ready", async () => {
  console.log(">> Ready!");
  cfg.ownerId = client.application?.owner?.id || "";

  // Grab required channels

  await utils.fetchConfigChannels(
    client,
    [cfg.servers.dh.channels, vedbot.guilds.dh.channels],
    [cfg.servers.cr.channels, vedbot.guilds.cr.channels],
    [cfg.servers.cs.channels, vedbot.guilds.cs.channels]
  );

  // Fetch required messages

  dh.messages.set("rules_c", await dh.channels.get("rules")?.messages.fetch(cfg.servers.dh.messages.rules_c));
  dh.messages.set("rules_p1", await dh.channels.get("rules")?.messages.fetch(cfg.servers.dh.messages.rules_p1));
  dh.messages.set("rules_p2", await dh.channels.get("rules")?.messages.fetch(cfg.servers.dh.messages.rules_p2));
  dh.messages.set("roles", await dh.channels.get("rolepick")?.messages.fetch(cfg.servers.dh.messages.roles));

  // Register slash commands along with their permissions

  Object.keys(cfg.servers).forEach(async (server) => {
    const guildCommandManager = client.guilds.cache.get(cfg.servers[server].id)?.commands;
    const guildCommands = vedbot.commands.filter((command) => command.guilds.includes(server));

    await guildCommandManager?.set([]);

    guildCommands.forEach(async (command) => {
      const guildCommand = await guildCommandManager?.create(command.data);
      console.log(`Created command "${guildCommand?.name}" for guild "${server}"`);
      if (Array.isArray(command.permissions)) await guildCommand?.permissions.set({ permissions: command.permissions });
    });
  });

  // [/*cs,*/ dh].forEach(srv => srv.channels.log.send("```=> VedBot is running.```"));
});

client.on("interactionCreate", (interaction) => {
  if (interaction.isCommand() && interaction.inGuild()) {
    try {
      vedbot.commands.get(interaction.commandName)?.execute(interaction);
    } catch (error) {
      console.error(error);
      interaction.reply("**Error**: Unable to execute this command due to some kind of incompetence.");
    }
  }
});

client.on("messageCreate", (message) => {
  if (message.author.id === client.user?.id || message.channel.type === "DM") return;

  // Modules
  try {
    ["mizyaz", "dhlink", "gayetiyi", "harunabi", "atpics"].forEach((moduleName) => {
      const module = vedbot.modules.get(moduleName);

      if (canExecuteModule(cfg, module, message.guild?.id)) module?.onMessage?.(message);
    });
  } catch (error) {
    console.error(error);
  }
});

client.on("voiceStateUpdate", (oldState, newState) => {
  const michelle = vedbot.modules.get("michelle");

  if (canExecuteModule(cfg, michelle, oldState.guild.id)) michelle?.onVoiceUpdate?.(oldState, newState);
});

client.on("guildMemberAdd", (member) => {
  const guildjoinleave = vedbot.modules.get("guildjoinleave");

  if (canExecuteModule(cfg, guildjoinleave, member.guild.id)) guildjoinleave?.onMemberJoin?.(member);
});

client.on("guildMemberRemove", (member) => {
  const guildjoinleave = vedbot.modules.get("guildjoinleave");

  if (canExecuteModule(cfg, guildjoinleave, member.guild.id)) guildjoinleave?.onMemberLeave?.(member as GuildMember);
});

client.on("messageReactionAdd", (reaction, user) => {
  const dhreactrolepicker = vedbot.modules.get("dhreactrolepicker");

  if (canExecuteModule(cfg, dhreactrolepicker, reaction.message.guild?.id))
    dhreactrolepicker?.onReactionAdd?.(reaction as MessageReaction, user as User);
});

client.on("messageReactionRemove", (reaction, user) => {
  const dhreactrolepicker = vedbot.modules.get("dhreactrolepicker");

  if (canExecuteModule(cfg, dhreactrolepicker, reaction.message.guild?.id))
    dhreactrolepicker?.onReactionRemove?.(reaction as MessageReaction, user as User);
});

client.login(cfg.token);

export { BotCommand, BotModule, vedbot, client, cfg };
