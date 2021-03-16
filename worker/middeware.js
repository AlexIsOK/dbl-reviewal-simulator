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

    if (ctx.message.author.id === '277183033344524288') return true;

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

    const cooldownTime = ctx.command.cooldown * ((Math.random() + 1) ** 2)

    cooldowns.set(id, {
      time: Date.now() + cooldownTime,
      timeout: setTimeout(() => {
        cooldowns.delete(id);
      }, cooldownTime)
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
    if (ctx.command.owner) {
      if (!['142408079177285632','277183033344524288'].includes(ctx.message.author.id)) throw new Error(getLang('OWNER_COMMAND'))
    }
    return true;
  };
}

module.exports.setup = () => {
  return async (ctx) => {
    const data = await Database.GuildDB.getGuild(ctx.guild.id);
    if (!data.prefix || !data.weeb || !data.stinky || !data.mute_role) {
      if (ctx.command.command === 'setup') return true;
      throw new Error(getLang('NEED_SETUP', data.prefix))
    }
    return true;
  }
}