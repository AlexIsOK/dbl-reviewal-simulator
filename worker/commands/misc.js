const { CommandOptions } = require("discord-rose/dist/typings/lib");
const { NonFatalError } = require("../../utils");

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
    exec: async (ctx) => {
      const guildPrefix = '!';

      const cmd = ctx.args[0];
      const url = `https://cdn.discordapp.com/avatars/${ctx.message.author.id}/${ctx.message.author.avatar}.png?size=128`;

      if (cmd) {
        const command = ctx.worker.commands.commands.find(e => e.command === cmd);
        if (command) {
          ctx.embed
            .author(ctx.message.author.username + ' | ' + ctx.command.name, url)
            .description(`\`Command\`: ${command.command}\n\`Usage\`: ${guildPrefix}${command.usage}\n${command.aliases ? `\`Aliases\`: ${command.aliases.join(', ')}\n` : ''}${command.permissions ? '\`Permissions:\` ' + command.permissions.join(', ') + '\n' : ''}\`Description\`: ${command.description}`)
            .footer('Developed by MILLION#1321')
            // .color()
            .timestamp()
            .send(true)
            .catch(() => { });
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
          // .color(ctx.worker.colors.PURPLE)
          .timestamp();

        categories.forEach((cat) => {
          if (!cat) return;
          if (cat === 'owner' && !userIsOwner) return;
          const desc = ctx.worker.commands.commands.filter(x => x.category === cat).map(cmd_ => `\`${guildPrefix}${cmd_.command}\`: ${cmd_.description}`).join('\n');
          embed.field(cat.charAt(0).toUpperCase() + cat.substr(1), desc);
        });

        embed
          .send(true)
          .catch(() => { });
      }
    }
  },


}