const TOKEN_LIMIT = 700;
const TOKEN_OVERLAP = 100;

// Very simple tokenizer approximation (works well enough in practice)
function tokenize(text) {
  return text.split(/\s+/);
}

exports.chunkText = (text) => {
  const tokens = tokenize(text);
  const chunks = [];

  let start = 0;
  while (start < tokens.length) {
    const end = start + TOKEN_LIMIT;
    const chunk = tokens.slice(start, end).join(" ");
    chunks.push(chunk);

    start += TOKEN_LIMIT - TOKEN_OVERLAP;
  }

  return chunks;
};
