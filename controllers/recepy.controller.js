const {
  getAll,
  getOne,
  create,
  update,
  destroy,
} = require('../helpers/firestoreOrm');
const processIngredientsRecepy = require('../helpers/processIngredientsRecepy');
const hasData = require('../helpers/hasData');
const {
  validations,
  createUpdateValidation,
} = require('../helpers/validations');

const createRecepy = async (req, res) => {
  try {
    const { name, image, type, ingredients, preparation } = req.body;
    const data = validations(
      {
        name,
        image,
        type,
        ingredients,
        preparation,
      },
      res,
      ['image']
    );
    const validation = await createUpdateValidation(data.ingredients, res);
    if (!validation)
      return res
        .status(400)
        .json({ error: 'Ingredientes incluidos no existen' });
    await create('recepies', data);
    return res.status(201).json({ success: 'Creación exitosa' });
  } catch (error) {
    return res.status(400).json({ error: error.message });
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
  try {
    const { params, body } = req;
    const { name, image, type, ingredients, preparation } = body;
    const data = validations(
      {
        name,
        image,
        type,
        ingredients,
        preparation,
      },
      res,
      ['image']
    );
    const validation = await createUpdateValidation(data.ingredients, res);
    if (!validation)
      return res
        .status(400)
        .json({ error: 'Ingredientes incluidos no existen' });
    await update('recepies', params.id, data);
    return res.status(200).json({ success: 'Actualización exitosa' });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

const deleteRecepyById = async (req, res) => {
  try {
    const { id } = req.params;
    await destroy('recepies', id);
    return res.status(200).json({ success: 'Borrado exitoso' });
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
