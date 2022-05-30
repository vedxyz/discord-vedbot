import BotFileCollection from "./utils/botfilecollection";
import fsutils from "./utils/fsutils";
import { BotCommand, BotEvent } from "./utils/interface";

export const cfg = fsutils.config.load();

export const vedbot = {
  commands: new BotFileCollection<BotCommand>("commands"),
  events: new BotFileCollection<BotEvent>("events"),
};
fsutils.botfiles.loadAll(vedbot.events, vedbot.commands);
