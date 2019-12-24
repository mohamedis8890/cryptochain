import { GENESIS_DATA } from "./config";
import cryptoHash from "./crypto-hash";
class Block {
  constructor({ timeStamp, lastHash, hash, data }) {
    this.timeStamp = timeStamp;
    this.lastHash = lastHash;
    this.hash = hash;
    this.data = data;
  }

  static genesis() {
    return new this(GENESIS_DATA);
  }

  static mineBlock({ lastBlock, data }) {
    const timeStamp = Date.now();
    const lastHash = lastBlock.hash;
    return new this({
      timeStamp,
      lastHash,
      data,
      hash: cryptoHash(timeStamp, lastHash, data)
    });
  }
}

export default Block;
