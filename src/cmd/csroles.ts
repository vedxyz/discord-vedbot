import { GuildMember, MessageActionRow, MessageButton, MessageEmbed, MessageSelectMenu } from "discord.js";
import { BotCommand, offerings } from "../vedbot";

const command: BotCommand = {
  data: {
    name: "csroles",
    description: "Manage your roles for CS course sections.",
    defaultPermission: true,
    options: [
      {
        name: "course",
        description: "Course to manage roles for.",
        type: "STRING",
        required: true,
        choices: ["CS 201", "CS 223"].map((course) => ({ name: course, value: course })),
      },
    ],
  },
  guilds: ["cs"],
  async execute(interaction) {
    const selectedCourse = interaction.options.getString("course", true);
    const time = Date.now();
    const roles = offerings
      .get("CS")
      ?.find((course) => course.courseCode === selectedCourse)
      ?.sections.map((el) => ({
        name: `${selectedCourse}-${el.section}`,
        id: interaction.guild?.roles.cache.find((role) => role.name === `${selectedCourse}-${el.section}`)?.id ?? "",
      }));

    const member = interaction.member as GuildMember;
    const currentRoleId = member.roles.cache
      .filter((role) => role.name.startsWith("CS "))
      .find((role) => roles?.some(({ name }) => role.name === name) ?? false)?.id;

    const componentRows = [
      new MessageActionRow().addComponents(
        new MessageSelectMenu({
          customId: `selection_${time}`,
          placeholder: "Choose your section here",
          minValues: 1,
          maxValues: 1,
          options: roles?.map((role) => ({ label: role.name, value: role.id })),
        })
      ),
    ];

    if (currentRoleId !== undefined) {
      componentRows.push(
        new MessageActionRow().addComponents(
          new MessageButton({
            customId: `deletion_${time}`,
            style: "PRIMARY",
            label: "Remove current role",
            emoji: "❌",
          })
        )
      );
    }

    interaction.reply({
      embeds: [new MessageEmbed().setTitle("Waiting for your input...").setColor("AQUA")],
      ephemeral: true,
      components: componentRows,
    });

    interaction.channel
      ?.awaitMessageComponent({
        time: 20000,
        filter: (compInteraction) => {
          const valid =
            compInteraction.user.id === interaction.user.id &&
            (compInteraction.customId === `selection_${time}` || compInteraction.customId === `deletion_${time}`);

          if (valid) {
            compInteraction.deferUpdate();
            return true;
          }
          return false;
        },
      })
      .then(async (compInteraction) => {
        if (currentRoleId !== undefined) {
          await member.roles.remove(currentRoleId);
        }

        if (compInteraction.isButton()) {
          interaction.editReply({
            embeds: [new MessageEmbed().setTitle("Your role has been removed.").setColor("RED")],
            components: [],
          });
        } else if (compInteraction.isSelectMenu()) {
          member.roles.add(compInteraction.values[0]);
          interaction.editReply({
            embeds: [
              new MessageEmbed()
                .setTitle("You have been given your role.")
                .setDescription(`**${interaction.guild?.roles.cache.get(compInteraction.values[0])?.name}**`)
                .setColor("RANDOM"),
            ],
            components: [],
          });
        }
      })
      .catch(() => {
        interaction.editReply({
          embeds: [
            new MessageEmbed()
              .setTitle("This command timed out.")
              .setDescription("You were not given any roles. Try again.")
              .setColor("RED"),
          ],
          components: [],
        });
      });
  },
};

export default command;
