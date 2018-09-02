const mngs = require('mongoose')
const redis = require('redis');
const util = require('util');
const redisUrl = 'redis://127.0.0.1:6379';
const client = redis.createClient(redisUrl);
client.hget = util.promisify(client.hget);
const exec = mngs.Query.prototype.exec;

mngs.Query.prototype.exec = async function () {
    if (!this.useCache)
        return exec.apply(this, arguments);
    console.log('mngs.Query.prototype.exec');
    // console.log(this.getQuery());
    // console.log(this.mongooseCollection.name)
    const key = JSON.stringify({...this.getQuery(), collection: this.mongooseCollection.name})
    // console.log(key)
    const data_cache = await client.hget(this.hashKey, key)
    if (data_cache) {
        const doc = JSON.parse(data_cache);
        Array.isArray(doc) ? doc.map(d => new this.model(d)) : new this.model(doc);
        return doc;
    }
    const data = await exec.apply(this, arguments);
    // console.log(data)
    client.hset(this.hashKey, key, JSON.stringify(data))

    return data;

}

mngs.Query.prototype.cache = function (options = {}) {
    this.useCache = true;
    this.hashKey = JSON.stringify(options.key || '');
    return this;
}

module.exports = {
    clearHash(hashKey) {
        client.del(JSON.stringify(hashKey))
    }
}