import { ApplicationCommandChoicesData, Collection, MessageEmbed } from "discord.js";
import {
  getDayOfWeekIndex,
  getMealDateFormatted,
  getMealDateFormattedDay,
  getMealList,
  MealList,
} from "../mealscraper/mealscraper";
import { SupportedDepartment, BotCommand, Offerings } from "../utils/interface";
import utils from "../utils/utils";

const offerings: Offerings = new Collection(); // This is a temporary mock

const forMealChoiceData: ApplicationCommandChoicesData = {
  name: "for",
  description: "Pick a meal",
  type: "STRING",
  required: false,
  choices: utils.objectifyChoiceArray(["lunch", "dinner"]),
};
const langMealChoiceData: ApplicationCommandChoicesData = {
  name: "language",
  description: "Language for the food names",
  type: "STRING",
  required: false,
  choices: utils.objectifyChoiceArray(["tr", "eng"]),
};
const daysOfWeek = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];

const command: BotCommand = {
  data: {
    name: "bilkent",
    description: "Utilities for Bilkent University.",
    defaultPermission: true,
    options: [
      {
        name: "getcourse",
        description: "Get information for a specific course",
        type: "SUB_COMMAND",
        options: [
          {
            name: "department",
            description: "Department of the course; such as CS, ENG, HIST, etc.",
            type: "STRING",
            required: true,
            choices: utils.objectifyChoiceArray([
              "CHEM",
              "CS",
              "ECON",
              "EEE",
              "ENG",
              "HIST",
              "HUM",
              "IE",
              "LAW",
              "MATH",
              "MBG",
              "PHYS",
              "PSYC",
              "TURK",
            ]),
          },
          {
            name: "course",
            description: "Number code of the course; such as 101, 223, 200, etc.",
            type: "STRING",
            required: true,
          },
          {
            name: "section",
            description: "Section of the course; such as 1, 2, 3, etc.",
            type: "INTEGER",
            required: false,
          },
        ],
      },
      {
        name: "meal",
        description: "Get information for the current week's cafeteria menu",
        type: "SUB_COMMAND_GROUP",
        options: [
          {
            name: "today",
            description: "Show today's meals",
            type: "SUB_COMMAND",
            options: [forMealChoiceData, langMealChoiceData],
          },
          {
            name: "tomorrow",
            description: "Show tomorrow's meals",
            type: "SUB_COMMAND",
            options: [forMealChoiceData, langMealChoiceData],
          },
          {
            name: "on",
            description: "Show meals from a specific day of the week",
            type: "SUB_COMMAND",
            options: [
              {
                name: "day",
                description: "Pick a day",
                type: "STRING",
                required: true,
                choices: utils.objectifyChoiceArray(daysOfWeek),
              },
              forMealChoiceData,
              langMealChoiceData,
            ],
          },
          {
            name: "all",
            description: "List meals for the entire week",
            type: "SUB_COMMAND",
            options: [langMealChoiceData],
          },
        ],
      },
    ],
  },
  guilds: ["dh", "cs"],
  async execute(interaction) {
    const subcommandGroup = interaction.options.getSubcommandGroup();
    const subcommand = interaction.options.getSubcommand();

    if (subcommandGroup !== "meal" && subcommand === "getcourse") {
      const query = {
        department: interaction.options.getString("department", true) as SupportedDepartment,
        courseCode: interaction.options.getString("course", true),
        section: interaction.options.getInteger("section", false),
      };

      const course = offerings.get(query.department)?.find((el) => el.courseCode.split(" ")[1] === query.courseCode);

      if (course === undefined) {
        interaction.reply({ content: "No such course was found.", ephemeral: true });
        return;
      }

      if (query.section === null) {
        interaction.reply({
          content: `**${course?.courseCode}** (${course.courseName}) has ${
            course?.sections.length
          } sections with instructors like ${course.sections
            .slice(0, 5)
            .map((section) => section.instructor)
            .join(", ")}.`,
        });
      } else {
        const section = course.sections.find((el) => parseInt(el.section, 10) === query.section);

        if (section === undefined) {
          interaction.reply({ content: "No such section was found.", ephemeral: true });
          return;
        }

        interaction.reply({
          content: `**${course?.courseCode}-${section.section}** (${course.courseName}) by ${section.instructor} has ${
            section.quota.indifferent
              ? `${section.quota.total} total`
              : `${section.quota.mandatory} mandatory and ${section.quota.elective} elective`
          } quota. The lectures/labs are at ${section.schedule
            .map((schedule) => `${schedule.day} ${schedule.time.start}-${schedule.time.end} @ ${schedule.place}`)
            .join(", ")}.`,
        });
      }
    } else if (subcommandGroup === "meal") {
      const language = (interaction.options.getString("language", false) as "tr" | "eng") || "tr";
      const forMeal = (interaction.options.getString("for", false) as "dinner" | "lunch") || "lunch";
      const meals = await getMealList();
      let dayOfWeekIdx = getDayOfWeekIndex();

      if (subcommand === "tomorrow") {
        if (dayOfWeekIdx === 6) {
          interaction.reply("I don't think I know next week's menu yet?");
          return;
        }
        dayOfWeekIdx++;
      } else if (subcommand === "on") {
        dayOfWeekIdx = daysOfWeek.indexOf(interaction.options.getString("day", true));
      }

      const mealEmbed = new MessageEmbed()
        .setTitle(`Bilkent University Cafeteria Meals`)
        .setTimestamp()
        .setFooter({ text: "Bon appétit" })
        .setColor("AQUA")
        .setThumbnail("https://w3.bilkent.edu.tr/logo/ing-amblem.png")
        .setDescription(
          `${utils.capitalizeWord(forMeal)} menu on ${getMealDateFormattedDay(meals.days[dayOfWeekIdx])}`
        );

      if (subcommand === "today" || subcommand === "tomorrow" || subcommand === "on") {
        utils.populateMealEmbed(mealEmbed, meals.days[dayOfWeekIdx][forMeal], language);
      } else if (subcommand === "all") {
        mealEmbed.setDescription(`The full menu for the week of ${getMealDateFormatted(meals.days[0])}`);

        meals.days.forEach((day) => {
          ["lunch", "dinner"].forEach((time) => {
            const mealObj = day[time as "lunch" | "dinner"];
            mealEmbed.addField(
              `${getMealDateFormattedDay(day)} - ${utils.capitalizeWord(time)}`,
              `${mealObj.plates.map((plate) => `- ${plate[language]}`).join("\n")}\n- ${
                mealObj.vegetarianPlate[language]
              } - *vegetarian plate*\n\nCalories: ${mealObj.calories.standard} / *${mealObj.calories.vegetarian}*`
            );
          });
        });
      }

      interaction.reply({ embeds: [mealEmbed] });
    }
  },
};

export default command;
