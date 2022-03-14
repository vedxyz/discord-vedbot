import BotFileCollection from "./utils/botfilecollection";
import fsutils from "./utils/fsutils";
import { BotCommand, BotModule } from "./utils/interface";

export const cfg = fsutils.config.load();

export const vedbot = {
  commands: new BotFileCollection<BotCommand>("commands"),
  modules: new BotFileCollection<BotModule>("modules"),
};
fsutils.botfiles.loadAll(vedbot.modules, vedbot.commands);
