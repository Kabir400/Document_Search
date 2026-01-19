const { Pinecone } = require("@pinecone-database/pinecone");
const axios = require("axios");
const { GoogleGenerativeAI } = require("@google/generative-ai");

//pinecone setup-
const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY,
});

const index = pinecone.Index(process.env.PINECONE_INDEX);

// Gemini setup
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const embeddingModel = genAI.getGenerativeModel({
  model: "text-embedding-004",
});

//embeding function-
async function embedText(text) {
  const result = await embeddingModel.embedContent(text);
  return result.embedding.values;
}

//embed and store-
exports.embedAndStore = async ({ chunks, userId, documentId }) => {
  const vectors = [];
  const namespace = userId.toString();

  for (let i = 0; i < chunks.length; i++) {
    const embedding = await embedText(chunks[i]);

    vectors.push({
      id: `${documentId}_${i}`,
      values: embedding,
      metadata: {
        userId: userId.toString(),
        documentId,
        chunkIndex: i,
        text: chunks[i],
      },
    });
  }

  await index.namespace(namespace).upsert(vectors);
};
//query pinecone-
exports.queryPinecone = async ({ userId, query }) => {
  const embedding = await embedText(query);

  const namespaceIndex = index.namespace(userId);

  const result = await namespaceIndex.query({
    vector: embedding,
    topK: 5,
    includeMetadata: true,
  });

  if (!result.matches || result.matches.length === 0) return null;

  return {
    score: result.matches[0].score,
    matches: result.matches,
  };
};

//delete vectors-
exports.deleteVectors = async (namespace, documentId) => {
  const namespaceIndex = index.namespace(namespace);

  // Fetch all vectors with IDs starting with documentId
  const listResponse = await namespaceIndex.listPaginated({
    prefix: `${documentId}_`,
  });

  if (listResponse.vectors && listResponse.vectors.length > 0) {
    const vectorIds = listResponse.vectors.map((v) => v.id);
    await namespaceIndex.deleteMany(vectorIds);
  }
};
