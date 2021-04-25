import firebase from "../database/db";
import IngredientModel from "../models/ingredient.model";
const firestore = firebase.firestore();

export const createIngredient = async (req, res) => {
  try {
    const data = req.body;
    await firestore.collection("ingredients").doc().set(data);
    res.send("Record created successfully");
  } catch (error) {
    res.status(400).send(error.message);
  }
};

export const getIngredients = async (req, res) => {
  try {
    const ingredients = await firestore.collection("ingredients").get();
    if (ingredients.empty) {
      res.status(404).send("no records");
    } else {
      let ingredientList = [];
      ingredients.forEach((doc) => {
        const ingredient = new IngredientModel({ ...doc.data(), id: doc.id });
        ingredientList.push(ingredient);
      });
      res.json(ingredientList);
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
};

export const getIngredientById = async (req, res) => {
  try {
    const id = req.params.id;
    const ingredient = await firestore.collection("ingredients").doc(id).get();
    if (!ingredient.exists) {
      res.status(404).send("not found");
    } else {
      res.send(ingredient.data());
    }
    res.send("Record created successfully");
  } catch (error) {
    res.status(400).send(error.message);
  }
};

export const patchIngredientById = async (req, res) => {
  try {
    const id = req.params.id;
    const data = req.body;
    await firestore.collection("ingredients").doc(id).update(data);
    res.send("Record updated successfully");
  } catch (error) {
    res.status(400).send(error.message);
  }
};

export const deleteIngredientById = async (req, res) => {
  try {
    const id = req.params.id;
    await firestore.collection("ingredients").doc(id).delete();
    res.send("Record deleted successfully");
  } catch (error) {
    res.status(400).send(error.message);
  }
};
