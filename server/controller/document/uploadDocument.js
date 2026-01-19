const Document = require("../../model/document.model.js");
const { extractText } = require("../../utils/textExtractor.js");
const { chunkText } = require("../../utils/chunker.js");
const { embedAndStore } = require("../../utils/pinecone");
const ApiResponse = require("../../utils/ApiResponse.js");
const ApiError = require("../../utils/ApiError.js");
const TryCatch = require("../../utils/TryCatch.js");

uploadDocument = TryCatch(async (req, res) => {
  const file = req.file;
  const userId = req.user._id;

  if (!file) return next(new ApiError(400, "No file uploaded"));

  const text = await extractText(file);
  const chunks = chunkText(text);

  const doc = await Document.create({
    userId,
    originalName: file.originalname,
    mimeType: file.mimetype,
    pineconeNamespace: userId.toString(),
    chunkCount: chunks.length,
  });

  await embedAndStore({
    chunks,
    userId,
    documentId: doc._id,
  });

  res.status(201).json(
    new ApiResponse(201, "Document uploaded", true, {
      document: doc,
    })
  );
});

module.exports = uploadDocument;
