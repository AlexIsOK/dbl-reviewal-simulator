const { getAvatar } = require("../utils");

module.exports.setPrefix = (msg) => {
  return '#'
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
    .author(err.message, getAvatar(ctx.message.author, null, null))
    .color(RED)
    .send(true)
    .catch(() => { });
}
