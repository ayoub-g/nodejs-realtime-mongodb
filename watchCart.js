const common = require("./common");
const Consumer = require("./consumer");
const analytics = new Consumer("analytics", true);
const CartStatus = require("./cartStatus");
watchCart = async () => {
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
module.exports = watchCart;
