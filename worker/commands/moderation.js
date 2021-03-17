const { CommandOptions } = require("discord-rose/dist/typings/lib");
const { NonFatalError, getLang, getAvatar, getLanguages } = require("../../utils");

/**
 * Commands export
 * @type {{[key: string]: CommandOptions}}
 */
module.exports = {
  purge: {
    command: 'purge',
    usage: 'purge <amount>',
    description: 'Purge a bunch of messages',
    aliases: ['clear', 'c'],
    permissions: ['manageServer'],
    botPermissions: ['manageMessages'],
    category: 'moderation',
    exec: async (ctx) => {
      const messages = (await ctx.worker.api.channels.getMessages(ctx.channel.id)).filter(e => (Date.now() - new Date(e.timestamp).getTime()) < 1000 * 60 * 60 * 24 * 14).map(m => m.id).filter(e => e)

      messages.length = messages.length > parseInt(ctx.args[0]) ? parseInt(ctx.args[0]) < 0 ? 1 : parseInt(ctx.args[0]) : messages.length

      await ctx.worker.api.messages.bulkDelete(ctx.channel.id, messages)

      await ctx.embed
        .title(`Successfully purged ${messages.length} message${messages.length > 1 ? 's' : ''}`)
        .color(GREEN)
        .send(false)
    }
  },

  ban: {
    command: 'ban',
    usage: 'ban <member>',
    description: 'ban a member',
    aliases: ['b'],
    permissions: ['banMembers'],
    botPermissions: ['banMembers'],
    category: 'moderation',
    exec: async (ctx) => {
      const ID = (ctx.args[0] || '').replace(/[<@!>]/g, '')
      const member = ctx.worker.members.get(ctx.guild.id).get(ID) || await ctx.worker.api.members.get(ctx.guild.id, ID).catch(e => null);

      if (!member) throw new NonFatalError(getLang('CMD_BAN_NO_MEMBER'))

      const guildRoles = ctx.worker.guildRoles.get(ctx.guild.id).array();

      const userRole = guildRoles.filter(r => ctx.member.roles.includes(r.id)).map(r => r.position).reduce((a, r) => r > a ? r : a, 0)
      const memberRole = guildRoles.filter(r => member.roles.includes(r.id)).map(r => r.position).reduce((a, r) => r > a ? r : a, 0)
      const myRole = guildRoles.filter(r => ctx.worker.members.get(ctx.guild.id).get(ctx.worker.user.id).roles.includes(r.id)).map(r => r.position).reduce((a, r) => r > a ? r : a, 0)

      if (memberRole >= userRole) throw new NonFatalError(getLang('CMD_BAN_NO_YOU'))
      if (myRole <= memberRole) throw new NonFatalError(getLang('CMD_BAN_NO_ME'))

      await ctx.worker.api.members.ban(ctx.guild.id, member.user.id);

      await ctx.embed
        .description(getLang('CMD_BAN_SUCCESS', member.user.id))
        .color(ORANGE)
        .send()
    }
  },

  kick: {
    command: 'kick',
    usage: 'kick <member>',
    description: 'kick a member',
    aliases: ['k'],
    permissions: ['kickMembers'],
    botPermissions: ['kickMembers'],
    category: 'moderation',
    exec: async (ctx) => {
      const ID = (ctx.args[0] || '').replace(/[<@!>]/g, '')
      const member = ctx.worker.members.get(ctx.guild.id).get(ID) || await ctx.worker.api.members.get(ctx.guild.id, ID).catch(e => null);

      if (!member) throw new NonFatalError(getLang('CMD_KICK_NO_MEMBER'))

      const guildRoles = ctx.worker.guildRoles.get(ctx.guild.id).array();

      const userRole = guildRoles.filter(r => ctx.member.roles.includes(r.id)).map(r => r.position).reduce((a, r) => r > a ? r : a, 0)
      const memberRole = guildRoles.filter(r => member.roles.includes(r.id)).map(r => r.position).reduce((a, r) => r > a ? r : a, 0)
      const myRole = guildRoles.filter(r => ctx.worker.members.get(ctx.guild.id).get(ctx.worker.user.id).roles.includes(r.id)).map(r => r.position).reduce((a, r) => r > a ? r : a, 0)

      if (memberRole >= userRole) throw new NonFatalError(getLang('CMD_KICK_NO_YOU'))
      if (myRole <= memberRole) throw new NonFatalError(getLang('CMD_KICK_NO_YOU'))

      await ctx.worker.api.members.kick(ctx.guild.id, member.user.id);

      await ctx.embed
        .description(getLang('CMD_KICK_SUCCESS', member.user.id))
        .color(ORANGE)
        .send()
    }
  },

  setnick: {
    command: 'setnick',
    usage: 'setnick <member> [nick]',
    description: 'Set a member\'s nickname',
    permissions: ['manageMembers'],
    botPermissions: ['manageMembers'],
    category: 'moderation',
    exec: async (ctx) => {
      const ID = (ctx.args[0] || '').replace(/[<@!>]/g, '')
      const member = ctx.worker.members.get(ctx.guild.id).get(ID) || await ctx.worker.api.members.get(ctx.guild.id, ID).catch(e => null);

      if (!member) throw new NonFatalError(getLang('CMD_NICK_NO_MEMBER'))

      const name = ctx.args.splice(1).join(' ');
      if (!name) {
        await ctx.worker.api.members.setNickname(ctx.guild.id, member.user.id, null)
        await ctx.embed
          .description(getLang('CMD_NICK_SUCCESS_RESET', member.user.id))
          .color(GREEN)
          .send();
        return;
      }

      await ctx.worker.api.members.setNickname(ctx.guild.id, member.user.id, name)
      await ctx.embed
        .description(getLang('CMD_NICK_SUCCESS_CHANGED', member.user.id, name))
        .color(GREEN)
        .send();
      return;
    }
  },

  lang: {
    command: 'lang',
    usage: 'lang <lang>',
    description: 'Get a list of all supported languages',
    permissions: ['manageMessages'],
    category: 'moderation',
    exec: async (ctx) => {
      await ctx.embed
        .title(getLang('CMD_LANG', getLanguages().map(lang => lang.name).join(', ')))
        .color(GREEN)
        .send()
    }
  }
}