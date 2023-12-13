
const express = require("express");

const router = express.Router();
const categoryController = require('../../controllers/v1/categoryController')


router.get("/", (req, res) => {
    res.status(200).json("Testing Category route");
})


router.post("/add", categoryController.add);
router.post("/list", categoryController.list);
router.post("/detail", categoryController.detail);
router.post("/update", categoryController.update);
router.delete("/delete", categoryController.delete);

router.get("/search", categoryController.search); 

module.exports = router;