const { APIUser } = require('discord-api-types')

/**
 * Format the time to make it look nice
 * @param {number} time How long, in miliseconds
 * 
 * @example formatTime(100000) => "1 minute and 39 seconds"
 */
function formatTime(time) {
  let hours = 0;
  let minutes = 0;
  let seconds = 0;

  // Hours
  while (time > 3600000) {
    hours++;
    time = time - 3600000;
  }

  // Minutes
  while (time > 60000) {
    minutes++;
    time = time - 60000;
  }

  // Seconds
  while (time > 1000) {
    seconds++;
    time = time - 1000;
  }

  return `${hours ? `${hours} hour${hours > 1 ? 's' : ''}, ` : ''}${minutes ? `${minutes} minute${minutes > 1 ? 's' : ''}${hours ? ', and' : ' and'} ` : ''}${seconds > 1 ? seconds : 1} second${seconds > 1 ? 's' : ''}`;
}

/**
 * Bro this is a cool error that won't be mean to me
 */
class NonFatalError extends Error {
  nonFatal = true;
}

/**
 * Get the user's avatar
 * @param user The user to get the avatar from
 * @param {APIUser} user The user
 * @param {string} type The type of image
 * @param {number} size The size of the image
 */
function getAvatar(user, type = 'png', size = 128) {
  if (user.avatar) return `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.${type}?size=${size}`;
  return `https://cdn.discordapp.com/embed/avatars/${BigInt(user.discriminator) % BigInt(5)}.png`;
}

/**
 * Get the lang response
 */
function getLang(type, ...args) {
  const langs = [require('./langs/en-us.json'), require('./langs/es-es.json'), require('./langs/undefined.json')];
  const lang = langs[Math.floor(Math.random() * langs.length)]
  if (!lang[type]) throw new Error(`Language Error: "${type}" not set for ${lang.name}`)
  return formatString(lang[type], ...args)
}

function formatString(string, ...args) {
  return string.replace(/{(\d+)}/g, function (match, number) {
    return typeof args[number] != 'undefined' ? args[number] : match
  });
}

module.exports = { formatTime, NonFatalError, getAvatar, getLang }