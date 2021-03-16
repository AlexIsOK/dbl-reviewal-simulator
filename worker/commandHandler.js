const { getAvatar } = require("../utils");

module.exports.prefix = (msg) => {
  return Database.GuildDB.getPrefix(msg.guild_id ?? 'dm')
}

module.exports.options = {
  bots: true,
  caseInsensitiveCommand: false,
  caseInsensitivePrefix: false,
  mentionPrefix: false,
  default: {
    permissions: [],
    botPermissions: [],
    category: 'misc',
    cooldown: 17e3
  }
}

module.exports.error = (ctx, err) => {
  ctx.embed
    .author(err.nonFatal ? err.message : err.toString(), getAvatar(ctx.message.author, null, null))
    .color(RED)
    .send(true)
    .catch(() => { });
}
