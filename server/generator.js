const planet = require('./planet')
const { RateLimiterMemory } = require('rate-limiter-flexible')

const opts = {
  points: 1,
  duration: 5, // Per second
};

const rateLimiter = new RateLimiterMemory(opts);

module.exports = {
  async generatePlanet(id, seed, ipAddr) {
    return rateLimiter.consume(id, 1) //points
      .then(async (rateLimiterRes) => {
        return await planet.run(seed, "/tmp")
        
      })
      .catch(async (rateLimiterRes) => {
        return { busy: true }
      });
  }
}