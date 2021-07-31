/* eslint-disable global-require */
/* eslint-disable import/no-dynamic-require */
import fs from "fs";
import Discord, { Client, Snowflake, TextChannel } from "discord.js";
import path from "path";
import { BotCommand, BotConfig, BotModule } from "./interface";

export class BotFileCollection<T extends BotCommand | BotModule> extends Discord.Collection<string, T> {
  rootdir: string;

  constructor(rootdir: string) {
    super();
    this.rootdir = rootdir;
  }
}

const loadBotFiles = (...botFileCollection: BotFileCollection<BotCommand | BotModule>[]): void => {
  console.log("Loading BotFiles...");
  botFileCollection.forEach((collection) => {
    fs.readdirSync(path.join(__dirname, collection.rootdir))
      .filter((file) => file.endsWith(".js"))
      .map((file) => require(path.join(__dirname, collection.rootdir, file)))
      .forEach((fileImport: BotCommand | BotModule) => {
        collection.set(fileImport.name, fileImport);
        console.log(`Loaded BotFile: ${fileImport.name}`);
      });
  });
};

const reloadBotFile = (collection: BotFileCollection<BotCommand | BotModule>, filename: string): void => {
  const filePath = path.join(__dirname, collection.rootdir, `${filename}.js`);

  delete require.cache[require.resolve(filePath)];
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const reloadedFile: BotCommand | BotModule = require(filePath);
  collection.set(reloadedFile.name, reloadedFile);
  console.log(`Reloaded BotFile: ${reloadedFile.name}`);
};

const fetchConfigChannels = (
  client: Client,
  ...serverTuples: [{ [key: string]: Snowflake }, Map<string, TextChannel>][]
): void => {
  serverTuples.forEach(([cfgChannels, channelMap]) => {
    Object.entries(cfgChannels).forEach(async ([channelName, channelID]) => {
      channelMap.set(channelName, (await client.channels.fetch(channelID)) as TextChannel);
    });
  });
};

const loadConfig = (): BotConfig => JSON.parse(fs.readFileSync(path.join(__dirname, "config.json"), "utf8"));

const saveConfig = async (config: BotConfig): Promise<void> => {
  await fs.promises.writeFile(path.join(__dirname, "config.json"), JSON.stringify(config, null, 2));
  console.log("Saved config.json");
};

export default {
  loadBotFiles,
  reloadBotFile,
  fetchConfigChannels,
  loadConfig,
  saveConfig,
};
