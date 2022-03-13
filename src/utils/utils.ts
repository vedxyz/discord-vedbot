/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable global-require */
/* eslint-disable import/no-dynamic-require */
import Discord, {
  ApplicationCommandPermissionData,
  Client,
  CommandInteraction,
  MessageEmbed,
  Snowflake,
  TextChannel,
} from "discord.js";
import { BotCommand, BotConfig, BotModule, } from "./interface";

export class BotFileCollection<T extends BotCommand | BotModule> extends Discord.Collection<string, T> {
  rootdir: string;

  constructor(rootdir: string) {
    super();
    this.rootdir = rootdir;
  }
}

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

const canExecuteModule = (
  cfg: BotConfig,
  module: BotModule | undefined,
  eventGuildId: Snowflake | undefined
): boolean => !!eventGuildId && !!module?.state && module.guilds.some((srv) => cfg.servers[srv].id === eventGuildId);

const getRuleEmbedBase = (interaction: CommandInteraction): MessageEmbed =>
  new MessageEmbed()
    .setTitle(`${interaction.guild?.name} Kurallar`)
    .setTimestamp()
    .setFooter({ text: "Teşekkürler" })
    .setColor("ORANGE")
    .setThumbnail(interaction.guild?.iconURL() || "");

const permissions = {
  getOwner: (cfg: BotConfig): ApplicationCommandPermissionData => ({
    id: cfg.ownerId,
    type: "USER",
    permission: true,
  }),
  getAdmins: (cfg: BotConfig): ApplicationCommandPermissionData[] => [
    {
      id: cfg.servers.cs.roles.admin,
      type: "ROLE",
      permission: true,
    },
    {
      id: cfg.servers.dh.roles.admin,
      type: "ROLE",
      permission: true,
    },
  ],
};

export default {
  fetchConfigChannels,
  canExecuteModule,
  getRuleEmbedBase,
  permissions,
};
