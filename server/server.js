const express = require('express')
const cors = require('cors')
const generator = require('./generator')
const db = require('./db')
const fs = require('fs')
const port = 5000

const app = express()
app.use(cors())

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/world', async (req, res) => {
  console.log(req.query)
  const result = await generator.generatePlanet(req.ip, req.query.seed || "noseed", "/tmp")
  if(result.busy) {
    res.send(result)
  } else {
    console.log(fs.statSync(result.path))
    res.sendFile(result.path)
  }
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})