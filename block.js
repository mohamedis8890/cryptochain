import { GENESIS_DATA, MINE_RATE } from "./config";
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

  static adjustDifficulty({ originalBlock, timeStamp }) {
    const { difficulty } = originalBlock;
    if (difficulty < 1) return 1;
    if (timeStamp - originalBlock.timeStamp > MINE_RATE) return difficulty - 1;

    return difficulty + 1;
  }

  static mineBlock({ lastBlock, data }) {
    let timeStamp, hash;
    let { difficulty } = lastBlock;
    let nonce = 0;
    const lastHash = lastBlock.hash;

    do {
      nonce++;
      hash = cryptoHash(timeStamp, lastHash, data, difficulty, nonce);
      timeStamp = Date.now();
      difficulty = Block.adjustDifficulty({
        originalBlock: lastBlock,
        timeStamp
      });
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
