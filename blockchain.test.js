import Block from "./block";
import Blockchain from "./blockchain";

describe("blockchain", () => {
  let blockchain, newBlockchain, originalChain;
  beforeEach(() => {
    blockchain = new Blockchain();
    newBlockchain = new Blockchain();

    originalChain = blockchain.chain;
  });
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

  describe("isValidChain()", () => {
    describe("when the chain doesnot start with the genesis block", () => {
      it("returns false", () => {
        blockchain.chain[0] = { data: "fake-chain" };
        expect(Blockchain.isValidChain(blockchain.chain)).toBe(false);
      });
    });

    describe("when the chain starts with the genesis block and has multiple blocks", () => {
      beforeEach(() => {
        blockchain.addBlock({ data: "bears" });
        blockchain.addBlock({ data: "beats" });
        blockchain.addBlock({ data: "beans" });
      });
      describe("and a `lastHash` reference has changed", () => {
        it("returns false", () => {
          blockchain.chain[2].lastHash = "fake lastHash";
          expect(Blockchain.isValidChain(blockchain.chain)).toBe(false);
        });
      });

      describe("and contains a block has an invalid field", () => {
        it("returns false", () => {
          blockchain.chain[2].data = "fake data";
          expect(Blockchain.isValidChain(blockchain.chain)).toBe(false);
        });
      });

      describe("and all its blocks are valid", () => {
        it("returns true", () => {
          expect(Blockchain.isValidChain(blockchain.chain)).toBe(true);
        });
      });
    });
  });

  describe("replaceChain()", () => {
    describe("when new chain is not longer", () => {
      it("does not replace the chain", () => {
        newBlockchain.chain[0] = { new: "chain" };

        blockchain.replaceChain(newBlockchain.chain);
        expect(blockchain.chain).toEqual(originalChain);
      });
    });

    describe("when the new chain is longer", () => {
      beforeEach(() => {
        newBlockchain.addBlock({ data: "bears" });
        newBlockchain.addBlock({ data: "beats" });
        newBlockchain.addBlock({ data: "beans" });
      });

      describe("and the new chain is not vaild", () => {
        it("does not replace the chain", () => {
          newBlockchain.chain[2].hash = "fakehash";
          blockchain.replaceChain(newBlockchain.chain);
          expect(blockchain.chain).toEqual(originalChain);
        });
      });

      describe("and the new chain is valid", () => {
        it("replaces the chain", () => {
          blockchain.replaceChain(newBlockchain.chain);
          expect(blockchain.chain).toEqual(newBlockchain.chain);
        });
      });
    });
  });
});
