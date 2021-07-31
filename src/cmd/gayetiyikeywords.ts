import { BotCommand, cfg } from "../vedbot";

export default {
  name: "gayetiyikeywords",
  aliases: ["gikeywords"],
  description: "",
  args: false,
  usage: "",
  guilds: ["dh"],
  permissions: [],
  execute(message) {
    message.channel.send(
      `Use at least one word from each category to make a very well message <:afro:744923369279062156>:\n\n${cfg.servers.dh.gayetiyikeywords
        .map((e: string[]) => e.join(", "))
        .join("\n---\n")}`
    );
  },
} as BotCommand;
