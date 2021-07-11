const { db } = require('../database/db');
const firestore = db.firestore();
const { storage } = require('../database/db');
const { STORAGE_BUCKET } = process.env;
/**
 * Method to get all documents in a specific collection
 * @method
 * @param collection - collection name
 */
const getAll = async (collection) => {
  try {
    let list = [];
    (await firestore.collection(collection).get()).forEach((doc) => {
      const item = {
        ...doc.data(),
        id: doc.id,
      };
      list.push(item);
    });
    return [list, null];
  } catch (error) {
    return [null, error];
  }
};

/**
 * Method to get and specific document in a specific collection
 * @method
 * @param collection - collection name
 * @param id - document id
 */
const getOne = async (collection, id) => {
  try {
    let item = await firestore.collection(collection).doc(id).get();
    return [item.data(), null];
  } catch (error) {
    return [null, error];
  }
};

/**
 * Method to create a document in a specific collection
 * @method
 * @param collection - collection name
 * @param body - body request to create
 */
const create = async (collection, body) => {
  try {
    await firestore.collection(collection).doc().set(body);
    return ['Creación exitosa', null];
  } catch (error) {
    return [null, error];
  }
};

/**
 * Method to update an specific document in a specific collection
 * @method
 * @param collection - collection name
 * @param id - document id
 * @param body - body request to update
 */
const update = async (collection, id, body) => {
  try {
    await firestore.collection(collection).doc(id).update(body);
    return ['Edición exitosa', null];
  } catch (error) {
    return [null, error];
  }
};

/**
 * Method to delete an specific document in a specific collection
 * @method
 * @param collection - collection name
 * @param id - document id
 */
const destroy = async (collection, id) => {
  try {
    await firestore.collection(collection).doc(id).delete();
    return 'Eliminación exitosa', [null];
  } catch (error) {
    return [null, error];
  }
};

const fileTypes = {
  png: 'image/png',
  jpg: 'image/jpg',
  jpeg: 'image/jpeg',
};

/**
 * Method to get the ulr of a file on firebase storage
 * @method
 * @param filename - filename reference to get url
 */
const getFileUrl = async (filename) => {
  try {
    const fileRef = storage.refFromURL(`gs://${STORAGE_BUCKET}/${filename}`);
    const url = await fileRef.getDownloadURL();
    return [url, null];
  } catch (error) {
    return [null, error];
  }
};

/**
 * Method to create a file on firebase storage
 * @method
 * @param file - file bob to save
 * @param folder - folder route in firebase storage for the file
 */
const createFile = async (file, folder) => {
  const { png, jpg, jpeg } = fileTypes;
  const limit = 50000000;
  const types = [png, jpg, jpeg];
  const fileName = `${folder}/${new Date()}-${file.originalname}`;
  if (file.size >= limit) {
    return [null, `Archivo supera ${limit}kb`];
  } else if (!types.includes(file.mimetype)) {
    return [null, 'Solo se permiten archivos png, jpg y jpeg'];
  } else {
    try {
      const fileCreateRef = storage.ref(fileName);
      const bytes = new Uint8Array(file.buffer);
      const metadata = {
        contentType: file.mimetype,
      };
      await fileCreateRef.put(bytes, metadata);
      return [fileName, null];
    } catch (error) {
      return [null, error];
    }
  }
};

/**
 * Method to update a file on firebase storage
 * @method
 * @param oldFileRef - file reference to delete
 * @param newFile - new bob file to create
 * @param newFolder - folder route in firebase storage for the new file
 */
const updateFile = async (oldFileRef, newFile, newFolder) => {
  try {
    await deleteFile(oldFileRef);
    const [filename, error] = await createFile(newFile, newFolder);
    if (error) return [null, error];
    const [url] = await getFileUrl(filename);
    return [{ url, filename }, null];
  } catch (e) {
    return [null, e];
  }
};

/**
 * Method to delete a file on firebase storage
 * @method
 * @param fileRef - file reference to delete
 */
const deleteFile = async (fileRef) => {
  try {
    const fileDeleteRef = storage.refFromURL(fileRef);
    await fileDeleteRef.delete();
    return ['Archivo borrado con éxito', null];
  } catch (error) {
    return [null, error];
  }
};

module.exports = {
  getAll,
  getOne,
  create,
  update,
  destroy,
  createFile,
  updateFile,
  deleteFile,
  getFileUrl,
};
