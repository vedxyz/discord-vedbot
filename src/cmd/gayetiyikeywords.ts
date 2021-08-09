import { BotCommand, cfg } from "../vedbot";

const command: BotCommand = {
  data: {
    name: "gayetiyikeywords",
    description: "",
    defaultPermission: true,
  },
  guilds: ["dh"],
  execute(interaction) {
    interaction.reply(
      `Use at least one word from each category to make a very well message <:afro:744923369279062156>:\n\n${cfg.servers.dh.gayetiyikeywords
        .map((e: string[]) => e.join(", "))
        .join("\n---\n")}`
    );
  },
};

export default command;
