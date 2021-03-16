const { Schema, model } = require('mongoose')

const guildSchema = new Schema({
  id: { type: string, unique: true, required: true },
  prefix: { type: String, default: '@' },
})

module.exports = model('guilds', guildSchema)