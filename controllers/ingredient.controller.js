const {
  getAll,
  getOne,
  destroy,
  update,
  create,
} = require("../helpers/firestoreOrm");
const hasData = require("../helpers/hasData");
const { validations } = require("../helpers/validations");

const createIngredient = async (req, res) => {
  try {
    const data = validations(req.body, res, ['image']);
    await create("ingredients", data);
    return res.json({ success: "Creación exitosa" });
  } catch (error) {
    return res.status(400).send(error.message);
  }
};

const getIngredients = async (req, res) => {
  try {
    const ingredients = await getAll("ingredients");
    return res.status(201).json(ingredients);
  } catch (error) {
    return res.status(400).send(error.message);
  }
};

const getIngredientById = async (req, res) => {
  try {
    const { id } = req.params;
    const ingredient = await getOne("ingredients", id);
    if (!hasData(ingredient)) {
      return res.status(404).json({ error: "No encontrado" });
    } else {
      return res.status(201).json(ingredient);
    }
  } catch (error) {
    return res.status(400).send(error.message);
  }
};

const patchIngredientById = async (req, res) => {
  try {
    const { params, body } = req;
    const data = validations(body, res, ['image']);
    await update("ingredients", params.id, data);
    return res.json({ success: "Actualización exitosa" });
  } catch (error) {
    return res.status(400).send(error.message);
  }
};

const deleteIngredientById = async (req, res) => {
  try {
    const { id } = req.params;
    await destroy("ingredients", id);
    return res.json({ success: "Borrado exitoso" });
  } catch (error) {
    return res.status(400).send(error.message);
  }
};

module.exports = {
  createIngredient,
  getIngredients,
  getIngredientById,
  patchIngredientById,
  deleteIngredientById,
};
