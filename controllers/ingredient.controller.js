const {
  getAll,
  getOne,
  destroy,
  update,
  create,
  getFileUrl,
  createFile,
  updateFile,
  deleteFile,
} = require('../helpers/firestoreOrm');
const hasData = require('../helpers/hasData');
const { validations } = require('../helpers/validations');
const checkIngredientsRecepy = require('../helpers/checkIngredientsRecepy');
const { STORAGE_BUCKET } = process.env;

const createIngredient = async (req, res) => {
  const { file, body } = req;
  const bodyParsed = JSON.parse(body.data);
  const data = validations(bodyParsed, res);
  if (hasData(file)) {
    try {
      const [filename] = await createFile(file, 'ingredients');
      const [url] = await getFileUrl(filename);
      await create('ingredients', {
        ...data,
        image: url,
        imageRef: `gs://${STORAGE_BUCKET}/${filename}`,
      });
      return res.status(201).json({ success: 'Ingrediente creado con éxito' });
    } catch (e) {
      return res
        .status(400)
        .json({ error: 'Error en la creación del ingrediente' });
    }
  } else {
    try {
      await create('ingredients', { ...data, image: '', imageRef: '' });
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
    const [ingredients] = await getAll('ingredients');
    return res.status(200).json(ingredients);
  } catch (error) {
    return res.status(400).json({ error });
  }
};

const getIngredientById = async (req, res) => {
  try {
    const { id } = req.params;
    const [ingredient] = await getOne('ingredients', id);
    if (!hasData(ingredient)) {
      return res.status(404).json({ error: 'Ingrediente no encontrado' });
    } else {
      return res.status(200).json(ingredient);
    }
  } catch (error) {
    return res.status(400).json({ error });
  }
};

const patchIngredientById = async (req, res) => {
  const { params, body, file } = req;
  const bodyParsed = JSON.parse(body.data);
  const data = validations(bodyParsed, res, ['id', 'image', 'imageRef']);
  try {
    const [ingredient] = await getOne('ingredients', params.id);
    /* Nuevo archivo y archivo antiguo existente */
    if (hasData(ingredient.imageRef) && hasData(file)) {
      const [{ url, filename }] = await updateFile(
        ingredient.imageRef,
        file,
        'ingredients'
      );
      await update('ingredients', params.id, {
        ...data,
        image: url,
        imageRef: `gs://${STORAGE_BUCKET}/${filename}`,
      });
      return res.status(201).json({
        success: 'Ingrediente actualizado exitósamente',
      });
    }
    /* Sin archivo archivo y archivo antiguo existente */
    else if (hasData(ingredient.imageRef) && !hasData(file)) {
      await update('ingredients', params.id, {
        ...data,
        image: ingredient.image,
        imageRef: ingredient.imageRef,
      });
      return res.status(201).json({
        success: 'Ingrediente actualizado exitósamente',
      });
    }
    /* Nuevo archivo y archivo antiguo no existente */
    else if (!hasData(ingredient.imageRef) && hasData(file)) {
      const [filename] = await createFile(file, 'ingredients');
      const [url] = await getFileUrl(filename);
      await update('ingredients', params.id, {
        ...data,
        image: url,
        imageRef: `gs://${STORAGE_BUCKET}/${filename}`,
      });
      return res.status(201).json({
        success: 'Ingrediente actualizado exitósamente',
      });
    /* Sin archivo archivo y archivo antiguo no existente */
    } else {
      await update('ingredients', params.id, {
        ...data,
        image: "",
        imageRef: "",
      });
      return res.status(201).json({
        success: 'Ingrediente actualizado exitósamente',
      });
    }
  } catch (error) {
    return res.status(400).json({
      error,
    });
  }
};

const deleteIngredientById = async (req, res) => {
  const { id } = req.params;
  const [recepies] = await getAll('recepies');
  const [error, checked] = checkIngredientsRecepy(recepies, id);
  if (checked) {
    const [ingredient] = await getOne('ingredients', id);
    if (hasData(ingredient)) {
      if (hasData(ingredient.imageRef)) {
        await deleteFile(ingredient.imageRef);
        await destroy('ingredients', id);
          return res
            .status(200)
            .json({ success: 'Ingrediente borrado con éxito' });
      } else {
        await destroy('ingredients', id);
        return res
          .status(200)
          .json({ success: 'Ingrediente borrado con éxito' });
      }
    } else {
      return res.status(404).json({ error: 'Ingrediente no encontrado' });
    }
  } else {
    return res.status(400).json({ error });
  }
};

module.exports = {
  createIngredient,
  getIngredients,
  getIngredientById,
  patchIngredientById,
  deleteIngredientById,
};
