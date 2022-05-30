import { getMealList } from "bilkent-scraper";
import { Client, DiscordAPIError, MessageEmbed } from "discord.js";
import schedule from "node-schedule";
import path from "path";
import { mealSubscriptions, MealSubscriptionType } from "../database/database";
import { srcrootdir } from "../rootdirname";
import logger from "./logger";
import utils from "./utils";

class SubscriptionState {
  state = true;

  public toggle(): void {
    this.state = !this.state;
  }
}
export const subscriptionState = new SubscriptionState();

// The code within the schedule job may be blocking the event loop.
// See https://github.com/node-schedule/node-schedule/issues/634
// It might be OK to keep it for now, but at some point, I might need to make sure it's non-blocking.
export const scheduleMealSubscriptionJob = (): schedule.Job =>
  // runs on every HH:00:30
  schedule.scheduleJob("30 0 * * * *", async (/* execDate */) => {
    if (!subscriptionState.state) return;

    // eslint-disable-next-line import/no-cycle
    const client: Client<true> = (await import(path.join(srcrootdir, "vedbot"))).default;

    const trTime = utils.trTime();
    const mealDay = (await getMealList()).days[utils.getDayOfWeekIndex()];
    const subs = (await mealSubscriptions.getForHour(trTime.hour())).filter(
      (sub) => sub.weekend || (trTime.isoWeekday() !== 6 && trTime.isoWeekday() !== 7)
    );

    if (subs.length) logger.info(`Sending meal subscription messages to ${subs.length} people... (${trTime})`);

    const lunchEmbed = utils.getMealEmbedBase("lunch", mealDay);
    const dinnerEmbed = utils.getMealEmbedBase("dinner", mealDay);
    utils.populateMealEmbed(lunchEmbed, mealDay.lunch);
    utils.populateMealEmbed(dinnerEmbed, mealDay.dinner);

    subs.forEach(async (sub) => {
      if (!sub.weekend && (trTime.isoWeekday() === 6 || trTime.isoWeekday() === 7)) return;

      const embeds: MessageEmbed[] = [];
      if (sub.type === MealSubscriptionType.Both || sub.type === MealSubscriptionType.Lunch) embeds.push(lunchEmbed);
      if (sub.type === MealSubscriptionType.Both || sub.type === MealSubscriptionType.Dinner) embeds.push(dinnerEmbed);

      try {
        await client.users.send(sub.userId, { embeds });
      } catch (err) {
        if (err instanceof DiscordAPIError) logger.error(`Failed to send meal notification to user ${sub.userId}`, err);
      }
    });
  });
