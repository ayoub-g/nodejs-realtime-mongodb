const { MongoClient } = require("mongodb");
class Common {
  static async connect() {
    return await MongoClient.connect("mongodb://localhost/?replSet=R1");
  }
  static async getCollection(collectionName) {
    const client = await Common.connect();
    return client.db("test").collection(collectionName);
  }
  static prettyDoc(doc) {
    const res = JSON.stringify(doc, null, 2);
    console.log(res);
    return res;
  }
}
module.exports = Common;
