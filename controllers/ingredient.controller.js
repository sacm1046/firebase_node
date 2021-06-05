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
              const fileRef = storage.refFromURL(
                `gs://recetario-2369f.appspot.com/${fileName}`
              );
              fileRef
                .getDownloadURL()
                .then(async (url) => {
                  const data = validations(bodyParsed, res);
                  await create('ingredients', { ...data, image: url });
                  return res.status(201).json({ ...data, image: url });
                })
                .catch(function (error) {
                  res.json({ error });
                });
            })
            .catch((error) => console.log('error: ', error));
        } else {
          return res.status(400).json({ error: 'Formato de archivo no válido' });
        }
      }
    } catch (e) {
      return res.status(400).json({ error: 'Error en la creación del ingrediente' });
    }
  } else {
    try {
      const data = validations(bodyParsed, res);
      await create('ingredients', { ...data, image: 'No Image' });
      return res.status(201).json({ success: 'Ingrediente creado con éxito' });
    } catch (e) {
      return res.status(400).json({ error: 'Error en la creación del ingrediente' });
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
  try {
    const { params, body } = req;
    const data = validations(body, res, ['image']);
    await update('ingredients', params.id, data);
    return res.status(200).json({ success: 'Actualización exitosa' });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

const deleteIngredientById = async (req, res) => {
  try {
    const { id } = req.params;
    const recepies = await getAll('recepies');
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
      } else {
        await destroy('ingredients', id);
        return res.status(200).json({ success: 'Borrado exitoso' });
      }
    }
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

const deleteImage = async (req, res) => {
  const fileRef = storage.refFromURL(
    'gs://recetario-2369f.appspot.com/Sat Jun 05 2021 16:55:57 GMT-0400 (hora estándar de Chile)-test.png'
  );
  fileRef
    .delete()
    .then(() => console.log('deleted'))
    .catch((error) => console.log(error));
};

module.exports = {
  createIngredient,
  getIngredients,
  getIngredientById,
  patchIngredientById,
  deleteIngredientById,
  deleteImage,
};
