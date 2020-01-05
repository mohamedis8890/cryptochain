import { createClient } from "redis";

const CHANNELS = {
  TEST: "TEST",
  BLOCKCHAIN: "BLOCKCHAIN"
};

export default class PubSub {
  constructor({ blockchain }) {
    this.blockchain = blockchain;

    this.subscriber = createClient();
    this.publisher = createClient();

    this.subscribeToChannels();

    this.subscriber.on("message", (channel, message) =>
      this.handleMessage(channel, message)
    );
  }

  handleMessage(channel, message) {
    console.log(
      `Message recieved. Channel : ${channel}. Message : ${message}.`
    );

    if (channel === CHANNELS.BLOCKCHAIN) {
      this.blockchain.replaceChain(JSON.parse(message));
    }
  }

  subscribeToChannels() {
    Object.values(CHANNELS).forEach(channel =>
      this.subscriber.subscribe(channel)
    );
  }

  publish({ channel, message }) {
    this.subscriber.unsubscribe(channel, () => {
      this.publisher.publish(channel, message, () => {
        this.subscriber.subscribe(channel);
      });
    });
  }

  broadcastChain(blockchain) {
    this.publish({
      channel: CHANNELS.BLOCKCHAIN,
      message: JSON.stringify(this.blockchain.chain)
    });
  }
}

// const testPubSub = new PubSub();
// setTimeout(() => testPubSub.publisher.publish(CHANNELS.TEST, "foo"), 1000);
