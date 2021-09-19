import { SupportedDepartment } from "../interface";
import { BotCommand, offerings } from "../vedbot";

const command: BotCommand = {
  data: {
    name: "bilkent",
    description: "Query offerings for Bilkent University.",
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
            choices: [
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
            ].map((choice) => ({ name: choice, value: choice })),
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
    ],
  },
  guilds: ["dh", "cs"],
  execute(interaction) {
    const subcommand = interaction.options.getSubcommand(true);

    if (subcommand === "getcourse") {
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
    }
  },
};

export default command;
