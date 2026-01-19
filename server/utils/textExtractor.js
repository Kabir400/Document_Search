const pdfParse = require("pdf-parse");
const mammoth = require("mammoth");
const ApiError = require("./ApiError.js");

exports.extractText = async (file) => {
  const buffer = file.buffer;
  const type = file.mimetype;

  if (type === "application/pdf") {
    const data = await pdfParse(buffer);
    return data.text;
  }

  if (
    type ===
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    const result = await mammoth.extractRawText({ buffer });
    return result.value;
  }

  if (type.startsWith("text/")) {
    return buffer.toString("utf-8");
  }

  throw new ApiError(415, "Unsupported file type");
};
