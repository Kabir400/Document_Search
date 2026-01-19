const { PDFLoader } = require("@langchain/community/document_loaders/fs/pdf");
const { DocxLoader } = require("@langchain/community/document_loaders/fs/docx");
const fs = require("fs").promises;
const path = require("path");
const os = require("os");
const ApiError = require("./ApiError.js");

exports.extractText = async (file) => {
  const buffer = file.buffer;
  const type = file.mimetype;
  const tempDir = os.tmpdir();
  const fileName = `upload-${Date.now()}-${file.originalname.replace(/[^a-zA-Z0-9.]/g, "_")}`;
  const tempFilePath = path.join(tempDir, fileName);

  try {
    // Write buffer to temp file
    await fs.writeFile(tempFilePath, buffer);

    let loader;
    if (type === "application/pdf") {
      loader = new PDFLoader(tempFilePath, {
        splitPages: false,
      });
    } else if (
      type ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      loader = new DocxLoader(tempFilePath);
    } else if (type.startsWith("text/")) {
       // For text files, we can just read the buffer directly
       // But to ensure consistency and cleanup, let's just use the buffer.
       await fs.unlink(tempFilePath);
       return buffer.toString("utf-8");
    } else {
        await fs.unlink(tempFilePath);
        throw new ApiError(415, "Unsupported file type");
    }

    const docs = await loader.load();
    const text = docs.map((doc) => doc.pageContent).join("\n\n");
    
    // Cleanup
    await fs.unlink(tempFilePath);
    
    return text;

  } catch (error) {
    // Attempt cleanup in case of error
    try {
        await fs.unlink(tempFilePath);
    } catch (e) {
        // file might not exist or other error, ignore
    }
    throw error;
  }
};
