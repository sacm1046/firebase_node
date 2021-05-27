const {
  getAll,
  getOne,
  destroy,
  update,
  create,
} = require('../helpers/firestoreOrm');
const hasData = require('../helpers/hasData');
const { validations } = require('../helpers/validations');

const createIngredient = async (req, res) => {
  try {
    const data = validations(req.body, res, ['image']);
    await create('ingredients', data);
    return res.status(201).json({ success: 'Creación exitosa' });
  } catch (error) {
    return res.status(400).json({ error: error.message });
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
      if(recepies.some(recepy=> recepy.ingredients.map(ingredient=>ingredient.id).includes(id))){
        res.status(502).json({ error: 'El ingrediente no puede ser borrado debido a que esta relacionado a una receta existe' })
      }else {
        await destroy('ingredients', id);
        return res.status(200).json({ success: 'Borrado exitoso' });
      }
    }
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

module.exports = {
  createIngredient,
  getIngredients,
  getIngredientById,
  patchIngredientById,
  deleteIngredientById,
};
