# Enterprise Document RAG & Q&A Automation 🚀

This application is designed specifically for companies managing large volumes of documentation. It automates the process of answering frequently asked questions by allowing users to upload their own documents (PDFs, etc.) and "train" the AI. The system then uses Retrieval Augmented Generation (RAG) to provide accurate answers based on the uploaded content.

If the answer cannot be found within the provided documents, the system seamlessly falls back to a **Web Search** (Google Search integration) to fetch real-time information, ensuring comprehensive responses every time.

## 🌟 Key Features

*   **RAG (Retrieval Augmented Generation)**: Connects an LLM to your custom data, enabling it to answer questions based on your specific documents.
*   **Smart Fallback**: Integrated **Google Search/Web Search** tool allows the AI to fetch external information when the answer isn't in your knowledge base.
*   **Structured Output**: AI responses are formatted in structured JSON for consistent application behavior.
*   **Document Processing**: Efficiently handles document loading, text splitting, and embedding generation.
*   **Stateful Workflows**: Advanced versions use LangGraph to manage conversation loops and complex reasoning steps.

## 🛠️ Tech Stack

*   **Frontend**: Next.js, React, TailwindCSS
*   **Backend**: Node.js, Express.js
*   **AI/LLM**: Google Generative AI (Gemini)
*   **Vector Database**: Pinecone
*   **Search**: Tavily / Google Search API
*   **Frameworks**: LangChain, LangGraph (in specific versions)

## 🌿 Available Versions

This project is available in three progressively advanced versions, each in its own branch:

1.  **`without-langchain/langgraph`**: A manual, raw implementation of the RAG pipeline. Best for understanding the core mechanics of RAG without abstraction layers.
2.  **`with-langchain`**: Refactored to use the **LangChain** ecosystem. This simplifies document loading, text splitting, and tool calling.
3.  **`with-langchainAndLanggraph`**: The most advanced version, incorporating **LangGraph**. This introduces stateful workflows, allowing the AI to cycle through steps (e.g., "search again" or "ask for clarity") intelligently.

## � How to Set Up

### Prerequisites
Ensure you have the following installed/configured:
*   Node.js & npm
*   API Keys for:
    *   Google Gemini (LLM)
    *   Pinecone (Vector DB)
    *   Tavily or Google Search (Search Tool)

### 1. Backend Setup (Server)
Navigate to the `server` directory and install dependencies:
```bash
cd server
npm install
```
Create a `.env` file in the `server` directory with the following variables:
```env
MONGO_URI=mongodb://127.0.0.1:27017/test_agent
TOKEN_SECRET_KEY=jgkajgjkajgkjdgkjdgkajkadjgkajgklajkljg
PINECONE_API_KEY=your_pinecone_api_key
PINECONE_INDEX=test
TAVILY_API_KEY=your_tavily_api_key
GEMINI_API_KEY=your_gemini_api_key
```
Start the server:
```bash
node index.js
```

### 2. Frontend Setup (Client)
Navigate to the `client` directory and install dependencies:
```bash
cd client
npm install
```
Start the development server:
```bash
npm run dev
```

## 📸 Application Screenshots

**Login Page**
![Login Page](./screenshot/login.png)

**Training the AI (Document Upload)**
![Train AI Page](./screenshot/train-model.png)

**Chatting with your Data**
![Chat Page](./screenshot/chat.png)
