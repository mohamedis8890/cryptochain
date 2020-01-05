import bodyParser from "body-parser";
import express from "express";
import request from "request";

import PubSub from "./pubsub";
import Blockchain from "./blockchain";

const DEFAULT_PORT = 3000;
const ROOT_NODE_ADDRESS = `http://localhost:${DEFAULT_PORT}`;

const app = express();
app.use(bodyParser.json());

const blockchain = new Blockchain();
const pubsub = new PubSub({ blockchain });

app.get("/api/blocks", (req, res) => {
  res.json(blockchain.chain);
});

app.post("/api/mine", (req, res) => {
  const { data } = req.body;
  blockchain.addBlock({ data });
  pubsub.broadcastChain();

  res.redirect("/api/blocks");
});

let PEER_PORT;

if (process.env.GENERATE_PEER_PORT === "true") {
  PEER_PORT = DEFAULT_PORT + Math.ceil(Math.random() * 1000);
}

const PORT = PEER_PORT || DEFAULT_PORT;

let syncChains = () => {
  request(`${ROOT_NODE_ADDRESS}/api/blocks`, (error, response, body) => {
    if (!error && response.statusCode === 200) {
      let rootChain = JSON.parse(body);
      console.log("Replace chain on a sync with", rootChain);
      blockchain.replaceChain(rootChain);
    }
  });
};

app.listen(PORT, () => {
  console.log(`App is listening on localhost:${PORT}`);

  if (PORT !== DEFAULT_PORT) syncChains();
});
