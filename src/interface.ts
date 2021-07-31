import { GuildMember, Message, MessageReaction, PermissionString, Snowflake, User, VoiceState } from "discord.js";

export interface BotConfig {
  prefix: string;
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
  rootdir?: string;
  name: string;
  description: string;
  state: boolean;
  guilds: string[];
  onMsg?: (message: Message) => unknown;
  onVoiceUpdate?: (oldState: VoiceState, newState: VoiceState) => unknown;
  onMemberJoin?: (member: GuildMember) => unknown;
  onMemberLeave?: (member: GuildMember) => unknown;
  onReactionAdd?: (reaction: MessageReaction, user: User) => unknown;
  onReactionRemove?: (reaction: MessageReaction, user: User) => unknown;
}

export interface BotCommand {
  rootdir?: string;
  name: string;
  aliases: string[];
  description: string;
  args: boolean;
  usage: string;
  guilds: string[];
  permissions: PermissionString[];
  allowedUser?: string[];
  execute: (message: Message, args: string[]) => unknown;
}
