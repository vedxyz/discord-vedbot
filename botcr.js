// https://discord.com/api/oauth2/authorize?client_id=747882956520947814&permissions=8&scope=bot

const fs = require("fs"); 
const Discord = require('discord.js');
const cfg = require('./config.json');
const client = new Discord.Client();

let crServer = "237606889863512074"; 
let crCommandChannel = "715297879132078131";

client.once('ready', () => {
  
  console.log('>> Ready!');
  
  // Grab required channels
  let clientChannelCache = client.channels.cache;
  crCommandChannel = clientChannelCache.get(crCommandChannel);
  
});

client.on('voiceStateUpdate', (oldState, newState) => {
  
  if (oldState.guild.id === crServer && oldState.member.id === "234395307759108106" && newState.channelID === null) {
    
    crCommandChannel.send({ files: ["https://cdn.discordapp.com/attachments/795054934470557728/814976435021283429/5kuavjmbnhz11.png"] });
    
    console.log("update voice");
  }
  
});



client.login(cfg.token);
