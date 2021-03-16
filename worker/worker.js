global.GREEN = 0x2ECC71
global.RED = 0xFF0000
global.PURPLE = 0xb649eb
global.ORANGE = 0xFFA500

const { Worker } = require('discord-rose');
const { readdirSync } = require('fs');
const { resolve } = require('path');
const { options, error, prefix } = require('./commandHandler');
const { cooldown, permissions, botPermissions, owner } = require('./middeware');
const { writeFileSync } = require('fs')

const worker = new Worker();

worker.commands
  .prefix(prefix)
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

const eventFiles = readdirSync(resolve(__dirname, 'events'), { withFileTypes: true })
  .filter(f => f.isFile() && f.name.endsWith('.js'))

for (const file of eventFiles) {
  const event = require(resolve(__dirname, 'events', file.name))
  worker.on(event.event, event.exec.bind(event, worker))
}

worker.on('READY', () => {
  const cmdArr = []
  const commands = worker.commands.commands.values()
  for (const command of commands) {
    cmdArr.push({
      name: command.command || '',
      usage: command.usage || '',
      description: command.description || '',
      aliases: command.aliases || []
    })
  }
  writeFileSync(resolve(__dirname, '../api/commands.json'), JSON.stringify(cmdArr), 'utf8')
})