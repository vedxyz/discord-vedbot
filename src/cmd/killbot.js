module.exports = {
  name: "killbot",
  aliases: ["botkill", "stopbot"],
  description: "Kills the bot.",
  args: false,
  usage: "",
  guilds: false,
  permissions: ["123867745191198720"],
  execute(message, args) {
    
    message.channel.send("```=> Killing the bot.```").then(() => process.exit());
    
  }
};
