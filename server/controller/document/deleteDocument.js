const Document = require("../../model/document.model.js");
const ApiResponse = require("../../utils/ApiResponse.js");
const TryCatch = require("../../utils/TryCatch.js");
const ApiError = require("../../utils/ApiError.js");
const { deleteVectors } = require("../../utils/pinecone.js");

deleteDocument = TryCatch(async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;

  const doc = await Document.findOne({ _id: id, userId });
  if (!doc)
    return res.status(404).json(new ApiError(404, "Document not found"));

  await deleteVectors(userId.toString(), doc._id.toString());

  await doc.deleteOne();
  res.json(new ApiResponse(200, "Document deleted", true));
});

module.exports = deleteDocument;
