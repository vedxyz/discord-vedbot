import Discord from "discord.js";
import { BotCommand, BotEvent } from "./interface";

class BotFileCollection<T extends BotCommand | BotEvent> extends Discord.Collection<string, T> {
  rootdir: string;

  constructor(rootdir: string) {
    super();
    this.rootdir = rootdir;
  }

  get(key: string): T {
    if (!super.has(key)) throw new Error("Attempted to retrieve botfile with invalid key");
    return super.get(key) as T;
  }
}
export default BotFileCollection;
