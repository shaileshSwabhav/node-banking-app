const Redis = require("redis")

const redisClient = Redis.createClient()
redisClient.connect()
redisClient.on('error', err => console.log('Redis Client Error', err))

const getCacheData = async (key) => {
  const response = await redisClient.get(key, async (error, data) => {
    console.log("iniside get redis client");
    if (error) {
      console.error(error);
    }
    if (data) {
      console.log("inside redis data");
      return JSON.parse(data)
    }
  })
  return response
}

module.exports = { redisClient, getCacheData }
