# VedBot, *a (private) discord.js bot*

VedBot is a private Discord bot developed to cover the needs of a few servers I am a part of.

The project had started out as a single-file JavaScript project built using the discord.js library, but has gone through quite a bit of refactoring since then. Namely;

1. The code was split into proper "modules" and "commands" rather than being contained in a single gigantic file.
2. Later on, the project was migrated over to TypeScript. The migration, initially being more of a pain than imagined, has made the codebase much more reliable thanks to the excruciating work put into it.
3. And at last, the project was upgraded to take advantage of Discord API v9 with the release of discord.js v13.

## `config.json`

All of the configuration is contained within this one file, and it is naturally quite vital to the function of the bot. However, due to its privacy-sensitive contents, it is not publicly available.

## Usage

The project can be used with the scripts included under the `package.json` file.

I handle the deployment using [PM2](https://pm2.keymetrics.io/) personally, which is configured in the `pm2.config.js` file.

> Note: Node.js version >= 16.6.0 is required for the discord.js module.

---

## To do

- [ ] Switch to PostgreSQL for dynamic data, keep static in config.json
- [ ] Add meal menu commands through `xpdf`'s `pdftotext`
- [ ] Integrate CI/CD
- [ ] Unit testing
- [ ] Improve PM2 workflow
- [ ] The reaction role picker needs an overhaul
- [x] Add role commands for the CS server
- [x] `mizyaz` module needs to be less destructive with its handling of messages
- [x] `atpics` module needs a command to self-set pics, and also should support non-discord-cdn links if possible
- [x] `guildjoinleave` module should tag relevant users without sending them a mention?
- [x] Add readme and license files
