import { getMealList, MealList } from "bilkent-scraper";
import { MessageEmbed } from "discord.js";
import schedule from "node-schedule";
import { mealSubscriptions, MealSubscriptionType } from "../database/database";
import client from "../vedbot";
import utils from "./utils";

const getMealEmbed = (forMeal: "lunch" | "dinner", meals: MealList) => {
  const embed = new MessageEmbed()
    .setTitle(`Bilkent University Cafeteria Meals`)
    .setTimestamp()
    .setFooter({ text: "Bon appétit" })
    .setColor("AQUA")
    .setThumbnail("https://w3.bilkent.edu.tr/logo/ing-amblem.png")
    .setDescription(
      `${utils.capitalizeWord(forMeal)} menu on ${utils.getMealDateFormattedDay(meals.days[utils.getDayOfWeekIndex()])}`
    );

  utils.populateMealEmbed(embed, meals.days[utils.getDayOfWeekIndex()][forMeal]);
  return embed;
};

// The code within the schedule job blocks the event loop.
// See https://github.com/node-schedule/node-schedule/issues/634
// Do not use this code unless you work around this issue.
const scheduleMealSubscriptionJob = (): schedule.Job =>
  schedule.scheduleJob("@hourly", async (/* execDate */) => {
    const trTime = utils.trTime();
    const meals = await getMealList();
    const subs = await mealSubscriptions.getForHour(trTime.hour());

    const lunchEmbed = getMealEmbed("lunch", meals);
    const dinnerEmbed = getMealEmbed("dinner", meals);

    subs.forEach(async (sub) => {
      if (!sub.weekend && (trTime.isoWeekday() === 6 || trTime.isoWeekday() === 7)) return;

      const embeds: MessageEmbed[] = [];
      if (sub.type === MealSubscriptionType.Both || sub.type === MealSubscriptionType.Lunch) embeds.push(lunchEmbed);
      if (sub.type === MealSubscriptionType.Both || sub.type === MealSubscriptionType.Dinner) embeds.push(dinnerEmbed);

      await client.users.send(sub.userId, { embeds });
    });
  });
export default scheduleMealSubscriptionJob;
