import {
  Stitch,
  RemoteMongoClient,
  AnonymousCredential,
} from "mongodb-stitch-browser-sdk";

const client = Stitch.initializeDefaultAppClient("hanabi-online-rbjkd");

const returnMongoCollection = (collectionName) => {
  client.auth.loginWithCredential(new AnonymousCredential()).then((user) => {
    console.log(`Logged in as anonymous user with id ${user.id}`);
  });
  const db = client
    .getServiceClient(RemoteMongoClient.factory, "mongodb-atlas")
    .db("hanabi");

  return db.collection(collectionName);
};

const deleteInsertMongo = async (collection, data, deleteQuery = {}) => {
  return collection
    .deleteOne(deleteQuery)
    .then((result) => {
      console.log(`Deleted ${result.deletedCount} documents.`);
      return collection
        .insertOne(data)
        .then(() => {
          console.log(
            `Mongo db document inserted to collection ${collection.namespace}!`
          );
          return true;
        })
        .catch((err1) => {
          console.log(`Failed to insert documents: ${err1}`);
          return false;
        });
    })
    .catch((err) => console.log(`Failed to delete documents: ${err}`));
};

const findMongo = async (collection, findQuery = {}) => {
  return collection
    .find(findQuery)
    .asArray()
    .then((docs) => docs);
};

const pushToArrayMongo = async (collection, findQuery, pushKeyValuePair) => {
  return collection
    .updateOne(findQuery, { $push: pushKeyValuePair })
    .then(() => true)
    .catch((err) => {
      console.log("Error pushing to array.");
      return false;
    });
};

export {
  returnMongoCollection,
  deleteInsertMongo,
  findMongo,
  pushToArrayMongo,
};
