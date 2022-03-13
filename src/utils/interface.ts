import {
  ApplicationCommandData,
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

export interface BotConfig {
  ownerId: Snowflake;
  token: string;
  servers: {
    dh: {
      mizyaz: {
        id: string;
        regexp: string;
      };
    };
    [key: string]: {
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
