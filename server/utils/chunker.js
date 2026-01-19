const { RecursiveCharacterTextSplitter } = require("@langchain/textsplitters");
const ApiError = require("./ApiError.js");

exports.chunkText = async (text) => {
  if (!text) return [];

  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 500,
    chunkOverlap: 100,
  });

  const output = await splitter.createDocuments([text]);
  return output.map((doc) => doc.pageContent);
};
