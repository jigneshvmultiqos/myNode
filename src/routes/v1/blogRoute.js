const express = require("express");
const blogController = require('../../controllers/v1/blogController')
const router = express.Router();

const verifyToken = require('../../middleware/verifyToken')
router.get("/", (req, res) => {
    res.status(200).json("Testing blog route");
})

router.post("/add", blogController.add);
router.get("/list", blogController.list);
router.post("/detail", blogController.detail);
router.post("/update", blogController.update);
router.delete("/delete", blogController.delete);

module.exports = router;