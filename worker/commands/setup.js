const { CommandOptions } = require("discord-rose/dist/typings/lib");
const { NonFatalError, getLang, getAvatar } = require("../../utils");

/**
 * Commands export
 * @type {{[key: string]: CommandOptions}}
 */
module.exports = {
  setup: {
    command: 'setup',
    usage: 'setup <type> <config>',
    description: 'Set the configuration for the bot',
    category: 'setup',
    exec: async (ctx) => {
      const command = ctx.args.shift();

      switch (command) {
        case 'prefix': {
          throw new NonFatalError(getLang('CMD_SETUP_PREFIX'))
        }

        case 'muterole': {
          const ID = (ctx.args[0] || '').replace(/[<@&>]/g, '')
          const role = ctx.worker.guildRoles.get(ctx.guild.id).get(ID);

          if (!role) throw new NonFatalError(getLang('CMD_SETUP_MUTEROLE_NONE'))

          await Database.GuildDB.setMuteRole(ctx.guild.id, role.id);

          await ctx.embed
            .description(getLang('CMD_SETUP_MUTEROLE_SET', role.id))
            .color(GREEN)
            .send()

          break;
        }

        case 'stinky': {
          const ID = (ctx.args[0] || '').replace(/[<@!>]/g, '')
          const member = ctx.worker.members.get(ctx.guild.id).get(ID) || await ctx.worker.api.members.get(ctx.guild.id, ID).catch(e => null);

          if (!member) throw new NonFatalError(getLang('CMD_SETUP_STINKY_NONE'))

          await Database.GuildDB.setStinky(ctx.guild.id, member.user.id)

          await ctx.embed
            .description(getLang('CMD_SETUP_STINKY_SET', member.user.id))
            .color(GREEN)
            .send()

          break;
        }

        case 'weeb': {
          const ID = (ctx.args[0] || '').replace(/[<@!>]/g, '')
          const member = ctx.worker.members.get(ctx.guild.id).get(ID) || await ctx.worker.api.members.get(ctx.guild.id, ID).catch(e => null);

          if (!member) throw new NonFatalError(getLang('CMD_SETUP_WEEB_NONE'))

          await Database.GuildDB.setWeeb(ctx.guild.id, member.user.id)

          await ctx.embed
            .description(getLang('CMD_SETUP_WEEB_SET', member.user.id))
            .color(GREEN)
            .send()

          break;
        }

        default: {
          throw new NonFatalError(getLang('CMD_SETUP_NO_TYPE', 'weeb, stinky, prefix, muterole'))
        }
      }
    }
  }
}