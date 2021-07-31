import { BotModule, cfg, vedbot } from "../vedbot";

export default {
  name: "michelle",
  description: "Makes sure to let Michelle know it has been an honor.",
  state: true,
  guilds: ["cr"],
  onVoiceUpdate(oldState, newState) {
    if (
      !this.guilds.some((srv) => cfg.servers[srv as keyof typeof cfg.servers].id === oldState.guild.id) ||
      !this.state
    )
      return;

    if (oldState.member?.id === cfg.servers.cr.musicbot_id && newState.channelID === null) {
      const image =
        Math.random() > 0.1
          ? "https://cdn.discordapp.com/attachments/795054934470557728/814976435021283429/5kuavjmbnhz11.png"
          : "https://cdn.discordapp.com/attachments/396863166325456896/828790065999904778/iu.png";

      vedbot.guilds.cr.channels.get("commands")?.send({ files: [image] });
    }
  },
} as BotModule;
