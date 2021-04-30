const { getAll, getOne, create, update, destroy } = require("../helpers/firestoreOrm");
const processIngredientsRecepy = require("../helpers/processIngredientsRecepy");
const hasData = require("../helpers/hasData");

const createRecepy = async (req, res) => {
  try {
    const { name, type, image, ingredients } = req.body;
    const data = {
      name,
      type,
      image,
      ingredients,
    };
    await create("recepies", data);
    return res.json({ success: "Record created successfully" });
  } catch (error) {
    return res.status(400).send(error.message);
  }
};

const getRecepies = async (req, res) => {
  try {
    const recepies = await getAll("recepies");
    const ingredients = await getAll("ingredients");
    if (!hasData(recepies)) {
      return res.status(404).json({ error: "no records" });
    } else {
      const processedRecepies = recepies.map((recepy) => {
        return processIngredientsRecepy(recepy, ingredients);
      });

      return res.status(201).json(processedRecepies);
    }
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

const getRecepyById = async (req, res) => {
  try {
    const { id } = req.params;
    const recepy = await getOne("recepies", id);
    const ingredients = await getAll("ingredients");
    if (!hasData(recepy)) {
      return res.status(404).json({ error: "not found" });
    } else {
      return res
        .status(201)
        .json(processIngredientsRecepy(recepy, ingredients));
    }
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

const patchRecepyById = async (req, res) => {
  try {
    const { params, body } = req;
    await update("recepies", params.id, body);
    return res.json({ success: "Record updated successfully" });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

const deleteRecepyById = async (req, res) => {
  try {
    const { id } = req.params;
    await destroy("recepies", id);
    return res.json({ success: "Record deleted successfully" });
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
