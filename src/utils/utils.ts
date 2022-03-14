/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable global-require */
/* eslint-disable import/no-dynamic-require */
import {
  // Client,
  // TextChannel,
  ApplicationCommandPermissionData,
  CommandInteraction,
  MessageEmbed,
  Snowflake,
} from "discord.js";
import { endDatabaseConnection, ids } from "../database/database";
import { cfg } from "../settings";
import { BotModule } from "./interface";

// const fetchConfigChannels = async (
//   client: Client,
//   ...serverTuples: [{ [key: string]: Snowflake }, Map<string, TextChannel>][]
// ): Promise<void> => {
//   serverTuples.forEach(([cfgChannels, channelMap]) => {
//     Object.entries(cfgChannels).forEach(async ([channelName, channelID]) => {
//       channelMap.set(channelName, (await client.channels.fetch(channelID)) as TextChannel);
//     });
//   });
// };

const canExecuteModule = (module: BotModule, eventGuildId: Snowflake | undefined): boolean =>
  module.state &&
  (module.anyguild ||
    (eventGuildId !== undefined &&
      module.guilds.some(async (allowedServer) => (await ids.getServerId(allowedServer)) === eventGuildId)));

const getRuleEmbedBase = (interaction: CommandInteraction): MessageEmbed =>
  new MessageEmbed()
    .setTitle(`${interaction.guild?.name} Kurallar`)
    .setTimestamp()
    .setFooter({ text: "Teşekkürler" })
    .setColor("ORANGE")
    .setThumbnail(interaction.guild?.iconURL() || "");

const permissions = {
  getOwner: (): ApplicationCommandPermissionData => ({
    id: cfg.ownerId,
    type: "USER",
    permission: true,
  }),
  getAdmins: async (): Promise<ApplicationCommandPermissionData[]> =>
    (await ids.getAllRoleIdsOfType("admin")).map((roleId) => ({ id: roleId, type: "ROLE", permission: true })),
};

const exitBot = async (): Promise<void> => {
  console.log("Exitting gracefully...");
  await endDatabaseConnection();
  process.exit();
};

export default {
  // fetchConfigChannels,
  canExecuteModule,
  getRuleEmbedBase,
  permissions,
  exitBot,
};
