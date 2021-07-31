import { BotModule, cfg } from "../vedbot";

/* eslint-disable consistent-return */

export default {
  name: "harunabi",
  description: "",
  state: true,
  guilds: ["dh"],
  onMsg(message) {
    if (
      !this.guilds.some((srv) => cfg.servers[srv as keyof typeof cfg.servers].id === message.guild?.id) ||
      !this.state
    )
      return;

    // Harun abi module
    const harunabiFlag = message.content.match(/\bharun abi\S*/i);

    if (harunabiFlag !== null && harunabiFlag.length > 0) {
      return `Aaa demek ki harun abi muhabbeti o yani kadın olduğuma inanmıyorlar demek kiii mxlwkdmxsşşsöcmsşqödmdlaşs gerçekten mi yaa xkşamdödşsşdmdöd oha söylemişti bi arkadaş burda değişik insanlar var diye demek ki ondanmış dlspdmcmsşdlmfdl cidden çok iyi yaaa 😂`;
    }
  },
} as BotModule;
