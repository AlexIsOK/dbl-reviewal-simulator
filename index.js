const { Master } = require('discord-rose')
const { config } = require('dotenv')
const path = require('path')

config()

const master = new Master(path.resolve(__dirname, 'worker/worker.js'), {
  token: process.env.TOKEN,
  cache: {
    channels: true,
    guilds: true,
    members: true,
    messages: true,
    roles: true,
    self: true,
    users: true
  },
  warnings: {
    cachedIntents: false
  },
});

master.start();
