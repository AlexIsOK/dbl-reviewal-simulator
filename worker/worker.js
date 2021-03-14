const { Worker } = require('discord-rose');
const { readdirSync } = require('fs');
const { resolve } = require('path');
const { setPrefix, options, error } = require('./commandHandler');
const { cooldown, permissions, botPermissions, owner } = require('./middeware');

const worker = new Worker();

worker.commands
  .setPrefix(setPrefix)
  .options(options)
  .error(error)
  .middleware(cooldown())
  .middleware(permissions())
  .middleware(botPermissions())
  .middleware(owner())

const commandFiles = readdirSync(resolve(__dirname, 'commands'), { withFileTypes: true })
  .filter(f => f.isFile() && f.name.endsWith('.js'))

for (const file of commandFiles) {
  const commands = require(resolve(__dirname, 'commands', file.name))
  for (const command of Object.values(commands)) {
    worker.commands.add(command)
  }
}
