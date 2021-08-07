module.exports = {
  apps: [{
    name: 'discord-vedbot',
    script: './build/vedbot.js',
    interpreter: 'node@16.6.1'
  }],

  deploy: {
    production: {
      user: 'ved',
      host: 'vedat.xyz',
      ref: 'origin/production',
      repo: 'git@github.com:vedattt/discord-vedbot.git',
      path: '/home/ved/discord-vedbot/prod',
      'pre-deploy-local': '',
      'post-deploy': 'npm i && npm run build && pm2 reload ecosystem.config.js --env production',
      'pre-setup': ''
    },
    development: {
      user: 'ved',
      host: 'vedat.xyz',
      ref: 'origin/development',
      repo: 'git@github.com:vedattt/discord-vedbot.git',
      path: '/home/ved/discord-vedbot/dev',
      'pre-deploy-local': '',
      'post-deploy': 'npm i && npm run build && pm2 reload ecosystem.config.js',
      'pre-setup': ''
    }
  }
};
