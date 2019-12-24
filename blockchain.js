import Block from "./block";
export default class Blockchain {
  constructor() {
    this.chain = [Block.genesis()];
  }

  addBlock({ data }) {
    this.chain.push(
      Block.mineBlock({ lastBlock: this.chain.length - 1, data })
    );
  }
}
