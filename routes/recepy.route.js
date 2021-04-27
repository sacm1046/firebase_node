const express = require("express");
const {
  createRecepy,
  getRecepies,
  getRecepyById,
  patchRecepyById,
  deleteRecepyById,
} = require("../controllers/recepy.controller");

const router = express.Router();

router.post("/recepies", createRecepy);
router.get("/recepies", getRecepies);
router.get("/recepy/:id", getRecepyById);
router.patch("/recepy/:id", patchRecepyById);
router.delete("/recepy/:id", deleteRecepyById);

module.exports = router;
