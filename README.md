# Offline Karnataka Board Physics Tutor

This is a beautiful, client-aligned Karnataka 1st PUC Physics Board revision simulator, fully optimized to work **100% offline** on your local machine using **Ollama** and the highly efficient **phi3:mini** LLM.

---

## 📋 Environment Variables Answered

In your workspace, you questioned if the following variables are needed in your `.env` file:
```env
OLLAMA_URL=http://localhost:11434
OLLAMA_MODEL=phi3:mini
TOP_K=1
CHUNK_SIZE=300
CHUNK_OVERLAP=30
```

### The Verdict:
1. **`OLLAMA_URL` and `OLLAMA_MODEL`**: Optional but **recommended**.
   - The application is robustly hardcoded to fall back to `http://localhost:11434` and `phi3:mini` automatically if these variables are omitted.
   - However, keeping them allows you to easily switch to other models (like `llama3`, `mistral`, or `gemma`) or run Ollama on a different IP/port.
2. **`TOP_K`, `CHUNK_SIZE`, and `CHUNK_OVERLAP`**: **No, they are NOT needed**.
   - The NCERT dataset parsing is integrated static data, and these variables are not referenced anywhere in the active codebase. You can safely delete them from your `.env` file.

---

## 🚀 How to Run Locally in VS Code (Offline Setup)

Follow these simple, step-by-step commands to get the application running on your computer.

### Step 1: Install & Start Ollama
1. Download Ollama from the official website: [ollama.com](https://ollama.com/).
2. Install the app on your computer.
3. Open your terminal (or Command Prompt) and pull the lightweight **phi-3** model:
   ```bash
   ollama pull phi3:mini
   ```
4. Verify Ollama is running and has the model loaded:
   ```bash
   ollama run phi3:mini
   ```
   *(You can type a quick prompt like "hello" to verify it responds instantly, then type `/exit` to close the interactive session).*

---

### Step 2: Configure Your local `.env` File
Create a `.env` file in the root folder of this project with the following configuration:
```env
OLLAMA_URL=http://localhost:11434
OLLAMA_MODEL=phi3:mini
```

---

### Step 3: Run the Application in VS Code
Open the project folder in VS Code, open a new integrated Terminal, and run the following commands:

1. **Install Node.js dependencies**:
   ```bash
   npm install
   ```

2. **Run in Development Mode**:
   ```bash
   npm run dev
   ```
   This will run the express backend bundled with Vite. The express backend automatically serves the client pages and handles RAG queries.
   
3. **Open the Application**:
   Open your browser and navigate to the address output in the terminal (typically **`http://localhost:3000`**).

---

## 🛠️ Offline Fallback Mechanism

For test-running the app in sandbox environments or when you are traveling and don't have Ollama active, the app now includes a **bulletproof offline fallback engine**. 

If the Ollama server is unreachable, the system will gracefully handle the request and apply customized NCERT-grounded heuristics to score your student mock sheets on-the-fly, displaying a notice indicating that the offline rules fallback is active instead of crashing the interface with an `OLLAMA_OFFLINE` exception.
