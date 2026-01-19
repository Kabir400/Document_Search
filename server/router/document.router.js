const express = require("express");
const router = express.Router();

//middleware
const checkLogin = require("../middleware/checkLogin.js");
const {
  upload,
  multerErrorHandler,
} = require("../middleware/uploadMiddleware.js");

//controller
const uploadDocument = require("../controller/document/uploadDocument.js");
const getDocuments = require("../controller/document/getDocuments.js");
const deleteDocument = require("../controller/document/deleteDocument.js");

//routes
router.post(
  "/upload",
  checkLogin,
  upload.single("file"),
  multerErrorHandler,
  uploadDocument
);
router.get("/get-documents", checkLogin, getDocuments);
router.delete("/delete-document/:id", checkLogin, deleteDocument);

module.exports = router;
