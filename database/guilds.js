const { Cache } = require("discord-rose/dist/utils/Cache")

const GuildModel = require('./models/guild')

module.exports = class GuildDB {
  cache = new Cache(15 * 60 * 1000);

  async getGuild(id) {
    const fromCache = this.cache.get(id);
    if (fromCache) return fromCache;

    const fromDB = await GuildModel.findOne({ id }).lean();
    if (fromDB) {
      this.cache.set(id, fromDB);
      return fromDB;
    }

    return {
      id,
      prefix: '@'
    }
  }

  async createGuild(id) {
    await GuildModel.create({ id });
    return this.getGuild(id)
  }

  updateGuild(id) {

  }
}