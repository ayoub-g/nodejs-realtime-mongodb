const { MongoClient } = require("mongodb");
class Common {
  static async connect() {
    // how to choose the replica set ? how to get the right adress
    return await MongoClient.connect("mongodb://localhost/?replSet=R1");
  }
  static async getCollection(db, collectionName) {
    const client = await Common.connect();
    return client.db(db).collection(collectionName);
  }
  static prettyDoc(doc) {
    const res = JSON.stringify(doc, null, 2);
    console.log(res);
    return res;
  }
}
module.exports = Common;
