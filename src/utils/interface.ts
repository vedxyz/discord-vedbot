import { SlashCommandBuilder } from "@discordjs/builders";
import {
  ApplicationCommandPermissionData,
  Collection,
  CommandInteraction,
  GuildMember,
  Message,
  MessageReaction,
  Snowflake,
  User,
  VoiceState,
} from "discord.js";

interface BotConfigServer {
  id: Snowflake;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  // [key: string]: any;
}

export interface BotConfig {
  ownerId: Snowflake;
  token: string;
  clientId: Snowflake;
  servers: {
    dh: BotConfigServer & {
      mizyaz: {
        id: Snowflake;
        regexp: string;
      };
    };
    [key: string]: BotConfigServer;
  };
}

export interface BotModule {
  name: string;
  description: string;
  state: boolean;
  /**
   * If `true`, run in any guild, regardless of `guilds` array.
   */
  anyguild?: boolean;
  /**
   * Actions will only be executed on guilds listed here by *server nickname*
   */
  guilds: string[];
  onMessage?: (message: Message<true>) => unknown;
  onVoiceUpdate?: (oldState: VoiceState, newState: VoiceState) => unknown;
  onMemberJoin?: (member: GuildMember) => unknown;
  onMemberLeave?: (member: GuildMember) => unknown;
  onReactionAdd?: (reaction: MessageReaction, user: User) => unknown;
  onReactionRemove?: (reaction: MessageReaction, user: User) => unknown;
}

export interface BotCommand {
  /**
   * Used to set the interaction API requests, mostly.
   */
  data: Pick<SlashCommandBuilder, "toJSON">;
  permissions?: ApplicationCommandPermissionData[];
  /**
   * If `true`, run in any guild, regardless of `guilds` array.
   */
  anyguild?: boolean;
  /**
   * Actions will only be executed on guilds listed here by *server nickname*
   */
  guilds: string[];
  execute: (interaction: CommandInteraction<"cached" | "raw">) => unknown;
}

export interface Course {
  courseCode: string;
  courseName: string;
  sections: {
    section: string;
    instructor: string;
    quota: {
      indifferent: boolean;
      total?: string;
      mandatory?: string;
      elective?: string;
    };
    schedule: {
      day: string;
      time: {
        start: string;
        end: string;
      };
      place: string;
    }[];
  }[];
}

export type SupportedDepartment =
  | "CHEM"
  | "CS"
  | "ECON"
  | "EEE"
  | "ENG"
  | "HIST"
  | "HUM"
  | "IE"
  | "LAW"
  | "MATH"
  | "MBG"
  | "PHYS"
  | "PSYC"
  | "TURK";

export type Offerings = Collection<SupportedDepartment, Course[]>;
