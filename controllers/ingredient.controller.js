const firebase = require("../database/db");
const IngredientModel = require("../models/ingredient.model");
const firestore = firebase.firestore();

const createIngredient = async (req, res) => {
  try {
    const data = req.body;
    await firestore.collection("ingredients").doc().set(data);
    return res.send("Record created successfully");
  } catch (error) {
    return res.status(400).send(error.message);
  }
};

const getIngredients = async (req, res) => {
  try {
    const ingredients = await firestore.collection("ingredients").get();
    if (ingredients.empty) {
      return res.status(404).send("no records");
    } else {
      let ingredientList = [];
      ingredients.forEach((doc) => {
        const ingredient = new IngredientModel({ ...doc.data(), id: doc.id });
        ingredientList.push(ingredient);
      });
      return res.status(201).json(ingredientList);
    }
  } catch (error) {
    return res.status(400).send(error.message);
  }
};

const getIngredientById = async (req, res) => {
  try {
    const { id } = req.params;
    const ingredient = await firestore.collection("ingredients").doc(id).get();
    if (!ingredient.exists) {
      return res.status(404).json({error: "not found"});
    } else {
      return res.status(201).json(ingredient.data())
    }
  } catch (error) {
    return res.status(400).send(error.message);
  }
};

const patchIngredientById = async (req, res) => {
  try {
    const id = req.params.id;
    const data = req.body;
    await firestore.collection("ingredients").doc(id).update(data);
    return res.send("Record updated successfully");
  } catch (error) {
    return res.status(400).send(error.message);
  }
};

const deleteIngredientById = async (req, res) => {
  try {
    const id = req.params.id;
    await firestore.collection("ingredients").doc(id).delete();
    return res.send("Record deleted successfully");
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
