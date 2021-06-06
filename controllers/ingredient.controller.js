const {
  getAll,
  getOne,
  destroy,
  update,
  create,
} = require('../helpers/firestoreOrm');
const hasData = require('../helpers/hasData');
const { validations } = require('../helpers/validations');
const { storage } = require('../database/db');
const { GS_URL } = process.env;

const fileTypes = {
  png: 'image/png',
  jpg: 'image/jpg',
};

const createIngredient = async (req, res) => {
  const { file, body } = req;
  const { png, jpg } = fileTypes;
  const bodyParsed = JSON.parse(body.data);
  const limit = 100000;
  const types = [png, jpg];
  if (hasData(file)) {
    try {
      const fileName = `ingredients/${new Date()}-${file.originalname}`;
      if (file.size >= limit) {
        return res.status(400).json({ error: `Archivo supera ${limit}kb` });
      } else {
        if (types.includes(file.mimetype)) {
          const fileCreateRef = storage.ref(fileName);
          const bytes = new Uint8Array(file.buffer);
          const metadata = {
            contentType: file.mimetype,
          };
          fileCreateRef
            .put(bytes, metadata)
            .then(() => {
              const fileRef = storage.refFromURL(`${GS_URL}/${fileName}`);
              fileRef
                .getDownloadURL()
                .then(async (url) => {
                  const data = validations(bodyParsed, res);
                  await create('ingredients', {
                    ...data,
                    image: url,
                    imageRef: `${GS_URL}/${fileName}`,
                  });
                  return res
                    .status(201)
                    .json({ success: 'Ingrediente creado exitósamente' });
                })
                .catch(function (error) {
                  res.json({ error });
                });
            })
            .catch((error) => console.log('error: ', error));
        } else {
          return res
            .status(400)
            .json({ error: 'Formato de archivo no válido' });
        }
      }
    } catch (e) {
      return res
        .status(400)
        .json({ error: 'Error en la creación del ingrediente' });
    }
  } else {
    try {
      const data = validations(bodyParsed, res);
      await create('ingredients', { ...data, image: '' });
      return res.status(201).json({ success: 'Ingrediente creado con éxito' });
    } catch (e) {
      return res
        .status(400)
        .json({ error: 'Error en la creación del ingrediente' });
    }
  }
};

const getIngredients = async (req, res) => {
  try {
    const ingredients = await getAll('ingredients');
    return res.status(200).json(ingredients);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

const getIngredientById = async (req, res) => {
  try {
    const { id } = req.params;
    const ingredient = await getOne('ingredients', id);
    if (!hasData(ingredient)) {
      return res.status(404).json({ error: 'No encontrado' });
    } else {
      return res.status(200).json(ingredient);
    }
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

const patchIngredientById = async (req, res) => {
  const { params, body, file } = req;
  console.log(req.params.id);
  const { png, jpg } = fileTypes;
  getOne('ingredients', params.id)
    .then((ingredient) => {
      const bodyParsed = JSON.parse(body.data);
      const data = validations(bodyParsed, res);
      if (hasData(ingredient)) {
        const fileDeleteRef = storage.refFromURL(ingredient.imageRef);
        fileDeleteRef
          .delete()
          .then(() => {
            const limit = 100000;
            const types = [png, jpg];
            if (hasData(file)) {
              const fileName = `ingredients/${new Date()}-${file.originalname}`;
              if (file.size >= limit) {
                return res
                  .status(400)
                  .json({ error: `Archivo supera ${limit}kb` });
              } else {
                if (types.includes(file.mimetype)) {
                  const fileCreateRef = storage.ref(fileName);
                  const bytes = new Uint8Array(file.buffer);
                  const metadata = {
                    contentType: file.mimetype,
                  };
                  fileCreateRef
                    .put(bytes, metadata)
                    .then(() => {
                      const fileRef = storage.refFromURL(
                        `${GS_URL}/${fileName}`
                      );
                      fileRef
                        .getDownloadURL()
                        .then((url) => {
                          update('ingredients', params.id, {
                            ...data,
                            image: url,
                            imageRef: `${GS_URL}/${fileName}`,
                          })
                            .then(() => {
                              return res.status(201).json({
                                success: 'Ingrediente actualizado exitósamente',
                              });
                            })
                            .catch((error) => {
                              res.status(400).json({
                                error: 'Error en la edición del ingrediente',
                              });
                            });
                        })
                        .catch((error) => {
                          res.status(400).json({
                            error: 'Error en la edición del ingrediente',
                          });
                        });
                    })
                    .catch((error) => console.log('error: ', error));
                } else {
                  return res
                    .status(400)
                    .json({ error: 'Formato de archivo no válido' });
                }
              }
            } else {
              update('ingredients', params.id, { ...data, image: '' })
                .then(() => {
                  return res.status(201).json({
                    success: 'Ingrediente actualizado exitósamente',
                  });
                })
                .catch((error) => {
                  res.status(400).json({
                    error: 'Error en la edición del ingrediente',
                  });
                });
            }
          })
          .catch((error) => console.log(error));
      } else {
        return res.status(404).json({ error: 'Ingrediente no encontrado' });
      }
    })
    .catch(() => {
      return res.status(404).json('not found');
    });
};

/*

      */

const deleteIngredientById = async (req, res) => {
  const { id } = req.params;
  getAll('recepies')
    .then((recepies) => {
      if (hasData(recepies)) {
        if (
          recepies.some((recepy) =>
            recepy.ingredients.map((ingredient) => ingredient.id).includes(id)
          )
        ) {
          res.status(502).json({
            error:
              'El ingrediente no puede ser borrado debido a que esta relacionado a una receta existe',
          });
        }
      } else {
        getOne('ingredients', id)
          .then((ingredient) => {
            if (hasData(ingredient)) {
              const fileRef = storage.refFromURL(ingredient.imageRef);
              fileRef
                .delete()
                .then(() => {
                  destroy('ingredients', id)
                    .then(() => {
                      return res
                        .status(200)
                        .json({ success: 'Borrado exitoso' });
                    })
                    .catch(() => {
                      return res.status(400).json({ error: error.message });
                    });
                })
                .catch((error) => console.log(error));
            } else {
              return res
                .status(404)
                .json({ error: 'Ingrediente no encontrado' });
            }
          })
          .catch((error) => {
            return res.status(400).json({ error: error.message });
          });
      }
    })
    .catch(() => {
      return res.status(400).json({ error: error.message });
    });
};

module.exports = {
  createIngredient,
  getIngredients,
  getIngredientById,
  patchIngredientById,
  deleteIngredientById,
};
