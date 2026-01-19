const { tavily } = require("@tavily/core");

const client = tavily({
  apiKey: process.env.TAVILY_API_KEY,
});

const tavilySearch = async (query) => {
  const response = await client.search(query, {
    searchDepth: "basic",
    maxResults: 5,
  });

  if (!response?.results?.length) return "";

  return response.results
    .map((r, i) => `Source ${i + 1}: ${r.title}\n${r.content}\nURL: ${r.url}`)
    .join("\n\n");
};

module.exports = {
  tavilySearch,
};
