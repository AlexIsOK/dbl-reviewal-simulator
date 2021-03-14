const { getAvatar } = require("../utils");

module.exports.setPrefix = (msg) => {
  return '!'
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
    cooldown: 9e3
  }
}

module.exports.error = (ctx, err) => {
  ctx.embed
    .author(err.message, getAvatar(ctx.message.author, 'gif', 128))
    .color(0xFF0000)
    .send(true)
    .catch(() => { });
}
