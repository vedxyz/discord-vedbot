/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable global-require */
/* eslint-disable import/no-dynamic-require */
import fs from "fs";
import Discord, { Client, CommandInteraction, MessageEmbed, Snowflake, TextChannel } from "discord.js";
import path from "path";
import { BotCommand, BotConfig, BotModule } from "./interface";

const configPath = path.join(__dirname, "..", "config.json");

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
      .map(
        (file) =>
          [file, require(path.join(__dirname, collection.rootdir, file)).default] as [string, BotCommand | BotModule]
      )
      .forEach(([filename, fileImport]) => {
        collection.set(filename.slice(0, -3), fileImport);
        console.log(`Loaded BotFile: ${filename}`);
      });
  });
};

const reloadBotFile = (collection: BotFileCollection<BotCommand | BotModule>, filename: string): void => {
  const filePath = path.join(__dirname, collection.rootdir, `${filename}.js`);

  delete require.cache[require.resolve(filePath)];
  const reloadedFile: BotCommand | BotModule = require(filePath).default;
  collection.set(filename, reloadedFile);
  console.log(`Reloaded BotFile: ${filename}.js`);
};

const getAllBotFileNames = (...botFileCollection: BotFileCollection<BotCommand | BotModule>[]): string[] => {
  const filenames: string[] = [];
  botFileCollection.forEach(async (collection) => {
    filenames.push(
      ...(await fs.promises.readdir(path.join(__dirname, collection.rootdir))).filter((file) => file.endsWith(".js"))
    );
  });
  return filenames;
};

const fetchConfigChannels = async (
  client: Client,
  ...serverTuples: [{ [key: string]: Snowflake }, Map<string, TextChannel>][]
): Promise<void> => {
  serverTuples.forEach(([cfgChannels, channelMap]) => {
    Object.entries(cfgChannels).forEach(async ([channelName, channelID]) => {
      channelMap.set(channelName, (await client.channels.fetch(channelID)) as TextChannel);
    });
  });
};

const loadConfig = (): BotConfig => JSON.parse(fs.readFileSync(configPath, "utf8"));

const saveConfig = async (config: BotConfig): Promise<void> => {
  await fs.promises.writeFile(configPath, JSON.stringify(config, null, 2));
  console.log("Saved config.json");
};

const canExecuteModule = (
  cfg: BotConfig,
  module: BotModule | undefined,
  eventGuildId: Snowflake | undefined
): boolean =>
  !!eventGuildId &&
  !!module?.state &&
  module.guilds.some((srv) => cfg.servers[srv as keyof typeof cfg.servers].id === eventGuildId);

const getRuleEmbedBase = (interaction: CommandInteraction): MessageEmbed =>
  new MessageEmbed()
    .setTitle(`${interaction.guild?.name} Kurallar`)
    .setTimestamp()
    .setFooter(`Teşekkürler.`)
    .setColor("ORANGE")
    .setThumbnail(interaction.guild?.iconURL() || "");

export default {
  loadBotFiles,
  reloadBotFile,
  getAllBotFileNames,
  fetchConfigChannels,
  loadConfig,
  saveConfig,
  canExecuteModule,
  getRuleEmbedBase,
};
