const {
  getAll,
  getOne,
  create,
  update,
  destroy,
  getFileUrl,
  createFile,
  updateFile,
  deleteFile,
} = require('../helpers/firestoreOrm');
const processIngredientsRecepy = require('../helpers/processIngredientsRecepy');
const hasData = require('../helpers/hasData');
const {
  validations,
  createUpdateValidation,
} = require('../helpers/validations');
const { STORAGE_BUCKET } = process.env;

const createRecepy = async (req, res) => {
  const { file, body } = req;
  const data = JSON.parse(body.data);
  /* Validations */
  if (!hasData(data.name)) {
    return res
      .status(503)
      .json({ error: 'Nombre de receta es obligatorio' });
  }
  if (!hasData(data.ingredients)) {
    return res
      .status(503)
      .json({ error: 'Receta debe contener al menos 1 ingrediente' });
  }
  try {
    const validation = await createUpdateValidation(data.ingredients);
    if (!validation) {
      return res
        .status(400)
        .json({ error: 'Ingredientes incluidos no existen' });
    }
    if (hasData(file)) {
      try {
        const [filename, error] = await createFile(file, 'recepies');
        if (error) return res.status(400).json({ error });
        const [url] = await getFileUrl(filename);
        await create('recepies', {
          ...data,
          image: url,
          imageRef: `gs://${STORAGE_BUCKET}/${filename}`,
        });
        return res.status(201).json({ success: 'Receta creada con éxito' });
      } catch (e) {
        return res
          .status(400)
          .json({ error: 'Error en la creación de la receta' });
      }
    } else {
      try {
        await create('recepies', { ...data, image: '', imageRef: '' });
        return res.status(201).json({ success: 'Receta creada con éxito' });
      } catch (e) {
        return res
          .status(400)
          .json({ error: 'Error en la creación de la receta' });
      }
    }
  } catch (error) {
    return res.status(400).json({ error });
  }
};

const getRecepies = async (req, res) => {
  try {
    const [recepies] = await getAll('recepies');
    const [ingredients] = await getAll('ingredients');
    if (!hasData(recepies)) {
      return res.status(200).json([]);
    } else {
      const processedRecepies = recepies.map((recepy) => {
        return processIngredientsRecepy(recepy, ingredients);
      });
      return res.status(200).json(processedRecepies);
    }
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

const getRecepyById = async (req, res) => {
  try {
    const { id } = req.params;
    const [recepy] = await getOne('recepies', id);
    const [ingredients] = await getAll('ingredients');
    if (!hasData(recepy)) {
      return res.status(404).json({ error: 'Receta no encontrada' });
    } else {
      return res
        .status(200)
        .json(processIngredientsRecepy(recepy, ingredients));
    }
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

const patchRecepyById = async (req, res) => {
  const { params, body, file } = req;
  const bodyParsed = JSON.parse(body.data);
  const data = validations(bodyParsed, res, ['id', 'image', 'imageRef']);
  try {
    const validation = await createUpdateValidation(data.ingredients, res);
    if (!validation) {
      return res
        .status(400)
        .json({ error: 'Ingredientes incluidos no existen' });
    } else {
      const [recepy] = await getOne('recepies', params.id);
      /* Nuevo archivo y archivo antiguo existente */
      if (hasData(recepy.imageRef) && hasData(file)) {
        const [{ url, filename }, error] = await updateFile(
          recepy.imageRef,
          file,
          'recepies'
        );
        if (error) return res.status(400).json({ error });
        await update('recepies', params.id, {
          ...data,
          image: url,
          imageRef: `gs://${STORAGE_BUCKET}/${filename}`,
        });
        return res.status(201).json({
          success: 'Receta actualizada exitósamente',
        });
      } else if (hasData(recepy.imageRef) && !hasData(file)) {
        /* Sin archivo archivo y archivo antiguo existente */
        await update('recepies', params.id, {
          ...data,
          image: recepy.image,
          imageRef: recepy.imageRef,
        });
        return res.status(201).json({
          success: 'Receta actualizada exitósamente',
        });
      } else if (!hasData(recepy.imageRef) && hasData(file)) {
        /* Nuevo archivo y archivo antiguo no existente */
        const [filename, error] = await createFile(file, 'recepies');
        if (error) return res.status(400).json({ error });
        const [url] = await getFileUrl(filename);
        await update('recepies', params.id, {
          ...data,
          image: url,
          imageRef: `gs://${STORAGE_BUCKET}/${filename}`,
        });
        return res.status(201).json({
          success: 'Receta actualizada exitósamente',
        });
        /* Sin archivo archivo y archivo antiguo no existente */
      } else {
        await update('recepies', params.id, {
          ...data,
          image: '',
          imageRef: '',
        });
        return res.status(201).json({
          success: 'Receta actualizada exitósamente',
        });
      }
    }
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

const deleteRecepyById = async (req, res) => {
  const { id } = req.params;
  try {
    const [recepy] = await getOne('recepies', id);
    if (hasData(recepy)) {
      if (hasData(recepy.imageRef)) {
        await deleteFile(recepy.imageRef);
        await destroy('recepies', id);
        return res.status(200).json({ success: 'Receta borrada con éxito' });
      } else {
        await destroy('recepies', id);
        return res.status(200).json({ success: 'Receta borrada con éxito' });
      }
    } else {
      return res.status(404).json({ error: 'Receta no encontrada' });
    }
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

module.exports = {
  createRecepy,
  getRecepies,
  getRecepyById,
  patchRecepyById,
  deleteRecepyById,
};
