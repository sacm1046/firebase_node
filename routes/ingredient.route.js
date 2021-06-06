const express = require('express');
const {
  createIngredient,
  getIngredients,
  getIngredientById,
  patchIngredientById,
  deleteIngredientById,
} = require('../controllers/ingredient.controller');
const multer = require('multer');

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({storage});

router.post('/ingredients', upload.single('image'), createIngredient);
router.get('/ingredients', getIngredients);
router.get('/ingredient/:id', getIngredientById);
router.patch('/ingredient/:id', upload.single('image'), patchIngredientById);
router.delete('/ingredient/:id', deleteIngredientById);


module.exports = router;
