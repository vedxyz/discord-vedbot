// https://discord.com/api/oauth2/authorize?client_id=747882956520947814&permissions=8&scope=bot

const fs = require("fs");
const Discord = require("discord.js");
const cfg = require("./config.json");

const client = new Discord.Client({ presence: {
  status: "online",
  activity: {
    name: `for prefix ' ${cfg.prefix} '`,
    type: "WATCHING",
    url: "https://vedat.xyz"
  }
} });
client.commands = new Discord.Collection();
client.modules = new Discord.Collection();

client.commands.set("__rootdir", "./cmd");
client.modules.set("__rootdir", "./modules");

// Grab and register commands & modules

[client.modules, client.commands].forEach(collection => {
  
  const files = fs.readdirSync(collection.get("__rootdir")).filter(file => file.endsWith(".js"));
  
  for (const file of files) {
    const fileObject = require(`${collection.get("__rootdir")}/${file}`);
    fileObject.__rootdir = collection.get("__rootdir");
    collection.set(fileObject.name, fileObject);
  }
  
});

// Guild variables

let dh = {
  channels: {},
  messages: {},
  reactionQueue: new Set()
};

let cr = {
  channels: {}
};

let cs = {
  channels: {}
};

client.serverVars = {
  dh: dh,
  cr: cr,
  cs: cs
};

// Begin here

client.once("ready", () => {
  
  console.log(">> Ready!");
  
  // Grab required channels
  
  Object.keys(client.serverVars).forEach(srv => {
    
    for (const [key, val] of Object.entries(cfg[srv].channels)) {
    
      client.serverVars[srv].channels[key] = client.channels.cache.get(val);
      
    }
    
  });
  
  // Fetch required messages
  
  dh.channels.rules.messages.fetch(cfg.dh.messages.rules_c).then(msg => dh.messages.rules_c = msg);
  dh.channels.rules.messages.fetch(cfg.dh.messages.rules_p1).then(msg => dh.messages.rules_p1 = msg);
  dh.channels.rules.messages.fetch(cfg.dh.messages.rules_p2).then(msg => dh.messages.rules_p2 = msg);
  dh.channels.rolepick.messages.fetch(cfg.dh.messages.roles).then(msg => dh.messages.roles = msg);
  
  //[/*cs,*/ dh].forEach(srv => srv.channels.log.send("```=> VedBot is running.```"));
  
});

client.on("voiceStateUpdate", (oldState, newState) => {
  
  client.modules.get("michelle").execute(oldState, newState, cr.channels.commands);
  
});

client.on("message", message => {
  
  if (message.author.id === client.user.id) return;
  
  // Commands
  
  if (message.content.startsWith(cfg.prefix)) {
    
    const args = message.content.slice(cfg.prefix.length).trim().split(/ +/);
    const commandName = args.shift();
    
    const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
    
    if (!command) {
      return message.reply("There is no such command.");
    }
    
    if (command.guilds) {
      
      if (message.channel.type === "dm") {
        return message.reply("I can't execute that command inside DMs! Try it again in a server perhaps?");
      }
      
      if (Array.isArray(command.guilds) && !command.guilds.some(srv => cfg[srv].id === message.guild.id)) {
        return message.reply("This command isn't available on this server.");
      }
      
    }
    
    if (command.permissions) {
      
      const authorPerms = message.channel.permissionsFor(message.author);
      
      const hasPermission = command.permissions.some(e => e === message.author.id) || 
        ( command.permissions.filter(e => !Number.isInteger(parseInt(e[0]))).length &&
          command.permissions.filter(e => !Number.isInteger(parseInt(e[0]))).every(perm => authorPerms && authorPerms.has(perm)) );
      
      if (!hasPermission) return message.reply("You do not have the permissions to use this command.");
      
    }
    
    if (command.args && !args.length) {
      
      return message.reply(
        "This command requires argument(s)." + 
        `\nUsage: \`${cfg.prefix}${commandName} ${command.usage}\``
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
  
  let optional = {
    
  };
  
  let moduleResult = "";
  
  try {
    
    moduleResult = ["mizyaz", "dhlink", "gayetiyi", "harunabi", "atpics"].map(module => client.modules.get(module).onMsg(message, optional)).filter(e => e);
    
  } catch (error) {
    
    console.error(error);
    
  }
  
  return moduleResult.length && message.reply(moduleResult.join("\n===\n"));
  
});

client.on("guildMemberAdd", member => {
  
  client.modules.get("guildjoinleave").onJoin(member, { serverVars: client.serverVars });
  
});

client.on("guildMemberRemove", member => {
  
  client.modules.get("guildjoinleave").onLeave(member, { serverVars: client.serverVars });
  
});

client.on("messageReactionAdd", (reaction, user) => {
  
  client.modules.get("dhreactrolepicker").onAdd(reaction, user, { serverVars: client.serverVars });
  
});

client.on("messageReactionRemove", (reaction, user) => {
  
  client.modules.get("dhreactrolepicker").onRemove(reaction, user, { serverVars: client.serverVars });
  
});

client.login(cfg.token);
