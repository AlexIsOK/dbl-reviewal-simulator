const { CommandOptions } = require("discord-rose/dist/typings/lib");
const { NonFatalError, getLang, getAvatar } = require("../../utils");

/**
 * Commands export
 * @type {{[key: string]: CommandOptions}}
 */
module.exports = {
  help: {
    command: 'help',
    usage: 'help [command]',
    description: 'Get a list of all commands, or help on a command',
    permissions: ['files'],
    cooldown: 1000 * 60 * 45,
    exec: async (ctx) => {
      const guildPrefix = await Database.GuildDB.getPrefix(ctx.guild.id);

      const cmd = ctx.args[0];
      const url = getAvatar(ctx.message.author);

      if (cmd) {
        const command = ctx.worker.commands.commands.find(e => e.command === cmd);
        if (command) {
          await ctx.embed
            .author(ctx.message.author.username + ' | ' + ctx.command.name, url)
            .description(`\`Command\`: ${command.command}\n\`Usage\`: ${guildPrefix}${command.usage}\n${command.aliases?.length > 0 ? `\`Aliases\`: ${command.aliases.join(', ')}\n` : ''}${command.permissions?.length > 0 ? '\`Permissions\`: ' + command.permissions.join(', ') + '\n' : ''}\`Description\`: ${command.description}`)
            .footer('Developed by MILLION#1321')
            .color(PURPLE)
            .timestamp()
            .send()
          return;
        } else {
          throw new NonFatalError(`Command "${cmd}" not found.`)
        }
      } else {
        const userIsOwner = false;
        const categories = ctx.worker.commands.commands.reduce((a, b) => a.includes(b.category) ? a : a.concat([b.category]), []);

        const embed = ctx.embed
          .author(ctx.message.author.username + ' | ' + ctx.command.name, url)
          .title('Commands')
          .footer('Developed by MILLION#1321')
          .color(PURPLE)
          .timestamp();

        categories.forEach((cat) => {
          if (!cat) return;
          if (cat === 'owner' && !userIsOwner) return;
          const desc = ctx.worker.commands.commands.filter(x => x.category === cat).map(cmd_ => `\`${guildPrefix}${cmd_.command}\`: ${cmd_.description}`).join('\n');
          embed.field(cat.charAt(0).toUpperCase() + cat.substr(1), desc);
        });

        await embed
          .send(true)
      }
    }
  },

  test: {
    command: 'test',
    usage: 'test',
    description: 'test',
    exec: async (ctx) => {
      await ctx.worker.api.messages.react(ctx.channel.id, ctx.message.id, '????');
    }
  },

  extreme: {
    command: 'extreme',
    usage: 'extreme',
    description: 'extreme',
    exec: async (ctx) => {
      await ctx.send(getLang('CMD_EXTREME'))
    }
  },

  servers: {
    command: 'servers',
    usage: 'servers',
    description: 'get a list of all of the servers',
    category: 'misc',
    permissions: ['administrator'],
    exec: async (ctx) => {
      throw new NonFatalError(getLang('CMD_SERVERS'))
    }
  }
}