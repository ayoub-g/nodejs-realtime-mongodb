const common = require("./common");
const Consumer = require("./consumer");
const compain = new Consumer("campain");
demo = async () => {
  try {
    const collection = await common.getCollection("cart");
    const cursor = await collection.aggregate([
      {
        $changeStream: {
          fullDocument: "updateLookup", // include the full document on  update operation
        },
      },
      {
        $match: {
          "fullDocument.customer": { $exists: true },
          operationType: "update",
        },
      },
      { $project: { "fullDocument.note": 0 } },
    ]);

    while (await cursor.hasNext()) {
      const event = await cursor.next();
      compain.process(event);
    }
  } catch (err) {
    console.log(err);
  }
};
demo();
