// https://discord.com/api/oauth2/authorize?client_id=747882956520947814&permissions=8&scope=bot

import Discord, { GuildMember, Message, TextChannel, User } from "discord.js";
import { BotCommand, BotModule } from "./interface";
import utils, { BotFileCollection } from "./utils";

const cfg = utils.loadConfig();

const client = new Discord.Client({
  presence: {
    status: "online",
    activity: {
      name: `for prefix ' ${cfg.prefix} '`,
      type: "WATCHING",
      url: "https://vedat.xyz",
    },
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
const dh = vedbot.guilds.dh;

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
  vedbot.modules.get("michelle")?.onVoiceUpdate!(oldState, newState);
});

client.on("message", (message) => {
  if (message.author.id === client.user?.id) return;

  // Commands

  if (message.content.startsWith(cfg.prefix)) {
    if (message.channel.type === "dm") {
      return message.reply("I can't execute that command inside DMs! Try it again in a server perhaps?");
    }

    const args = message.content.slice(cfg.prefix.length).trim().split(/ +/);
    const commandName = args.shift() || "";

    const command =
      vedbot.commands.get(commandName) || vedbot.commands.find((cmd) => cmd.aliases.includes(commandName));

    if (!command) {
      return message.reply("There is no such command.");
    }

    if (
      command.guilds.length !== 0 &&
      !command.guilds.some((srv) => cfg.servers[srv as keyof typeof cfg.servers].id === message.guild?.id)
    ) {
      return message.reply("This command isn't available on this server.");
    }

    if (message.channel.type === "text") {
      const authorPerms = message.channel.permissionsFor(message.author);

      const hasPermission =
        (command.permissions.length === 0 && !command.allowedUser) || // is command publicly available?
        (command.permissions.length !== 0 && command.permissions.every((perm) => authorPerms?.has(perm))) || // does user have permission to use command?
        command.allowedUser?.includes(message.author.id); // is user explicitly allowed to use command?

      if (!hasPermission) return message.reply("You do not have the permissions to use this command.");
    }

    if (command.args && !args.length) {
      return message.reply(
        "This command requires argument(s)." + `\nUsage: \`${cfg.prefix}${commandName} ${command.usage}\``
      );
    }

    try {
      command.execute(message, args);
    } catch (error) {
      console.error(error);
      message.reply("There was a technical error trying to execute that command!");
    }

    return;
  }

  // Modules

  let moduleResult: any[] = [];

  try {
    moduleResult = ["mizyaz", "dhlink", "gayetiyi", "harunabi", "atpics"]
      .map((module) => vedbot.modules.get(module)?.onMsg!(message))
      .filter((e) => e);
  } catch (error) {
    console.error(error);
  }

  return moduleResult.length && message.reply(moduleResult.join("\n===\n"));
});

client.on("guildMemberAdd", (member) => {
  vedbot.modules.get("guildjoinleave")?.onMemberJoin!(member);
});

client.on("guildMemberRemove", (member) => {
  vedbot.modules.get("guildjoinleave")?.onMemberLeave!(member as GuildMember);
});

client.on("messageReactionAdd", (reaction, user) => {
  vedbot.modules.get("dhreactrolepicker")?.onReactionAdd!(reaction, user as User);
});

client.on("messageReactionRemove", (reaction, user) => {
  vedbot.modules.get("dhreactrolepicker")?.onReactionRemove!(reaction, user as User);
});

client.login(cfg.token);

export { BotCommand, BotModule, vedbot, client, cfg };
