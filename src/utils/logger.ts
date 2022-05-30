import chalk from "chalk";

const logger = {
  info: (message: unknown, ...args: unknown[]) => console.log(message, ...args),
  error: (message: unknown, ...args: unknown[]) =>
    console.error(typeof message === "string" ? chalk.red(message) : message, ...args),
  warn: (message: unknown, ...args: unknown[]) =>
    console.warn(typeof message === "string" ? chalk.yellow(message) : message, ...args),
  success: (message: string) => console.log(chalk.green(message)),
};
export default logger;
