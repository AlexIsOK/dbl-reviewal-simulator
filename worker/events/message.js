const { Worker } = require('discord-rose');
const { APIMessage } = require('discord-api-types')

/**
 * @type {{ event: string, exec: (worker: Worker, message: APIMessage) => {}}}
 */
module.exports = {
  event: 'MESSAGE_CREATE',
  exec: (worker, message) => {

  }
}
