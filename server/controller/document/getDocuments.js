const Document = require("../../model/document.model.js");
const ApiResponse = require("../../utils/ApiResponse.js");
const TryCatch = require("../../utils/TryCatch.js");

getDocuments = TryCatch(async (req, res) => {
  const docs = await Document.find({ userId: req.user._id }).sort({
    createdAt: -1,
  });
  res.json(new ApiResponse(200, "Documents fetched", true, docs));
});

module.exports = getDocuments;
