import { GENESIS_DATA } from "./config";
import cryptoHash from "./crypto-hash";
class Block {
  constructor({ timeStamp, lastHash, hash, data, nonce, difficulty }) {
    this.timeStamp = timeStamp;
    this.lastHash = lastHash;
    this.hash = hash;
    this.data = data;
    this.nonce = nonce;
    this.difficulty = difficulty;
  }

  static genesis() {
    return new this(GENESIS_DATA);
  }

  static mineBlock({ lastBlock, data }) {
    let timeStamp, hash;
    const lastHash = lastBlock.hash;
    const { difficulty } = lastBlock;
    let nonce = 0;

    do {
      nonce++;
      hash = cryptoHash(timeStamp, lastHash, data, difficulty, nonce);
      timeStamp = Date.now();
    } while (hash.substring(0, difficulty) !== "0".repeat(difficulty));

    return new this({
      timeStamp,
      lastHash,
      data,
      difficulty,
      nonce,
      hash
    });
  }
}

export default Block;
