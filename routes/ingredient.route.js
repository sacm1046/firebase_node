const express = require('express');
const {
  createIngredient,
  getIngredients,
  getIngredientById,
  patchIngredientById,
  deleteIngredientById,
  getImage,
  postImage,
  deleteImage,
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
router.delete('/ingredient-image', deleteImage);


module.exports = router;
