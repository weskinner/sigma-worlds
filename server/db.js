const { Pool } = require('pg')
const pool = new Pool()


const status = {
  success: 1,
  error: 0
}

async function withClient(f) {
  const client = await pool.connect()
  const result = f(client)
  client.release()
  return result
}

module.exports = {
  status,
  async createReservation(seed,tag) {
    return await withClient(async client => {
      const existingSeed = await client.query("select * from reservations where seed = $1", [seed])
      if(existingSeed.rows.length > 0) {
        return {
          status: status.error,
          message: `seed ${seed} is already reserved.`
        }
      } else {
        const idResult = await client.query("insert into reservations (addr,tag) values ($1,$2) returning id;", [seed, tag])
        return {
          status: status.success,
          id: idResult.rows[0].id
        }
      }
    })
  },
  async selectReservationById(id) {
    return await withClient(async client => {
      const result = await client.query("select * from reservations where id = $1", [id])
      if(result.rows.length > 1) throw "There shouldn't be more than one row"
      return result.rows[0]
    })
  },
  async selectReservationsByAddr(addr) {
    return await withClient(async client => {
      const results = await client.query("select * from reservations where addr = $1", [addr])
      return results.rows || []
    })
  },
}