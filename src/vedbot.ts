// https://discord.com/api/oauth2/authorize?client_id=747882956520947814&permissions=8&scope=bot

import fs from "fs";
import Discord, {
  Channel,
  GuildMember,
  Message,
  MessageReaction,
  PartialGuildMember,
  PartialUser,
  PermissionString,
  TextChannel,
  User,
  VoiceChannel,
  VoiceState,
} from "discord.js";
import cfg from "./config.json";

interface BotModule {
  rootdir?: string;
  name: string;
  description: string;
  state: boolean;
  guilds: string[];
  onMsg?: (message: Message, optional: any) => any;
  onVoiceUpdate?: (oldState: VoiceState, newState: VoiceState, optional: any) => any;
  onMemberJoin?: (member: GuildMember, optional: any) => any;
  onMemberLeave?: (member: GuildMember, optional: any) => any;
  onReactionAdd?: (reaction: MessageReaction, user: User, optional: any) => any;
  onReactionRemove?: (reaction: MessageReaction, user: User, optional: any) => any;
}

interface BotCommand {
  rootdir?: string;
  name: string;
  aliases: string[];
  description: string;
  args: boolean;
  usage: string;
  guilds: string[];
  permissions: PermissionString[];
  allowedUser?: string[];
  execute: (message: Message, args: string[]) => any;
}

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
  commands: {
    rootdir: "./cmd",
    collection: new Discord.Collection<string, BotCommand>(),
  },
  modules: {
    rootdir: "./modules",
    collection: new Discord.Collection<string, BotModule>(),
  },
  serverVars: {
    dh: {
      key: "dh",
      channels: new Map<string, TextChannel>(),
      messages: new Map<string, Message | undefined>(),
      reactionQueue: new Set<string>(),
    },
    cr: {
      key: "cr",
      channels: new Map<string, TextChannel>(),
    },
    cs: {
      key: "cs",
      channels: new Map<string, TextChannel>(),
    },
  },
};
const dh = vedbot.serverVars.dh;
const cr = vedbot.serverVars.cr;

// Grab and register commands & modules

[vedbot.modules, vedbot.commands].forEach((importType) => {
  const files = fs.readdirSync(importType.rootdir).filter((file) => file.endsWith(".js"));

  for (const file of files) {
    const fileObject = require(`${importType.rootdir}/${file}`);
    fileObject.rootdir = importType.rootdir;
    importType.collection.set(fileObject.name, fileObject);
  }
});

// Begin here

client.once("ready", async () => {
  console.log(">> Ready!");

  // Grab required channels

  Object.entries(cfg.servers.dh.channels).forEach(async ([channelName, channelID]) => {
    vedbot.serverVars.dh.channels.set(channelName, (await client.channels.fetch(channelID)) as TextChannel);
  });

  Object.entries(cfg.servers.cr.channels).forEach(async ([channelName, channelID]) => {
    vedbot.serverVars.cr.channels.set(channelName, (await client.channels.fetch(channelID)) as TextChannel);
  });

  Object.entries(cfg.servers.cs.channels).forEach(async ([channelName, channelID]) => {
    vedbot.serverVars.cs.channels.set(channelName, (await client.channels.fetch(channelID)) as TextChannel);
  });

  // Fetch required messages

  dh.messages.set("rules_c", await dh.channels.get("rules")?.messages.fetch(cfg.servers.dh.messages.rules_c));
  dh.messages.set("rules_p1", await dh.channels.get("rules")?.messages.fetch(cfg.servers.dh.messages.rules_p1));
  dh.messages.set("rules_p2", await dh.channels.get("rules")?.messages.fetch(cfg.servers.dh.messages.rules_p2));
  dh.messages.set("roles", await dh.channels.get("rolepick")?.messages.fetch(cfg.servers.dh.messages.roles));

  // [/*cs,*/ dh].forEach(srv => srv.channels.log.send("```=> VedBot is running.```"));
});

client.on("voiceStateUpdate", (oldState, newState) => {
  vedbot.modules.collection.get("michelle")?.onVoiceUpdate!(oldState, newState, cr.channels.get("commands"));
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
      vedbot.commands.collection.get(commandName) ||
      vedbot.commands.collection.find((cmd) => cmd.aliases.includes(commandName));

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

  let optional = {};

  let moduleResult = [];

  try {
    moduleResult = ["mizyaz", "dhlink", "gayetiyi", "harunabi", "atpics"]
      .map((module) => vedbot.modules.collection.get(module)?.onMsg!(message, optional))
      .filter((e) => e);
  } catch (error) {
    console.error(error);
  }

  return moduleResult.length && message.reply(moduleResult.join("\n===\n"));
});

client.on("guildMemberAdd", (member) => {
  vedbot.modules.collection.get("guildjoinleave")?.onMemberJoin!(member, { serverVars: vedbot.serverVars });
});

client.on("guildMemberRemove", (member) => {
  vedbot.modules.collection.get("guildjoinleave")?.onMemberLeave!(member as GuildMember, {
    serverVars: vedbot.serverVars,
  });
});

client.on("messageReactionAdd", (reaction, user) => {
  vedbot.modules.collection.get("dhreactrolepicker")?.onReactionAdd!(reaction, user as User, {
    serverVars: vedbot.serverVars,
  });
});

client.on("messageReactionRemove", (reaction, user) => {
  vedbot.modules.collection.get("dhreactrolepicker")?.onReactionRemove!(reaction, user as User, {
    serverVars: vedbot.serverVars,
  });
});

client.login(cfg.token);

export { BotCommand, BotModule, vedbot };
