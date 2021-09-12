const { Pool } = require('pg')
const pool = new Pool()


const status = {
  success: 1,
  error: 0,
  reserved: 2,
}

async function withClient(f) {
  const client = await pool.connect()
  const result = f(client)
  client.release()
  return result
}

module.exports = {
  status,
  async createReservation(seed,address) {
    return withClient(async client => {
      const existingSeed = await client.query("select * from reservations where seed = $1", [seed])
      if(existingSeed.rows.length > 0) {
        return {
          status: status.error,
          message: `seed ${seed} is already reserved.`
        }
      } else {
        const idResult = await client.query("insert into reservations (addr,seed) values ($1,$2) returning id;", [address, seed])
        return {
          status: status.success,
          id: idResult.rows[0].id
        }
      }
    })
  },
  async selectReservationById(id) {
    return withClient(async client => {
      const result = await client.query("select * from reservations where id = $1", [id])
      if(result.rows.length > 1) throw "There shouldn't be more than one row"
      return result.rows[0]
    })
  },
  async selectReservationsByAddr(addr) {
    return withClient(async client => {
      const results = await client.query("select * from reservations where addr = $1", [addr])
      return results.rows || []
    })
  },
  async selectReservationsBySeed(seed) {
    return withClient(async client => {
      const results = await client.query("select * from reservations where seed = $1", [seed])
      return results.rows || []
    })
  },
  async selectReservationsByAddressAndSeed(address,seed) {
    return withClient(async client => {
      const results = await client.query("select * from reservations where seed = $1 and addr = $2", [seed, address])
      return results.rows || []
    })
  },
  async oldestReservation(address) {
    return withClient(async client => {
      const results = await client.query("select * from reservations where addr = $1 and processed_txn is null order by created_on limit 1", [address])
      return results.rows.length > 0 ? results.rows[0] : undefined
    })
  },
  async setProcessed(address,seed,txnId,inputBox) {
    return withClient(async client => {
      return await client.query("update reservations set processed_on = current_timestamp,processed_txn=$3,input_box=$4 where seed = $1 and addr = $2 ", [seed, address, txnId, inputBox])
    })
  },
  async alreadyProcessed(boxId) {
    return withClient(async client => {
      const results = await client.query("select * from reservations where input_box = $1 limit 1", [boxId])
      return results.rows.length > 0
    })
  },
  async allProcessed() {
    return withClient(async client => {
      const results = await client.query("select * from reservations where processed_on is not null", [])
      return results.rows
    })
  },
}