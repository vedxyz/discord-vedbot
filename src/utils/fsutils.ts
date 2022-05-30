/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable global-require */
/* eslint-disable import/no-dynamic-require */
import fs from "fs";
import Discord from "discord.js";
import path from "path";
import chalk from "chalk";
import { BotCommand, BotConfig, BotEvent, Offerings, SupportedDepartment } from "./interface";
import { srcrootdir, projrootdir } from "../rootdirname";
import BotFileCollection from "./botfilecollection";
import logger from "./logger";

const botfiles = {
  loadAll: (...botFileCollections: BotFileCollection<BotCommand | BotEvent>[]): void => {
    logger.info("Loading BotFiles...");
    botFileCollections.forEach((collection) => {
      fs.readdirSync(path.join(srcrootdir, collection.rootdir))
        .filter((file) => file.endsWith(".js"))
        .map(
          (file) =>
            [file, require(path.join(srcrootdir, collection.rootdir, file)).default] as [string, BotCommand | BotEvent]
        )
        .forEach(([filename, fileImport]) => {
          collection.set(filename.slice(0, -3), fileImport);
          logger.info(`Loaded BotFile: ${chalk.green(filename)}`);
        });
    });
  },
  reload: (collection: BotFileCollection<BotCommand | BotEvent>, filename: string): void => {
    const filePath = path.join(srcrootdir, collection.rootdir, `${filename}.js`);

    delete require.cache[require.resolve(filePath)];
    const reloadedFile: BotCommand | BotEvent = require(filePath).default;
    collection.set(filename, reloadedFile);
    logger.success(`Reloaded BotFile: ${filename}.js`);
  },
  getAllFileNamesSync: (...botFileCollections: BotFileCollection<BotCommand | BotEvent>[]): string[] =>
    botFileCollections
      .map((collection) => fs.readdirSync(path.join(srcrootdir, collection.rootdir)))
      .reduce((acc, curr) => acc.concat(curr), [])
      .filter((filename) => filename.endsWith(".js")),
  getAllFileNames: async (...botFileCollections: BotFileCollection<BotCommand | BotEvent>[]): Promise<string[]> =>
    (
      await Promise.all(
        botFileCollections.map((collection) => fs.promises.readdir(path.join(srcrootdir, collection.rootdir)))
      )
    )
      .reduce((acc, curr) => acc.concat(curr), [])
      .filter((filename) => filename.endsWith(".js")),
};

const configPath = path.join(projrootdir, "config.json");
const config = {
  load: (): BotConfig => JSON.parse(fs.readFileSync(configPath, "utf8")),
  save: async (cfg: BotConfig): Promise<void> => {
    await fs.promises.writeFile(configPath, JSON.stringify(cfg, null, 2));
    logger.success("Saved config.json");
  },
};

const loadOfferings = (): Offerings => {
  const offerings: Offerings = new Discord.Collection();
  const offeringsFolder = path.join(projrootdir, "offerings_data");

  fs.readdirSync(offeringsFolder).forEach((department) => {
    offerings.set(
      department.split("_")[0] as SupportedDepartment,
      JSON.parse(fs.readFileSync(path.join(offeringsFolder, department), "utf8"))
    );
  });

  return offerings;
};

export default {
  botfiles,
  config,
  loadOfferings,
};
