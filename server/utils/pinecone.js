const { Pinecone } = require("@pinecone-database/pinecone");
const { PineconeStore } = require("@langchain/pinecone");
const { GoogleGenerativeAIEmbeddings } = require("@langchain/google-genai");
const { Document } = require("@langchain/core/documents");

// Pinecone setup
const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY,
});

const pineconeIndex = pinecone.Index(process.env.PINECONE_INDEX);

// Embedding setup
const embeddings = new GoogleGenerativeAIEmbeddings({
  model: "text-embedding-004", 
  apiKey: process.env.GEMINI_API_KEY,
});

// Embed and store
exports.embedAndStore = async ({ chunks, userId, documentId }) => {
  const docs = chunks.map((chunk, i) => 
    new Document({
      pageContent: chunk,
      metadata: {
        userId: userId.toString(),
        documentId: documentId.toString(),
        chunkIndex: i,
        text: chunk, // Keeping for compatibility
      },
    })
  );

  const ids = chunks.map((_, i) => `${documentId}_${i}`);

  const vectorStore = await PineconeStore.fromExistingIndex(embeddings, {
    pineconeIndex,
    namespace: userId.toString(),
  });

  await vectorStore.addDocuments(docs, { ids });
};

// Query Pinecone
exports.queryPinecone = async ({ userId, query }) => {
  const vectorStore = await PineconeStore.fromExistingIndex(embeddings, {
    pineconeIndex,
    namespace: userId.toString(),
  });

  const results = await vectorStore.similaritySearchWithScore(query, 5);

  if (!results || results.length === 0) return null;

  return {
    matches: results.map(([doc, score]) => ({
      score,
      metadata: {
        ...doc.metadata,
        text: doc.pageContent,
      },
    })),
  };
};

// Delete vectors (Keeping manual implementation for prefix deletion support)
exports.deleteVectors = async (namespace, documentId) => {
  const namespaceIndex = pineconeIndex.namespace(namespace);

  const listResponse = await namespaceIndex.listPaginated({
    prefix: `${documentId}_`,
  });

  if (listResponse.vectors && listResponse.vectors.length > 0) {
    const vectorIds = listResponse.vectors.map((v) => v.id);
    await namespaceIndex.deleteMany(vectorIds);
  }
};
