const express = require('express');
const {
  createRecepy,
  getRecepies,
  getRecepyById,
  patchRecepyById,
  deleteRecepyById,
} = require('../controllers/recepy.controller');
const multer = require('multer');

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({storage});

router.post('/recepies', upload.single('image'), createRecepy);
router.get('/recepies', getRecepies);
router.get('/recepy/:id', getRecepyById);
router.patch('/recepy/:id', upload.single('image'), patchRecepyById);
router.delete('/recepy/:id', deleteRecepyById);

module.exports = router;
