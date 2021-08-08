// https://discord.com/api/oauth2/authorize?client_id=747882956520947814&permissions=8&scope=bot
// The bot is not set to public on the Developer Portal, and as such is open to invitation solely by me.

import Discord, { GuildMember, Message, MessageReaction, TextChannel, User } from "discord.js";
import { BotCommand, BotModule } from "./interface";
import utils, { BotFileCollection } from "./utils";

const cfg = utils.loadConfig();

const client = new Discord.Client({
  intents: ["GUILD_MEMBERS", "GUILD_VOICE_STATES", "GUILD_MESSAGES", "GUILD_MESSAGE_REACTIONS", "DIRECT_MESSAGES"],
  partials: ["CHANNEL"],
  presence: {
    status: "online",
    activities: [
      {
        name: `for prefix ' ${cfg.prefix} '`,
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

// Grab and register commands & modules

utils.loadBotFiles(vedbot.modules, vedbot.commands);

// Begin here

client.once("ready", async () => {
  console.log(">> Ready!");

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

  // [/*cs,*/ dh].forEach(srv => srv.channels.log.send("```=> VedBot is running.```"));
});

client.on("voiceStateUpdate", (oldState, newState) => {
  vedbot.modules.get("michelle")?.onVoiceUpdate?.(oldState, newState);
});

client.on("messageCreate", (message) => {
  if (message.author.id === client.user?.id) return;

  // Modules
  try {
    ["mizyaz", "dhlink", "gayetiyi", "harunabi", "atpics"].forEach((module) =>
      vedbot.modules.get(module)?.onMsg?.(message)
    );
  } catch (error) {
    console.error(error);
  }
});

client.on("guildMemberAdd", (member) => {
  vedbot.modules.get("guildjoinleave")?.onMemberJoin?.(member);
});

client.on("guildMemberRemove", (member) => {
  vedbot.modules.get("guildjoinleave")?.onMemberLeave?.(member as GuildMember);
});

client.on("messageReactionAdd", (reaction, user) => {
  vedbot.modules.get("dhreactrolepicker")?.onReactionAdd?.(reaction as MessageReaction, user as User);
});

client.on("messageReactionRemove", (reaction, user) => {
  vedbot.modules.get("dhreactrolepicker")?.onReactionRemove?.(reaction as MessageReaction, user as User);
});

client.login(cfg.token);

export { BotCommand, BotModule, vedbot, client, cfg };
