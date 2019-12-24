import { GENESIS_DATA } from "./config";
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
    return new this({
      timeStamp: Date.now(),
      lastHash: lastBlock.hash,
      data
    });
  }
}

export default Block;
