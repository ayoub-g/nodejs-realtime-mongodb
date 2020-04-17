const common = require("./common");
const Consumer = require("./consumer");
const compain = new Consumer("campain");
const analytics = new Consumer("analytics", true);
const CartStatus = require("./cartStatus");
demo = async () => {
  try {
    const collection = await common.getCollection("cart");
    const options = { fullDocument: "updateLookup" };
    const pipeline = [{ $match: { "fullDocument.status": CartStatus.SHOP } }];
    const changeSteam = collection.watch(pipeline, options);
    changeSteam.on("change", (event) => {
      analytics.process(event);
    });
    changeSteam.on("error", (err) => {
      console.err(err);
      changeSteam.close();
      throw err;
    });
  } catch (err) {
    console.log(err.stack);
  }
};
demo();
