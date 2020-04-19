const common = require("./common");
class WatchBooking {
  constructor(consultantId) {
    this.analytics = this.consultantId = consultantId;
  }
  initConsumer(consumer) {
    this.analytics = consumer;
  }
  async watch() {
    try {
      const collection = await common.getCollection("avodb", "booking");
      const options = { fullDocument: "updateLookup" };
      const pipeline = [{ $match: { "fullDocument._id": this.consultantId } }];
      const changeSteam = collection.watch(pipeline, options);
      changeSteam.on("change", (event) => {
        this.analytics.process(event);
      });
      changeSteam.on("error", (err) => {
        console.err(err);
        changeSteam.close();
        throw err;
      });
    } catch (err) {
      console.log(err.stack);
    }
  }
}
module.exports = WatchBooking;
