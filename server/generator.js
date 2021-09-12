const planet = require('./planet')
const db = require('./db')
const { RateLimiterMemory } = require('rate-limiter-flexible')
const pinataSDK = require('@pinata/sdk')
var ergolib = require('ergo-lib-wasm-nodejs')
var sha256File = require('sha256-file')
var superagent = require('superagent')
const { response } = require('express')

const pinata = pinataSDK("0a39a3cc2311bee7ee80", process.env.PINATA_SDK_SECRET);

const opts = {
  points: 5,
  duration: 5, // Per second
};

const rateLimiter = new RateLimiterMemory(opts);

function getBackgroundRarity(){
  const rand = Math.random()
  if(rand > 0.95) {
    return "#ff660d"
  } else if(rand > 0.8) {
    return "#7f037b"
  } else {
    return "#0744a6"
  }
}

function encodeToRegister(str) {
  let byteArray = (new TextEncoder()).encode(str)
  let reg = ergolib.Constant.from_byte_array(byteArray).encode_to_base16()

  return reg
}

function filePathToRegister(path) {
  let hash = sha256File(path)
  return encodeToRegister(hash)
}

async function getPaymentForAddress(address) {
  return (await superagent.get('http://localhost:9052/wallet/transactions').set('api_key','75Y1fULtMlvCO3pY')).body.find(t => t.outputs.find(o => o.address === address))
}

module.exports = {
  async generatePlanet(id, seed, filename, background) {
    return rateLimiter.consume(id, 1) //points
      .then(async (rateLimiterRes) => {
        return planet.run(seed, "/tmp", filename, background)
        
      })
      .catch(async (rateLimiterRes) => {
        return { busy: true }
      });
  },
  async processInner(address, seed, boxId) {
    
    const reservation = await db.selectReservationsByAddressAndSeed(address, seed);
    if (reservation.length > 0) {
      if (reservation.length > 1) {
        throw Error("SHould not be more than one reservation per seed!");
      } else {
        const result = await this.generatePlanet(1, seed, `${reservation[0].id}`, getBackgroundRarity());
        let pinataReslut = await pinata.pinFromFS(result.path, {
          pinataOptions: { wrapWithDirectory: true },
        });
  
        console.log("Pinata pin pinataReslut");
        console.dir(pinataReslut);

        const url = `https://ipfs.io/ipfs/${pinataReslut.IpfsHash}/${result.path.replace("/tmp/","")}`;
        console.log("url",url)

        const metadata = {
          "721": {
            "SigmaWorlds": {
              series: "Earth Worlds",
              seed,
              creator: address
            }
          }
        }

        const nodeRequests = {
          "requests": [
            {
              "address": address,
              "ergValue": 1000000,
              "amount": 1,
              "name": `[SigmaWorlds] Earth Worlds: ${seed}`,
              "description": JSON.stringify(metadata),
              "decimals": 0,
              "registers": {
                "R7": "0e020101",
                "R8": filePathToRegister(result.path),
                "R9": encodeToRegister(url)
              }
            }
          ],
          "fee": 2000000
        }

        console.dir(nodeRequests, {depth: 10})

        let res = await superagent.post("http://localhost:9052/wallet/transaction/send")
          .set("api_key", "75Y1fULtMlvCO3pY")
          .send(nodeRequests)
        
        console.log("txn id",res.body)
        return res.body
      }
    } else {
      return {
        status: 0,
        message: `No reservation exists for ${address} ${seed}`,
      };
    }
  },
  async process(address, seed, count = 0) {
    return new Promise(async (resolve,reject) => {
      if(count > 10) {
        reject("Done waiting.")
      } else {
        let payment = await getPaymentForAddress(address)
        if(payment) {
          console.log("GOT PAYMENT")
          console.dir(payment, {depth: 10})
          // resolve(this.processInner(address,seed,count))
          resolve("done")
        } else {
          console.log("NO PAYMENT.")
          setTimeout(() => this.process(address, seed, count + 1), 10000)
        }
      }
    })
    
  },
  async processPayments() {
    let payments = (await superagent.get('http://localhost:9052/wallet/transactions').set('api_key','75Y1fULtMlvCO3pY')).body.filter(t => t.outputs.find(o => o.value === 990000000))
    let processed = await db.allProcessed()
    let unprocessed = payments.filter(p => !processed.find(pr => pr.input_box === p.inputs[0].boxId))
    for(const payment of unprocessed) {
      if(!(await db.alreadyProcessed(payment.inputs[0].boxId))) {
        console.log("payment",payment)
        let paymentTransaction = (await superagent.get(`https://api.ergoplatform.com/api/v1/transactions/${payment.id}`)).body
        let inputBox = paymentTransaction.inputs[0]
        let sendToAddress = inputBox.address
        console.log("sending to",sendToAddress)
        let oldestReservation = await db.oldestReservation(sendToAddress)
        if(oldestReservation) {
          console.log("oldest reservation",oldestReservation)
          let txnId = await this.processInner(oldestReservation.addr, oldestReservation.seed, inputBox.boxId)
          db.setProcessed(sendToAddress, oldestReservation.seed, txnId, inputBox.boxId)
          return;
        } else {
          console.log("No reservation found for ", sendToAddress)
        }
      } else {
        // console.log("already processed", payment.inputs[0].boxId)
      }
    }
  }
}