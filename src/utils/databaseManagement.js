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

export { returnMongoCollection };
