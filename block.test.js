import Block from "./block";
import { GENESIS_DATA } from "./config";
import cryptoHash from "./crypto-hash";

describe("Block", () => {
  const data = ["blockchain", "data"];
  const hash = "foo-hash";
  const lastHash = "foo-lastHash";
  const timeStamp = "foo-timestamp";
  const difficulty = 1;
  const nonce = 0;
  const block = new Block({
    data,
    hash,
    lastHash,
    timeStamp,
    difficulty,
    nonce
  });

  it("should have data, hash, lastHash, timestamp, nonce, difficulty property", () => {
    expect(block.data).toEqual(data);
    expect(block.timeStamp).toEqual(timeStamp);
    expect(block.hash).toEqual(hash);
    expect(block.difficulty).toEqual(difficulty);
    expect(block.nonce).toEqual(nonce);
    expect(block.lastHash).toEqual(lastHash);
  });

  describe("genesis()", () => {
    const genesisBlock = Block.genesis();
    it("returns a Block instance", () => {
      expect(genesisBlock instanceof Block).toBe(true);
    });

    it("returns the genesis data", () => {
      expect(genesisBlock).toEqual(GENESIS_DATA);
    });
  });

  describe("mineBlock()", () => {
    const lastBlock = Block.genesis();
    const data = "mined data";
    const minedBlock = Block.mineBlock({ lastBlock, data });

    it("returns a Block instance", () => {
      expect(minedBlock instanceof Block).toBe(true);
    });

    it("sets `lastHsh` of the last block to the `hash` of the mined block", () => {
      expect(minedBlock.lastHash).toEqual(lastBlock.hash);
    });

    it("sets the `data`", () => {
      expect(minedBlock.data).toEqual(data);
    });

    it("sets a `timeStamp`", () => {
      expect(minedBlock.timeStamp).not.toEqual(undefined);
    });

    it("sets a sha256-crypted `hash` on the mined block based on proper inputs", () => {
      expect(minedBlock.hash).toEqual(
        cryptoHash(
          lastBlock.hash,
          data,
          minedBlock.timeStamp,
          minedBlock.nonce,
          minedBlock.difficulty
        )
      );
    });

    it("produces a `hash` that meets the difficulty specified", () => {
      expect(minedBlock.hash.substring(0, minedBlock.difficulty)).toEqual(
        "0".repeat(minedBlock.difficulty)
      );
    });
  });
});
