/* eslint-disable no-continue */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */

import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v10";
import { endDatabaseConnection, ids } from "./database/database";
import { cfg, vedbot } from "./settings";

const rest = new REST().setToken(cfg.token);

(async () => {
  let errorEncounter = false;

  console.log("Registering slash commands...");
  const servers = await ids.getAllServers();

  for (const { id: serverId, nickname } of servers) {
    console.log(`Registering commands for "${nickname}":`);

    const guildCommands = vedbot.commands.filter((command) => command.guilds.includes(nickname));
    console.log(`\t${guildCommands.size} command(s) found.`);

    try {
      await rest.put(Routes.applicationGuildCommands(cfg.clientId, serverId), {
        body: guildCommands.map((cmd) => cmd.data.toJSON()),
      });
    } catch (err) {
      console.error("\tFailed to register!", err);
      errorEncounter = true;
      continue;
    }

    console.log(`\tRegistration for "${nickname}" complete.`);
  }

  if (errorEncounter) console.error("Finished with errors!");
  else console.log("Registered slash commands successfully!");

  await endDatabaseConnection();
})().catch(console.error);
