const { formatTime, getLang } = require("../utils");

/**
 * The cooldown middleware, which is pretty pogging
 */
module.exports.cooldown = () => {
  const cooldowns = new Map();
  const badPeople = [];

  return (ctx) => {
    if (!ctx.command.cooldown) {
      throw new Error(getLang('NO_COOLDOWN', ctx.command.command));
    }

    const id = ctx.guild.id || 'dm';
    const currentCooldown = cooldowns.get(id);

    if (currentCooldown) {
      if (currentCooldown.createdMessage) return false;
      const timeRemaining = currentCooldown.time - Date.now();

      currentCooldown.createdMessage = true;

      setTimeout(() => {
        currentCooldown.createdMessage = false;
      }, 2000);

      badPeople.push(ctx.message.author.id)
      setTimeout(() => {
        badPeople.splice(badPeople.indexOf(ctx.message.author.id))
      })

      throw new Error(getLang('COOLDOWN', formatTime(timeRemaining)));
    }

    cooldowns.set(id, {
      time: Date.now() + ctx.command.cooldown,
      timeout: setTimeout(() => {
        cooldowns.delete(id);
      }, ctx.command.cooldown)
    });

    return true;
  };
};

/**
 * Check if the user has permissions
 */
module.exports.permissions = () => {
  return async (ctx) => {
    const perms = ctx.command.permissions;
    if (!perms || perms.length === 0) return true;

    const hasPerms = perms.every((perm) => ctx.hasPerms(perm));
    if (hasPerms) return true;

    throw new Error(getLang('NO_PERMS', ctx.command.permissions.join(', ')))
  };
};

/**
 * Check if the bot has permissions
 */
module.exports.botPermissions = () => {
  return async (ctx) => {
    const perms = ctx.command.permissions;
    if (!perms || perms.length === 0) return true;

    const hasPerms = perms.every((perm) => ctx.hasPerms(perm));
    if (hasPerms) return true;

    throw new Error(getLang('NO_BOT_PERMS', ctx.command.permissions.join(', ')))
  };
};

/**
 * check if a user is owner
 */
module.exports.owner = () => {
  return (ctx) => {
    if (ctx.command.owner) throw new Error(getLang('OWNER_COMMAND'))
    return true;
  };
}