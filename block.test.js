import Block from "./block";
import { GENESIS_DATA } from "./config";
import cryptoHash from "./crypto-hash";

describe("Block", () => {
  const data = ["blockchain", "data"];
  const hash = "foo-hash";
  const lastHash = "foo-lastHash";
  const timeStamp = "foo-timestamp";
  const block = new Block({ data, hash, lastHash, timeStamp });

  it("should have data, hash, lastHash, timestamp property", () => {
    expect(block.data).toEqual(data);
    expect(block.timeStamp).toEqual(timeStamp);
    expect(hash).toEqual(hash);
    expect(lastHash).toEqual(lastHash);
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
        cryptoHash(lastBlock.hash, data, minedBlock.timeStamp)
      );
    });
  });
});
