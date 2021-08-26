const { Client } = require('pg')
const db = require('./db')
const generator = require('./generator')

it("reservation sql works", async () => {
  const result = await db.createReservation("asdfasdfasdfasdf","william")
  const id = result.id
  const selectByIdResult = await db.selectReservationById(id)
  const selectByAddrResult = await db.selectReservationsByAddr(selectByIdResult.id)
  
  let client = new Client()
  await client.connect()
  const deleteResult = await client.query("delete from reservations;")
  await client.end()
})

it("rate limits", async () => {
  var counter = 0
  for (let index = 0; index < 3; index++) {
    const result = await generator.generatePlanet("asdfasdffasdf","0.0.0.0")
    if(result.busy) {
      console.log("busy try again later")
    } else {
      console.log("finished")
    }
    
  }
})