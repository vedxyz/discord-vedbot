/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable global-require */
/* eslint-disable import/no-dynamic-require */
import { Meal, MealDay } from "bilkent-scraper";
import dayjs, { Dayjs } from "dayjs";
import {
  ApplicationCommandOptionChoice,
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

const trTime = (): Dayjs => dayjs().add(3, "hour");
const getMealDateFormattedDay = (mealDay: MealDay): string => mealDay.date.format("dddd, DD/MM/YYYY");
const getMealDateFormatted = (mealDay: MealDay): string => mealDay.date.format("DD/MM/YYYY");
const getDayOfWeekIndex = (): number => trTime().isoWeekday() - 1;

const capitalizeWord = (str: string): string => str.charAt(0).toUpperCase() + str.slice(1);

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

const populateMealEmbed = (embed: MessageEmbed, meal: Meal, language: keyof Meal["vegetarianPlate"] = "tr"): void => {
  embed.addFields([
    { name: "Standard Plates", value: meal.plates.map((plate) => `- ${plate[language]}`).join("\n") },
    { name: "Vegetarian Plate", value: `- ${meal.vegetarianPlate[language]}` },
    {
      name: "Standard Calories",
      value: meal.calories.standard,
      inline: true,
    },
    {
      name: "Vegetarian Calories",
      value: meal.calories.vegetarian,
      inline: true,
    },
  ]);
};

const objectifyChoiceArray = (choices: string[]): ApplicationCommandOptionChoice[] =>
  choices.map((choice) => ({ name: choice, value: choice }));

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
  console.log("Exiting gracefully...");
  await endDatabaseConnection();
  process.exit();
};

export default {
  // fetchConfigChannels,
  getMealDateFormattedDay,
  getMealDateFormatted,
  getDayOfWeekIndex,
  capitalizeWord,
  canExecuteModule,
  getRuleEmbedBase,
  populateMealEmbed,
  objectifyChoiceArray,
  permissions,
  exitBot,
};
