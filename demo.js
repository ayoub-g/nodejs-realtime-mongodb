const common = require("./common");
const Consumer = require("./consumer");
const compain = new Consumer("campain");
demo = async () => {
  try {
    const collection = await common.getCollection("cart");
    const cursor = await collection.aggregate([{ $changeStream: {} }]);

    while (await cursor.hasNext()) {
      const event = await cursor.next();
      compain.process(event);
    }
  } catch (err) {
    console.log(err);
  }
};
demo();
