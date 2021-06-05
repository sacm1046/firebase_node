const express = require('express');
const {
  createIngredient,
  getIngredients,
  getIngredientById,
  patchIngredientById,
  deleteIngredientById,
  getImage,
  postImage,
} = require('../controllers/ingredient.controller');
const multer = require('multer');

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({storage});

router.post('/ingredients', createIngredient);
router.get('/ingredients', getIngredients);
router.get('/ingredient/:id', getIngredientById);
router.patch('/ingredient/:id', patchIngredientById);
router.delete('/ingredient/:id', deleteIngredientById);
router.get('/ingredient-image', getImage);
router.post('/ingredient-image',upload.single('image'), postImage);

module.exports = router;
