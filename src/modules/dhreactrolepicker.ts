/* eslint-disable no-param-reassign */
/* eslint-disable consistent-return */
import { GuildMember, MessageReaction, UserResolvable } from "discord.js";
import { BotModule, cfg, vedbot } from "../vedbot";

function roleSwitchSafety(
  caller: string | null,
  gradecheck: boolean[],
  guildmember: GuildMember,
  reaction: MessageReaction,
  memberID: UserResolvable
) {
  if (caller !== "🇦" && gradecheck[0]) {
    gradecheck[0] = false;
    guildmember.roles.remove(cfg.servers.dh.roles.grade9);
    reaction.message.reactions.cache.get("🇦")?.users.remove(memberID);
  }

  if (caller !== "🇧" && gradecheck[1]) {
    gradecheck[1] = false;
    guildmember.roles.remove(cfg.servers.dh.roles.grade10);
    reaction.message.reactions.cache.get("🇧")?.users.remove(memberID);
  }

  if (caller !== "🇨" && gradecheck[2]) {
    gradecheck[2] = false;
    guildmember.roles.remove(cfg.servers.dh.roles.grade11);
    reaction.message.reactions.cache.get("🇨")?.users.remove(memberID);
  }

  if (caller !== "🇩" && gradecheck[3]) {
    gradecheck[3] = false;
    guildmember.roles.remove(cfg.servers.dh.roles.grade12);
    reaction.message.reactions.cache.get("🇩")?.users.remove(memberID);
  }

  if (caller !== "🇲" && gradecheck[4]) {
    gradecheck[4] = false;
    guildmember.roles.remove(cfg.servers.dh.roles.graduate);
    reaction.message.reactions.cache.get("🇲")?.users.remove(memberID);
  }

  if (caller !== "🇺" && gradecheck[5]) {
    gradecheck[5] = false;
    guildmember.roles.remove(cfg.servers.dh.roles.university);
    reaction.message.reactions.cache.get("🇺")?.users.remove(memberID);
  }
}

export default {
  name: "dhreactrolepicker",
  description: "",
  state: true,
  guilds: ["dh"],
  onReactionAdd(reaction, user) {
    if (
      reaction.message.id === cfg.servers.dh.messages.rules_c ||
      reaction.message.id === cfg.servers.dh.messages.roles
    ) {
      const guildmember = reaction.message.guild?.members.cache.get(user.id);
      if (!guildmember) return;

      const gradeCheckArray = [
        guildmember.roles.cache.has(cfg.servers.dh.roles.grade9),
        guildmember.roles.cache.has(cfg.servers.dh.roles.grade10),
        guildmember.roles.cache.has(cfg.servers.dh.roles.grade11),
        guildmember.roles.cache.has(cfg.servers.dh.roles.grade12),
        guildmember.roles.cache.has(cfg.servers.dh.roles.graduate),
        guildmember.roles.cache.has(cfg.servers.dh.roles.university),
      ];

      const gradeCheckFlag = gradeCheckArray.indexOf(true);

      let reactionConfirmsRules = false;

      const emojiName = reaction.emoji.name;

      if (reaction.message.id === cfg.servers.dh.messages.rules_c) {
        if (emojiName === "👍") {
          guildmember.roles.add(cfg.servers.dh.roles.confirmedRules);
          reactionConfirmsRules = true;
        } else {
          reaction.users.remove(user.id);
          return;
        }
      } else if (reaction.message.id === cfg.servers.dh.messages.roles) {
        if (!guildmember.roles.cache.has(cfg.servers.dh.roles.memberConfirmed)) {
          if (emojiName === "🔴") {
            guildmember.roles.add(cfg.servers.dh.roles.mf);
          } else if (emojiName === "🔵") {
            guildmember.roles.add(cfg.servers.dh.roles.tm);
          } else if (emojiName === "🟢") {
            guildmember.roles.add(cfg.servers.dh.roles.ts);
          } else if (emojiName === "🟣") {
            guildmember.roles.add(cfg.servers.dh.roles.dil);
          } else if (emojiName === "🇦") {
            guildmember.roles.add(cfg.servers.dh.roles.grade9);
            gradeCheckArray[0] = true;

            if (gradeCheckFlag !== -1) roleSwitchSafety("🇦", gradeCheckArray, guildmember, reaction, user.id);
          } else if (emojiName === "🇧") {
            guildmember.roles.add(cfg.servers.dh.roles.grade10);
            gradeCheckArray[1] = true;

            if (gradeCheckFlag !== -1) roleSwitchSafety("🇧", gradeCheckArray, guildmember, reaction, user.id);
          } else if (emojiName === "🇨") {
            guildmember.roles.add(cfg.servers.dh.roles.grade11);
            gradeCheckArray[2] = true;

            if (gradeCheckFlag !== -1) roleSwitchSafety("🇨", gradeCheckArray, guildmember, reaction, user.id);
          } else if (emojiName === "🇩") {
            guildmember.roles.add(cfg.servers.dh.roles.grade12);
            gradeCheckArray[3] = true;

            if (gradeCheckFlag !== -1) roleSwitchSafety("🇩", gradeCheckArray, guildmember, reaction, user.id);
          } else if (emojiName === "🇲") {
            guildmember.roles.add(cfg.servers.dh.roles.graduate);
            gradeCheckArray[4] = true;

            if (gradeCheckFlag !== -1) roleSwitchSafety("🇲", gradeCheckArray, guildmember, reaction, user.id);
          } else if (emojiName === "🇺") {
            guildmember.roles.add(cfg.servers.dh.roles.university);
            gradeCheckArray[5] = true;

            if (gradeCheckFlag !== -1) roleSwitchSafety("🇺", gradeCheckArray, guildmember, reaction, user.id);
          } else {
            reaction.users.remove(user.id);
          }
        } else if (emojiName === "🇷") {
          guildmember.roles.remove(cfg.servers.dh.roles.memberConfirmed);
          guildmember.roles.remove(cfg.servers.dh.roles.mf);
          guildmember.roles.remove(cfg.servers.dh.roles.ts);
          guildmember.roles.remove(cfg.servers.dh.roles.tm);
          guildmember.roles.remove(cfg.servers.dh.roles.dil);
          reaction.message.reactions.cache.get("🔴")?.users.remove(user.id);
          reaction.message.reactions.cache.get("🟣")?.users.remove(user.id);
          reaction.message.reactions.cache.get("🔵")?.users.remove(user.id);
          reaction.message.reactions.cache.get("🟢")?.users.remove(user.id);

          roleSwitchSafety(null, gradeCheckArray, guildmember, reaction, user.id);

          reaction.users.remove(user.id);
          vedbot.guilds.dh.channels
            .get("log")
            ?.send(
              `:regional_indicator_r: -> **${guildmember.displayName}**#${user.discriminator} just reset their roles.`
            );
          return;
        } else {
          reaction.users.remove(user.id);
        }
      }

      if (guildmember.roles.cache.has(cfg.servers.dh.roles.confirmedRules) || reactionConfirmsRules) {
        const countgrade = gradeCheckArray.reduce((acc, val) => acc + (val ? 1 : 0), 0);
        const hasTS = vedbot.guilds.dh.messages.get("roles")?.reactions.cache.has("🟢");
        const hasTM = vedbot.guilds.dh.messages.get("roles")?.reactions.cache.has("🔵");
        const hasMF = vedbot.guilds.dh.messages.get("roles")?.reactions.cache.has("🔴");
        const hasDIL = vedbot.guilds.dh.messages.get("roles")?.reactions.cache.has("🟣");

        if (
          (guildmember.roles.cache.has(cfg.servers.dh.roles.mf) ||
            guildmember.roles.cache.has(cfg.servers.dh.roles.tm) ||
            guildmember.roles.cache.has(cfg.servers.dh.roles.ts) ||
            guildmember.roles.cache.has(cfg.servers.dh.roles.dil)) &&
          countgrade === 1
        ) {
          guildmember.roles.add(cfg.servers.dh.roles.memberConfirmed);

          if (gradeCheckArray[0]) {
            vedbot.guilds.dh.reactionQueue.add(`${user.id}A`);
            vedbot.guilds.dh.messages.get("roles")?.reactions.cache.get("🇦")?.users.remove(user.id);
          }
          if (gradeCheckArray[1]) {
            vedbot.guilds.dh.reactionQueue.add(`${user.id}B`);
            vedbot.guilds.dh.messages.get("roles")?.reactions.cache.get("🇧")?.users.remove(user.id);
          }
          if (gradeCheckArray[2]) {
            vedbot.guilds.dh.reactionQueue.add(`${user.id}C`);
            vedbot.guilds.dh.messages.get("roles")?.reactions.cache.get("🇨")?.users.remove(user.id);
          }
          if (gradeCheckArray[3]) {
            vedbot.guilds.dh.reactionQueue.add(`${user.id}D`);
            vedbot.guilds.dh.messages.get("roles")?.reactions.cache.get("🇩")?.users.remove(user.id);
          }
          if (gradeCheckArray[4]) {
            vedbot.guilds.dh.reactionQueue.add(`${user.id}M`);
            vedbot.guilds.dh.messages.get("roles")?.reactions.cache.get("🇲")?.users.remove(user.id);
          }
          if (gradeCheckArray[5]) {
            vedbot.guilds.dh.reactionQueue.add(`${user.id}U`);
            vedbot.guilds.dh.messages.get("roles")?.reactions.cache.get("🇺")?.users.remove(user.id);
          }
          if (hasMF) {
            vedbot.guilds.dh.reactionQueue.add(`${user.id}MF`);
            vedbot.guilds.dh.messages.get("roles")?.reactions.cache.get("🔴")?.users.remove(user.id);
          }
          if (hasTM) {
            vedbot.guilds.dh.reactionQueue.add(`${user.id}TM`);
            vedbot.guilds.dh.messages.get("roles")?.reactions.cache.get("🔵")?.users.remove(user.id);
          }
          if (hasTS) {
            vedbot.guilds.dh.reactionQueue.add(`${user.id}TS`);
            vedbot.guilds.dh.messages.get("roles")?.reactions.cache.get("🟢")?.users.remove(user.id);
          }
          if (hasDIL) {
            vedbot.guilds.dh.reactionQueue.add(`${user.id}DIL`);
            vedbot.guilds.dh.messages.get("roles")?.reactions.cache.get("🟣")?.users.remove(user.id);
          }
        }
      }
    } else if (
      reaction.message.id === cfg.servers.dh.messages.rules_p1 ||
      reaction.message.id === cfg.servers.dh.messages.rules_p2
    ) {
      reaction.users.remove(user.id);
    }
  },
  onReactionRemove(reaction, user) {
    if (vedbot.guilds.dh.reactionQueue.has(`${user.id}A`)) return vedbot.guilds.dh.reactionQueue.delete(`${user.id}A`);
    if (vedbot.guilds.dh.reactionQueue.has(`${user.id}B`)) return vedbot.guilds.dh.reactionQueue.delete(`${user.id}B`);
    if (vedbot.guilds.dh.reactionQueue.has(`${user.id}C`)) return vedbot.guilds.dh.reactionQueue.delete(`${user.id}C`);
    if (vedbot.guilds.dh.reactionQueue.has(`${user.id}D`)) return vedbot.guilds.dh.reactionQueue.delete(`${user.id}D`);
    if (vedbot.guilds.dh.reactionQueue.has(`${user.id}M`)) return vedbot.guilds.dh.reactionQueue.delete(`${user.id}M`);
    if (vedbot.guilds.dh.reactionQueue.has(`${user.id}U`)) return vedbot.guilds.dh.reactionQueue.delete(`${user.id}U`);
    if (vedbot.guilds.dh.reactionQueue.has(`${user.id}MF`))
      return vedbot.guilds.dh.reactionQueue.delete(`${user.id}MF`);
    if (vedbot.guilds.dh.reactionQueue.has(`${user.id}TS`))
      return vedbot.guilds.dh.reactionQueue.delete(`${user.id}TS`);
    if (vedbot.guilds.dh.reactionQueue.has(`${user.id}DIL`))
      return vedbot.guilds.dh.reactionQueue.delete(`${user.id}DIL`);
    if (vedbot.guilds.dh.reactionQueue.has(`${user.id}TM`))
      return vedbot.guilds.dh.reactionQueue.delete(`${user.id}TM`);

    const guildmember = reaction.message.guild?.members.cache.get(user.id);
    if (!guildmember) return;

    if (
      reaction.message.id === cfg.servers.dh.messages.rules_c ||
      reaction.message.id === cfg.servers.dh.messages.roles
    ) {
      const emojiname = reaction.emoji.name;

      if (emojiname === "👍" && reaction.message.id === cfg.servers.dh.messages.rules_c) {
        guildmember.roles.remove(cfg.servers.dh.roles.confirmedRules);
      } else if (reaction.message.id === cfg.servers.dh.messages.roles) {
        if (emojiname === "🔴") {
          guildmember.roles.remove(cfg.servers.dh.roles.mf);
        } else if (emojiname === "🟢") {
          guildmember.roles.remove(cfg.servers.dh.roles.ts);
        } else if (emojiname === "🟣") {
          guildmember.roles.remove(cfg.servers.dh.roles.dil);
        } else if (emojiname === "🇦") {
          guildmember.roles.remove(cfg.servers.dh.roles.grade9);
        } else if (emojiname === "🇧") {
          guildmember.roles.remove(cfg.servers.dh.roles.grade10);
        } else if (emojiname === "🇨") {
          guildmember.roles.remove(cfg.servers.dh.roles.grade11);
        } else if (emojiname === "🇩") {
          guildmember.roles.remove(cfg.servers.dh.roles.grade12);
        } else if (emojiname === "🇲") {
          guildmember.roles.remove(cfg.servers.dh.roles.graduate);
        } else if (emojiname === "🇺") {
          guildmember.roles.remove(cfg.servers.dh.roles.university);
        } else if (emojiname === "🔵") {
          if (vedbot.guilds.dh.reactionQueue.has(`${user.id}TM`))
            return vedbot.guilds.dh.reactionQueue.delete(`${user.id}TM`);
          guildmember.roles.remove(cfg.servers.dh.roles.tm);
        }
      }
    }
  },
} as BotModule;
