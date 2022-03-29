import { ApplicationCommandChoicesData, Collection, MessageEmbed } from "discord.js";
import { getMealList } from "bilkent-scraper";
import { SupportedDepartment, BotCommand, Offerings } from "../utils/interface";
import utils from "../utils/utils";
import { mealSubscriptions, MealSubscriptionType } from "../database/database";
import client from "../vedbot";

const { getDayOfWeekIndex, getMealDateFormatted, getMealDateFormattedDay } = utils;
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

const subTypeMap = {
  lunch: MealSubscriptionType.Lunch,
  dinner: MealSubscriptionType.Dinner,
  "lunch+dinner": MealSubscriptionType.Both,
} as { [key: string]: MealSubscriptionType };

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
          {
            name: "subscribe",
            description: "Get daily private messages for meals",
            type: "SUB_COMMAND",
            options: [
              {
                name: "type",
                description: "Which meals will this subscription cover? Maybe both at once?",
                type: "STRING",
                required: true,
                choices: utils.objectifyChoiceArray(["lunch", "dinner", "lunch+dinner"]),
              },
              {
                name: "hour",
                description: "The hour at which to send you a message (HH:00)",
                type: "INTEGER",
                required: true,
                choices: [...Array(24).keys()].map((hour) => ({ name: `${hour}`, value: hour })),
              },
              {
                name: "weekend",
                description: "Whether to send messages during the weekend",
                type: "BOOLEAN",
                required: true,
              },
            ],
          },
          {
            name: "unsubscribe",
            description: "Remove your subscription for a certain type",
            type: "SUB_COMMAND",
            options: [
              {
                name: "type",
                description: "The type of subscription to unsubscribe from",
                type: "STRING",
                required: true,
                choices: utils.objectifyChoiceArray(["lunch", "dinner", "lunch+dinner"]),
              },
            ],
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
        await interaction.reply({ content: "No such course was found.", ephemeral: true });
        return;
      }

      if (query.section === null) {
        await interaction.reply({
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
          await interaction.reply({ content: "No such section was found.", ephemeral: true });
          return;
        }

        await interaction.reply({
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
      if (subcommand === "subscribe") {
        const subscriptionValue = interaction.options.getString("type", true);
        const subscriptionType = subTypeMap[subscriptionValue];
        const hour = interaction.options.getInteger("hour", true);
        const weekend = interaction.options.getBoolean("weekend", true);

        await mealSubscriptions.set(interaction.user.id, subscriptionType, hour, weekend);
        await interaction.reply({
          embeds: [
            new MessageEmbed()
              .setColor("GREEN")
              .setTitle("Subscribed to cafeteria meals!")
              .setDescription(
                `**${subscriptionValue}**, daily at *${hour}:00*, weekends *${weekend ? "included" : "excluded"}*.`
              ),
          ],
          ephemeral: true,
        });
        await client.users.send(interaction.user.id, {
          embeds: [
            new MessageEmbed()
              .setColor("DARK_GOLD")
              .setTitle("Disclaimer (Subscription)")
              .setDescription(
                `This cafeteria meal notification service is **provided without guarantees**.
The PDF of the cafeteria menu is parsed automatically by the bot, and it is known that parsing PDFs absolutely sucks.
Thus, if the parsing goes wrong, the bot may (rarely) get the menu wrong or fail to deliver entirely.
Furthermore, the bot may (rarely) experience downtimes for maintenance/development.

That being said, I do hope to keep this as a neat and somewhat reliable service to the best of my abilities and free time.
Hopefully, you will find it to be the case too.

Tip: You can have up to 3 subscriptions at a time, for "lunch", "dinner" and "lunch+dinner".
You could take advantage of this to have multiple notifications delivered per day.`
              ),
          ],
        });
        return;
      }

      if (subcommand === "unsubscribe") {
        const subscriptionValue = interaction.options.getString("type", true);
        const subscriptionType = subTypeMap[subscriptionValue];

        const exists = await mealSubscriptions.has(interaction.user.id, subscriptionType);
        if (!exists) {
          await interaction.reply({
            embeds: [
              new MessageEmbed()
                .setColor("RED")
                .setTitle("Couldn't Unsubscribe")
                .setDescription(`You did not have a subscription for **${subscriptionValue}**.`),
            ],
            ephemeral: true,
          });
          return;
        }

        await mealSubscriptions.delete(interaction.user.id, subscriptionType);
        await interaction.reply({
          embeds: [
            new MessageEmbed()
              .setColor("RED")
              .setTitle("Unsubscribed from cafeteria meals")
              .setDescription(
                `Your subscription for **${subscriptionValue}** was removed.\n*Note: if you had any other subscriptions, they are untouched.*`
              ),
          ],
          ephemeral: true,
        });
        return;
      }

      // Handle commands besides subscriptions

      const language = (interaction.options.getString("language", false) as "tr" | "eng") || "tr";
      const forMeal = (interaction.options.getString("for", false) as "dinner" | "lunch") || "lunch";
      const meals = await getMealList();
      let dayOfWeekIdx = getDayOfWeekIndex();

      if (subcommand === "tomorrow") {
        if (dayOfWeekIdx === 6) {
          await interaction.reply("I don't think I know next week's menu yet?");
          return;
        }
        dayOfWeekIdx++;
      } else if (subcommand === "on") {
        dayOfWeekIdx = daysOfWeek.indexOf(interaction.options.getString("day", true));
      }

      const mealEmbed = utils.getMealEmbedBase(forMeal, meals.days[dayOfWeekIdx]);

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

      await interaction.reply({ embeds: [mealEmbed] });
    }
  },
};

export default command;
