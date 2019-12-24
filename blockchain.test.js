import Block from "./block";
import Blockchain from "./blockchain";
import cryptoHash from "./crypto-hash";

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

      describe("and contains a block with jumped difficulty", () => {
        it("returns false", () => {
          const lastBlock = blockchain.chain[blockchain.chain.length - 1];
          const timeStamp = Date.now();
          const lastHash = lastBlock.hash;
          const data = [];
          const nonce = 0;
          const difficulty = lastBlock.difficulty - 3;
          const hash = cryptoHash(timeStamp, lastHash, data, nonce, difficulty);
          const badBlock = new Block({
            timeStamp,
            lastHash,
            hash,
            data,
            nonce,
            difficulty
          });
          blockchain.chain.push(badBlock);
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
    let errorMock, logMock;
    beforeEach(() => {
      errorMock = jest.fn();
      logMock = jest.fn();
      global.console.error = errorMock;
      global.console.log = logMock;
    });

    describe("when new chain is not longer", () => {
      beforeEach(() => {
        newBlockchain.chain[0] = { new: "chain" };
        blockchain.replaceChain(newBlockchain.chain);
      });

      it("does not replace the chain", () => {
        expect(blockchain.chain).toEqual(originalChain);
      });

      it("logs an error", () => {
        expect(errorMock).toHaveBeenCalled();
      });
    });

    describe("when the new chain is longer", () => {
      beforeEach(() => {
        newBlockchain.addBlock({ data: "bears" });
        newBlockchain.addBlock({ data: "beats" });
        newBlockchain.addBlock({ data: "beans" });
      });

      describe("and the new chain is not vaild", () => {
        beforeEach(() => {
          newBlockchain.chain[2].hash = "fakehash";
          blockchain.replaceChain(newBlockchain.chain);
        });

        it("does not replace the chain", () => {
          expect(blockchain.chain).toEqual(originalChain);
        });

        it("logs an error", () => {
          expect(errorMock).toHaveBeenCalled();
        });
      });

      describe("and the new chain is valid", () => {
        beforeEach(() => {
          blockchain.replaceChain(newBlockchain.chain);
        });

        it("replaces the chain", () => {
          expect(blockchain.chain).toEqual(newBlockchain.chain);
        });

        it("logs about chain replacement", () => {
          expect(logMock).toHaveBeenCalled();
        });
      });
    });
  });
});
