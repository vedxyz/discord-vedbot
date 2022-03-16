# VedBot, *a (private) discord.js bot*

VedBot is a private Discord bot developed to cover the needs of a few servers I am a part of.

The project had started out as a single-file JavaScript project built using the discord.js library, but has gone through quite a bit of refactoring since then. Namely;

1. The code was split into proper "modules" and "commands" rather than being contained in a single gigantic file.
2. Later on, the project was migrated over to TypeScript. The migration, initially being more of a pain than imagined, has made the codebase much more reliable thanks to the excruciating work put into it.
3. Later on, the project was upgraded to take advantage of Discord API v9 with the release of discord.js v13.
4. At last, the project was finally refactored to use PostgreSQL instead of a JSON file as its data store.

## `config.json`

All of the static configuration is contained within this one file, and it is naturally quite vital to the function of the bot. However, due to the contents being sensitive, it is not publicly available.
It is supposed to be placed one level above the `build` folder, which is considered the project root.

## Usage

The project can be used with the scripts included under the `package.json` file.

---

## To do

- [ ] Add Bilkent offerings utilities
- [ ] Migrate away from PM2 deployment? Use PM2 or Docker to run the production build, but do it with SSH/scripts?
  Get rid of the development build on the server, no need.
- [ ] Integrate CI/CD
- [ ] Automated testing to an extent?
- [x] Add meal menu commands through `xpdf`'s `pdftotext`
- [x] Switch to PostgreSQL for dynamic data, keep static in config.json
- [x] Add role commands for the CS server
- [x] `mizyaz` module needs to be less destructive with its handling of messages
- [x] `mentionimg` module needs a command to self-set pics, and also should support non-discord-cdn links if possible
- [x] `guildjoinleave` module should tag relevant users without sending them a mention?
- [x] Add readme and license files
