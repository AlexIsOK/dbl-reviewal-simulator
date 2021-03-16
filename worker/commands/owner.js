const { CommandOptions } = require("discord-rose/dist/typings/lib");
const { NonFatalError, getLang, getAvatar } = require("../../utils");
const { inspect } = require('util')

/**
 * Commands export
 * @type {{[key: string]: CommandOptions}}
 */
module.exports = {
  eval: {
    command: 'eval',
    aliases: ['ev'],
    usage: 'eval <code>',
    description: 'Eval some code on the bot\'s process',
    category: 'owner',
    owner: true,
    exec: async (ctx) => {
      let output = '';
      let status = true;

      try {
        let toEval = ctx.args.join(' ').replace(/token/g, 'mem');
        let evaled = eval(toEval);

        if (evaled instanceof Promise) evaled = await evaled;
        evaled = typeof evaled !== 'string' ? inspect(evaled) : evaled;

        output = evaled.split(ctx.worker.options.token).join('[TOKEN REMOVED]');
      } catch (err) {
        status = false;
        output = err;
      }

      await ctx.embed
        .title('Eval')
        .description(`\`\`\`js\n${output.toString().split('```').join('\\`\\`\\`')}\`\`\``)
        .color(status ? GREEN : RED)
        .send()
      return;
    }
  }
}