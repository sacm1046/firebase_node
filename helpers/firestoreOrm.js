const { db } = require('../database/db');
const firestore = db.firestore();
const { storage } = require('../database/db');
/**
 * Method to get all documents in a specific collection
 * @method
 * @param collection - collection name
 */
const getAll = async (collection) => {
  let list = [];
  (await firestore.collection(collection).get()).forEach((doc) => {
    const item = {
      ...doc.data(),
      id: doc.id,
    };
    list.push(item);
  });
  return list;
};

/**
 * Method to get and specific document in a specific collection
 * @method
 * @param collection - collection name
 * @param id - document id
 */
const getOne = async (collection, id) => {
  let item = await firestore.collection(collection).doc(id).get();
  return item.data();
};

/**
 * Method to create a document in a specific collection
 * @method
 * @param collection - collection name
 * @param body - body request to create
 */
const create = async (collection, body) => {
  await firestore.collection(collection).doc().set(body);
};

/**
 * Method to update an specific document in a specific collection
 * @method
 * @param collection - collection name
 * @param id - document id
 * @param body - body request to update
 */
const update = async (collection, id, body) => {
  await firestore.collection(collection).doc(id).update(body);
};

/**
 * Method to delete an specific document in a specific collection
 * @method
 * @param collection - collection name
 * @param id - document id
 */
const destroy = async (collection, id) => {
  await firestore.collection(collection).doc(id).delete();
};

module.exports = {
  getAll,
  getOne,
  create,
  update,
  destroy,
};
