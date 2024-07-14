const express = require("express");
const {
  createProperty,
  getAllProperties,
  getPropertyById,
  updateProperty,
  deleteProperty,
  searchProperties,
  getPropertiesAgent,
} = require("../controllers/propertyController");
const authMiddleware = require("../middlewares/authMiddleware");
const upload = require("../config/multer");
const router = express.Router();

router.post(
  "/createProperty",
  authMiddleware,
  upload.single("image"),
  createProperty
);
router.get("/", getAllProperties);
router.get("/agent", authMiddleware, getPropertiesAgent);
router.get("/:id", getPropertyById);
router.put("/:id", authMiddleware,upload.single("image"), updateProperty);
router.delete("/:id", authMiddleware, deleteProperty);
router.get("/search", searchProperties);

module.exports = router;
