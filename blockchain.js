import Block from "./block";
import cryptoHash from "./crypto-hash";
export default class Blockchain {
  constructor() {
    this.chain = [Block.genesis()];
  }

  addBlock({ data }) {
    this.chain.push(
      Block.mineBlock({
        lastBlock: this.chain[this.chain.length - 1],
        data
      })
    );
  }

  static isValidChain(chain) {
    if (JSON.stringify(chain[0]) !== JSON.stringify(Block.genesis()))
      return false;

    for (let i = 1; i < chain.length; i++) {
      const actualLastHash = chain[i - 1].hash;
      const { timeStamp, lastHash, hash, data, nonce, difficulty } = chain[i];
      const lastDifficulty = chain[i - 1].difficulty;
      if (lastHash !== actualLastHash) return false;

      const validBlockHash = cryptoHash(
        timeStamp,
        lastHash,
        data,
        nonce,
        difficulty
      );

      if (hash !== validBlockHash) return false;

      if (Math.abs(lastDifficulty - difficulty) > 1) return false;
    }

    return true;
  }

  replaceChain(chain) {
    if (chain.length <= this.chain.length) {
      console.error("new chain must be longer");
      return;
    }

    if (!Blockchain.isValidChain(chain)) {
      console.error("new chain must be valid");
      return;
    }

    console.log("replaced chain :", chain);
    this.chain = chain;
  }
}
