import { Router } from 'express';
import { createIngredient, getIngredients, getIngredientById, patchIngredientById,deleteIngredientById } from '../controllers/ingredient.controller';

const router = Router();

router.post('/ingredients', createIngredient)
router.get('/ingredients', getIngredients)
router.get('/ingredient/:id', getIngredientById)
router.patch('/ingredient/:id', patchIngredientById)
router.delete('/ingredient/:id', deleteIngredientById)

export default router;