const express = require('express');
const {
  createIngredient,
  getIngredients,
  getIngredientById,
  patchIngredientById,
  deleteIngredientById,
} = require('../controllers/ingredient.controller');

const router = express.Router();

router.post("/ingredients", createIngredient);
router.get("/ingredients", getIngredients);
router.get("/ingredient/:id", getIngredientById);
router.patch("/ingredient/:id", patchIngredientById);
router.delete("/ingredient/:id", deleteIngredientById);

module.exports = {
  router
}
