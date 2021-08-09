import {
  ApplicationCommandData,
  ApplicationCommandPermissionData,
  CommandInteraction,
  GuildMember,
  Message,
  MessageReaction,
  Snowflake,
  User,
  VoiceState,
} from "discord.js";

export interface BotConfig {
  ownerId: Snowflake;
  token: string;
  servers: {
    [key: string]: {
      id: Snowflake;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      [key: string]: any;
    };
  };
}

export interface BotModule {
  name: string;
  description: string;
  state: boolean;
  guilds: string[];
  onMessage?: (message: Message) => void;
  onVoiceUpdate?: (oldState: VoiceState, newState: VoiceState) => unknown;
  onMemberJoin?: (member: GuildMember) => unknown;
  onMemberLeave?: (member: GuildMember) => unknown;
  onReactionAdd?: (reaction: MessageReaction, user: User) => unknown;
  onReactionRemove?: (reaction: MessageReaction, user: User) => unknown;
}

export interface BotCommand {
  data: ApplicationCommandData;
  permissions?: ApplicationCommandPermissionData[];
  guilds: string[];
  execute: (interaction: CommandInteraction) => unknown;
}
