const { CommandOptions } = require("discord-rose/dist/typings/lib");
const { NonFatalError, getLang, wait } = require("../../utils");

const fetch = require('node-fetch');

/**
 *   help: {
    command: 'help',
    usage: 'help [command]',
    description: 'Get a list of all commands, or help on a command',
    permissions: ['files'],
  },
 */

/**
 * Commands export
 * @type {{[key: string]: CommandOptions}}
 */
module.exports = {
  gayrate: {
    command: 'gayrate',
    aliases: ['howgay', 'gayr8'],
    usage: 'gayrate <member>',
    description: 'get how gay someone is',
    permissions: ['emojis'],
    category: 'fun',
    exec: (ctx) => {
      const howGay = Math.floor(Math.random() * 100);
      const user = ctx.worker.users.get((ctx.args[0] || '').replace(/[<@!>]/g, ''))
      if (user) {
        ctx.embed
          .description(getLang('CMD_GAY_USER', howGay, user.id))
          .color(GREEN)
          .send(true);
        return;
      }
      ctx.embed
        .description(getLang('CMD_GAY_SELF', howGay, ctx.message.author.id))
        .color(GREEN)
        .send(true);
      return;
    }
  },

  say: {
    command: 'say',
    usage: 'say <text>',
    description: 'say something as the bot',
    permissions: ['manageMessages'],
    botPermissions: ['sendMessages'],
    category: 'fun',
    exec: async (ctx) => {
      await ctx.delete();
      ctx.send(ctx.args.join(' '));
    }
  },

  sex: {
    command: 'sex',
    usage: 'sex <user>',
    description: 'sex',
    permissions: ['administrator'],
    category: 'fun',
    exec: async (ctx) => {
      ctx.reply(getLang('CMD_SEX'))
    }
  },

  math: {
    command: 'math',
    usage: 'math <equation>',
    description: 'uses mathjs to evaluate an equation',
    category: 'fun',
    exec: async (ctx) => {
      const msg = await ctx.send(getLang('LOADING'));
      setTimeout(async () => {
        await ctx.worker.api.messages.delete(msg.channel_id, msg.id)
        ctx.reply(getLang('CMD_MATH'))
      }, 1234)
    }
  },

  dice: {
    command: 'dice',
    aliases: ['roll'],
    usage: 'dice [sides]',
    description: 'roll a X sided dice',
    category: 'fun',
    exec: (ctx) => {
      const mult = ctx.args[0] ? parseInt(ctx.args[0]) : 6
      const roll = Math.floor(Math.random() * mult)
      ctx.reply(getLang('CMD_DICE', roll))
    }
  },

  yesno: {
    command: 'y-n',
    aliases: ['yesno', 'yes-no'],
    usage: 'y-n <question>',
    description: 'Yes or no?',
    category: 'fun',
    exec: (ctx) => {
      const question = ctx.args.join(' ');
      if (!question) throw new Error(getLang('CMD_YESNO_QUESTION'))
      const random = Math.random() > .66;
      ctx.reply(getLang(random ? "CMD_YESNO_YES" : "CMD_YESNO_NO"))
    }
  },

  frog: {
    command: 'frog',
    aliases: ['forg'],
    usage: 'frog [frog]',
    description: 'FROG! sourced from https://frogs.media',
    category: 'fun',
    exec: async (ctx) => {
      const frog = ctx.args[0];
      if (frog) {
        ctx.send(`https://frogs.media/${frog}`)
        return;
      }
      const response = await fetch('https://frogs.media/api/random')
      const json = await response.json()
      ctx.reply(`https://frogs.media/${json.name}`)
    }
  },

  pp: {
    command: 'pp',
    aliases: ['penis', 'dick'],
    usage: 'pp [user]',
    description: 'How long is your pp?',
    category: 'fun',
    exec: (ctx) => {
      const ppLength = Math.floor(Math.random() * 13);
      const user = ctx.worker.users.get((ctx.args[0] || '').replace(/[<@!>]/g, '')) || ctx.message.author;
      ctx.embed
        .description(getLang('CMD_PP_LENGTH', user.id, '='.repeat(ppLength)))
        .color(GREEN)
        .send()
    }
  },

  restart: {
    command: 'restart',
    aliases: ['r'],
    usage: 'restart',
    description: 'Restart the bot',
    owner: true,
    category: 'fun',
    exec: async (ctx) => {
      ctx.embed
        .description(getLang('CMD_RESTART_SHUTDOWN'))
        .color(ORANGE)
        .send()

      try {
        ctx.worker.setStatus('watching', 'shutdown', 'dnd');

        await wait(3000)
        ctx.worker.setStatus('watching', 'startup', 'idle');

        await wait(3000)
        ctx.worker.setStatus('watching', ctx.worker.guilds.size + ' guilds', 'online')

        await wait(1000)
        ctx.embed
          .description(getLang('CMD_RESTART_STARTUP'))
          .color(GREEN)
          .send()
      } catch (err) { }
    }
  },

  shutdown: {
    command: 'shutdown',
    aliases: ['s'],
    usage: 'shutdown [time]',
    description: 'shutdown the bot',
    category: 'fun',
    exec: (ctx) => {
      ctx.reply(getLang('CMD_SHUTDOWN'))
    }
  },

  weeb: {
    command: 'weeb',
    usage: 'weeb',
    description: 'Ping the nearest weeb',
    category: 'fun',
    exec: (ctx) => {
      ctx.reply(',', true)
    }
  },

  pingall: {
    command: 'pingall',
    usage: 'pingall',
    description: 'Ping 90 users at the same time',
    category: 'fun',
    permissions: ['administrator'],
    exec: async (ctx) => {
      const members = await ctx.worker.api.members.getMany(ctx.guild.id, { limit: 90 })
      let string = ``;
      members.forEach(member => {
        if (member.user.bot) return;
        string+=`<@!${member.user.id}>`
      })
      await ctx.send(string)
    }
  }
}