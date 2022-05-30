// https://discord.com/api/oauth2/authorize?client_id=747882956520947814&permissions=8&scope=applications.commands%20bot
// The bot is not set to public on the Developer Portal, and as such is open to invitation solely by me.

import Discord, { GuildMember, MessageEmbed } from "discord.js";
import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";
import { cfg, vedbot } from "./settings";
import utils from "./utils/utils";
// eslint-disable-next-line import/no-cycle
import { scheduleMealSubscriptionJob } from "./utils/mealsubservice";

dayjs.extend(isoWeek);

const { canExecuteEvent } = utils;

const client = new Discord.Client({
  intents: [
    "GUILDS",
    "GUILD_MEMBERS",
    "GUILD_VOICE_STATES",
    "GUILD_MESSAGES",
    "GUILD_MESSAGE_REACTIONS",
    "DIRECT_MESSAGES",
  ],
  // partials: ["CHANNEL"], // Apparently required in order to receive DMs
  presence: {
    status: "idle",
    activities: [
      {
        type: "WATCHING",
        name: "for slash commands",
      },
    ],
  },
});

client.once("ready", async () => {
  console.log("Entering client ready block...");

  scheduleMealSubscriptionJob();

  console.log("Client ready initialization complete!");
});

client.on("interactionCreate", async (interaction) => {
  if (interaction.isCommand() && interaction.inGuild()) {
    try {
      await vedbot.commands.get(interaction.commandName).execute(interaction);
    } catch (error) {
      console.error(
        `Error for command ${interaction.commandName}`,
        interaction.options.data.map((opt) => `Opt '${opt.name}': ${opt.value}`),
        error
      );

      try {
        await interaction.reply({
          embeds: [
            new MessageEmbed()
              .setTitle("Error")
              .setDescription(" Unable to execute this command due to some kind of incompetence on my behalf.")
              .setColor("RED"),
          ],
        });
      } catch (innerError) {
        console.error("Failed to deliver error message also...", innerError);
      }
    }
  }
});

client.on("messageCreate", (message) => {
  if (message.author.id === client.user?.id || !message.inGuild()) return;

  ["mizyaz", "dhlink", "mentionimg"].forEach(async (eventName) => {
    const event = vedbot.events.get(eventName);

    try {
      if (canExecuteEvent(event, message.guild.id)) await event.onMessage?.(message);
    } catch (error) {
      console.error(error);
    }
  });
});

// client.on("voiceStateUpdate", (oldState, newState) => {});

client.on("guildMemberAdd", (member) => {
  const guildjoinleave = vedbot.events.get("guildjoinleave");

  if (canExecuteEvent(guildjoinleave, member.guild.id)) guildjoinleave?.onMemberJoin?.(member);
});

client.on("guildMemberRemove", (member) => {
  const guildjoinleave = vedbot.events.get("guildjoinleave");

  if (canExecuteEvent(guildjoinleave, member.guild.id)) guildjoinleave?.onMemberLeave?.(member as GuildMember);
});

// client.on("messageReactionAdd", (reaction, user) => {
//   const dhreactrolepicker = vedbot.events.get("dhreactrolepicker");

//   if (canExecuteEvent(dhreactrolepicker, reaction.message.guild?.id))
//     dhreactrolepicker?.onReactionAdd?.(reaction as MessageReaction, user as User);
// });

// client.on("messageReactionRemove", (reaction, user) => {
//   const dhreactrolepicker = vedbot.events.get("dhreactrolepicker");

//   if (canExecuteEvent(dhreactrolepicker, reaction.message.guild?.id))
//     dhreactrolepicker?.onReactionRemove?.(reaction as MessageReaction, user as User);
// });

client.login(cfg.token).catch(console.error);

process.on("SIGINT", async () => {
  console.log("SIGINT caught!");
  await utils.exitBot();
});
