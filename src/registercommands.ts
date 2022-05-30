/* eslint-disable no-continue */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */

import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v10";
import { endDatabaseConnection, ids } from "./database/database";
import { cfg, vedbot } from "./settings";
import logger from "./utils/logger";

const rest = new REST().setToken(cfg.token);

(async () => {
  let errorEncounter = false;

  logger.info("Registering slash commands...");
  const servers = await ids.getAllServers();

  for (const { id: serverId, nickname } of servers) {
    logger.info(`Registering commands for "${nickname}":`);

    const guildCommands = vedbot.commands.filter((command) => command.guilds.includes(nickname));
    logger.info(`\t${guildCommands.size} command(s) found.`);

    try {
      await rest.put(Routes.applicationGuildCommands(cfg.clientId, serverId), {
        body: guildCommands.map((cmd) => cmd.data.toJSON()),
      });
    } catch (err) {
      logger.error("\tFailed to register!", err);
      errorEncounter = true;
      continue;
    }

    logger.success(`\tRegistration for "${nickname}" complete.`);
  }

  if (errorEncounter) logger.error("Finished with errors!");
  else logger.success("Registered slash commands successfully!");

  await endDatabaseConnection();
})().catch(logger.error);
