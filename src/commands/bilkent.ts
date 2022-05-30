import { Collection, MessageEmbed } from "discord.js";
import { getMealList } from "bilkent-scraper";
import { SlashCommandBuilder, SlashCommandStringOption } from "@discordjs/builders";
import { SupportedDepartment, BotCommand, Offerings } from "../utils/interface";
import utils from "../utils/utils";
import { mealSubscriptions, MealSubscriptionType } from "../database/database";

const { getDayOfWeekIndex, getMealDateFormatted, getMealDateFormattedDay } = utils;
const offerings: Offerings = new Collection(); // This is a temporary mock

const forMealOption = new SlashCommandStringOption()
  .setName("for")
  .setDescription("Pick a meal")
  .setChoices(...utils.objectifyChoiceArray(["lunch", "dinner"]));
const langMealOption = new SlashCommandStringOption()
  .setName("language")
  .setDescription("Language for the dish names")
  .setChoices(...utils.objectifyChoiceArray(["tr", "eng"]));

const daysOfWeek = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];

const subTypeMap = {
  lunch: MealSubscriptionType.Lunch,
  dinner: MealSubscriptionType.Dinner,
  "lunch+dinner": MealSubscriptionType.Both,
} as { [key: string]: MealSubscriptionType };

const command: BotCommand = {
  data: new SlashCommandBuilder()
    .setName("bilkent")
    .setDescription("Utilities for Bilkent University")
    .setDefaultPermission(true)
    .addSubcommand((getcourse) =>
      getcourse
        .setName("getcourse")
        .setDescription("Get information for a specific course")
        .addStringOption((department) =>
          department
            .setName("department")
            .setDescription("Department of the course; such as CS, ENG, HIST, etc.")
            .setRequired(true)
            .setChoices(
              ...utils.objectifyChoiceArray([
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
              ])
            )
        )
        .addStringOption((course) =>
          course
            .setName("course")
            .setDescription("Number code of the course; such as 101, 223, 200, etc.")
            .setRequired(true)
        )
        .addIntegerOption((section) =>
          section.setName("section").setDescription("Section of the course; such as 1, 2, 3, etc.")
        )
    )
    .addSubcommandGroup((meal) =>
      meal
        .setName("meal")
        .setDescription("Get information for the current week's cafeteria menu")
        .addSubcommand((today) =>
          today
            .setName("today")
            .setDescription("Show today's meals")
            .addStringOption(forMealOption)
            .addStringOption(langMealOption)
        )
        .addSubcommand((tomorrow) =>
          tomorrow
            .setName("tomorrow")
            .setDescription("Show tomorrow's meals")
            .addStringOption(forMealOption)
            .addStringOption(langMealOption)
        )
        .addSubcommand((on) =>
          on
            .setName("on")
            .setDescription("Show meals from a specific day of the week")
            .addStringOption((day) =>
              day
                .setName("day")
                .setDescription("Pick a day")
                .setRequired(true)
                .setChoices(...utils.objectifyChoiceArray(daysOfWeek))
            )
            .addStringOption(forMealOption)
            .addStringOption(langMealOption)
        )
        .addSubcommand((all) =>
          all.setName("all").setDescription("List meals for the entire week").addStringOption(langMealOption)
        )
        .addSubcommand((subscribe) =>
          subscribe
            .setName("subscribe")
            .setDescription("Get daily private messages for meals")
            .addStringOption((type) =>
              type
                .setName("type")
                .setDescription("Which meals will this subscription cover? Maybe both at once?")
                .setRequired(true)
                .setChoices(...utils.objectifyChoiceArray(["lunch", "dinner", "lunch+dinner"]))
            )
            .addIntegerOption((hour) =>
              hour
                .setName("hour")
                .setDescription("The hour at which to send you a message (HH:00)")
                .setRequired(true)
                .setChoices(...[...Array(24).keys()].map((hr) => ({ name: `${hr}`, value: hr })))
            )
            .addBooleanOption((weekend) =>
              weekend.setName("weekend").setDescription("Whether to send messages during the weekend").setRequired(true)
            )
        )
        .addSubcommand((unsubscribe) =>
          unsubscribe
            .setName("unsubscribe")
            .setDescription("Remove your subscription for a certain type")
            .addStringOption((type) =>
              type
                .setName("type")
                .setDescription("The type of subscription to unsubscribe from")
                .setRequired(true)
                .setChoices(...utils.objectifyChoiceArray(["lunch", "dinner", "lunch+dinner"]))
            )
        )
    ),
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
        await interaction.client.users.send(interaction.user.id, {
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
