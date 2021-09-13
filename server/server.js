const express = require("express");
const cors = require("cors");
const generator = require("./generator");
const db = require("./db");
const fs = require("fs");
const port = 5000;



const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/world", async (req, res) => {
  console.log(req.query);
  const result = await generator.generatePlanet(
    1,
    req.query.seed || "noseed",
    "/tmp"
  );
  if (result.busy) {
    res.json(result);
  } else {
    console.log(fs.statSync(result.path));
    res.sendFile(result.path);
  }
});

app.post("/reserve", async (req, res) => {
  console.log("reserve", req.body);
  const { address, seed } = req.body;
  const result = await db.createReservation(seed, address);
  res.json(result);
});

app.post("/process", async (req, res) => {
  console.log("process", req.body);
  const { address, seed } = req.body;
  const result = await process(address, seed);
});

app.get("/allProcessed", async(req,res) => {
  res.json(await db.allProcessed())
})

app.listen(port, '0.0.0.0', () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
