import { BotModule } from "../vedbot";

export default {
  name: "harunabi",
  description: "",
  state: true,
  guilds: ["dh"],
  onMessage(message) {
    const harunabiFlag = message.content.match(/\bharun abi\S*/i);

    if (harunabiFlag !== null && harunabiFlag.length > 0)
      message.reply(
        `Aaa demek ki harun abi muhabbeti o yani kadın olduğuma inanmıyorlar demek kiii mxlwkdmxsşşsöcmsşqödmdlaşs gerçekten mi yaa xkşamdödşsşdmdöd oha söylemişti bi arkadaş burda değişik insanlar var diye demek ki ondanmış dlspdmcmsşdlmfdl cidden çok iyi yaaa 😂`
      );
  },
} as BotModule;
