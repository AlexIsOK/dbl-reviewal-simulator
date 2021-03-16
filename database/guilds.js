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
      prefix: '@',
      weeb: null,
      stinky: null,
      mute_role: null
    }
  }

  async updateGuild(guildData) {
    this.cache.set(guildData.id, guildData) 
    await GuildModel.findOneAndUpdate({ id: guildData.id }, guildData, { upsert: true }).lean()
    return this.getGuild(guildData.id)
  }

  async getPrefix(id) {
    const data = await this.getGuild(id);
    return data.prefix
  }

  async getWeeb(id) {
    const data = await this.getGuild(id);
    return data.weeb
  }

  async getStinky(id) {
    const data = await this.getGuild(id);
    return data.stinky
  }

  async getMuteRole(id) {
    const data = await this.getGuild(id);
    return data.mute_role
  }

  async setPrefix(id, prefix) {
    const data = await this.getGuild(id);
    data.prefix = prefix;
    return this.updateGuild(data);
  }

  async setWeeb(id, weeb) {
    const data = await this.getGuild(id);
    data.weeb = weeb;
    return this.updateGuild(data);
  }

  async setStinky(id, stinky) {
    const data = await this.getGuild(id);
    data.stinky = stinky;
    return this.updateGuild(data);
  }

  async setMuteRole(id, mute_role) {
    const data = await this.getGuild(id);
    data.mute_role = mute_role;
    return this.updateGuild(data);
  }
}