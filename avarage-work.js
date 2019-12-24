import Blockchain from "./blockchain";

const blockchain = new Blockchain();
blockchain.addBlock({ data: "initial block" });

let avarage, timeDiff, prevTimeStamp, nextTimeStamp, nextBlock;
const times = [];

for (let i = 0; i < 10000; i++) {
  prevTimeStamp = blockchain.chain[blockchain.chain.length - 1].timeStamp;

  blockchain.addBlock({ data: `Block #${i}` });
  nextBlock = blockchain.chain[blockchain.chain.length - 1];
  nextTimeStamp = nextBlock.timeStamp;
  timeDiff = nextTimeStamp - prevTimeStamp;
  times.push(timeDiff);

  avarage = times.reduce((total, num) => total + num) / times.length;
  console.log(
    `Mine Time :${timeDiff}. Difficulty :${nextBlock.difficulty}. Avarage Time :${avarage}`
  );
}
