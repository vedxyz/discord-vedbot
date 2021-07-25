const cfg = require("../config.json");

module.exports = {
  name: "harunabi",
  description: "",
  state: true,
  guilds: ["dh"],
  onMsg(message, optional) {
    
    if (!this.guilds.some(srv => cfg[srv].id === message.guild.id) || !this.state) return;
    
    // Harun abi module
    let regExp_harunabi = /\bharun abi\S*/i;
    let harunabiFlag = message.content.match(regExp_harunabi);
    
    if (harunabiFlag !== null && harunabiFlag.length > 0) {
      
      return (`Aaa demek ki harun abi muhabbeti o yani kadın olduğuma inanmıyorlar demek kiii mxlwkdmxsşşsöcmsşqödmdlaşs gerçekten mi yaa xkşamdödşsşdmdöd oha söylemişti bi arkadaş burda değişik insanlar var diye demek ki ondanmış dlspdmcmsşdlmfdl cidden çok iyi yaaa 😂`);
      
    }
    
  }
};
