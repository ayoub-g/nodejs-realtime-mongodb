const common = require("./common");
class Consumer {
  constructor(topic, detailed = true) {
    this.topic = topic;
    this.detailed = detailed;
  }
  process(evt) {
    console.log(
      `**** Processor ${this.topic} got operation type ${evt.operationType} ****`
    );
    if (this.detailed) {
      common.prettyDoc(evt.fullDocument);
    }
  }
}
module.exports = Consumer;
