import Block from "./block";
import Blockchain from "./blockchain";

describe("blockchain", () => {
  const blockchain = new Blockchain();
  it("contains a `chain` Array", () => {
    expect(blockchain.chain instanceof Array).toBe(true);
  });

  it("starts with the genesis block", () => {
    const genesis = Block.genesis();
    expect(blockchain.chain[0]).toEqual(genesis);
  });

  it("adds a new block to the chain", () => {
    const newData = "foo bar";
    blockchain.addBlock({ data: newData });
    expect(blockchain.chain[blockchain.chain.length - 1].data).toEqual(newData);
  });
});
