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

const deleteInsertMongo = (collection, data, deleteQuery = {}) => {
  collection
    .deleteOne(deleteQuery)
    .then((result) => {
      console.log(`Deleted ${result.deletedCount} documents.`);
      collection
        .insertOne(data)
        .then(() => {
          console.log(
            `Mongo db document inserted to collection ${collection.namespace}!`
          );
        })
        .catch((err1) => {
          console.log(`Failed to insert documents: ${err1}`);
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

export { returnMongoCollection, deleteInsertMongo, findMongo };
