import { Meal, MealDay } from "bilkent-scraper";
import dayjs, { Dayjs } from "dayjs";
import { APIApplicationCommandOptionChoice } from "discord-api-types/v10";
import { ApplicationCommandPermissionData, CommandInteraction, MessageEmbed, Snowflake } from "discord.js";
import { endDatabaseConnection, ids } from "../database/database";
import { cfg } from "../settings";
import { BotEvent } from "./interface";

const trTime = (): Dayjs => dayjs().add(3, "hour");
const getMealDateFormattedDay = (mealDay: MealDay): string => mealDay.date.format("dddd, DD/MM/YYYY");
const getMealDateFormatted = (mealDay: MealDay): string => mealDay.date.format("DD/MM/YYYY");
const getDayOfWeekIndex = (): number => trTime().isoWeekday() - 1;

const capitalizeWord = (str: string): string => str.charAt(0).toUpperCase() + str.slice(1);

const canExecuteEvent = (event: BotEvent, eventGuildId: Snowflake | undefined): boolean =>
  event.state &&
  (event.anyguild ||
    (eventGuildId !== undefined &&
      event.guilds.some(async (allowedServer) => (await ids.getServerId(allowedServer)) === eventGuildId)));

const getRuleEmbedBase = (interaction: CommandInteraction): MessageEmbed =>
  new MessageEmbed()
    .setTitle(`${interaction.guild?.name} Kurallar`)
    .setTimestamp()
    .setFooter({ text: "Teşekkürler" })
    .setColor("ORANGE")
    .setThumbnail(interaction.guild?.iconURL() || "");

const getMealEmbedBase = (forMeal: "lunch" | "dinner", mealDay: MealDay): MessageEmbed =>
  new MessageEmbed()
    .setTitle(`Bilkent University Cafeteria Meals`)
    .setThumbnail("https://w3.bilkent.edu.tr/logo/ing-amblem.png")
    .setFooter({ text: "Bon appétit" })
    .setTimestamp()
    .setColor("AQUA")
    .setDescription(`${capitalizeWord(forMeal)} menu on ${getMealDateFormattedDay(mealDay)}`);

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

const objectifyChoiceArray = (choices: string[]): APIApplicationCommandOptionChoice<string>[] =>
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
  trTime,
  getMealDateFormattedDay,
  getMealDateFormatted,
  getDayOfWeekIndex,
  capitalizeWord,
  canExecuteEvent,
  getRuleEmbedBase,
  getMealEmbedBase,
  populateMealEmbed,
  objectifyChoiceArray,
  permissions,
  exitBot,
};
