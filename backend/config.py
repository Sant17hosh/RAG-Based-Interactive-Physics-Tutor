import os
from dotenv import load_dotenv

load_dotenv()

# Server-wide configurations
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
VECTORSTORE_DIR = os.path.join(BASE_DIR, "vectorstore")
RAW_PDFS_DIR = os.path.join(BASE_DIR, "data", "raw_pdfs")

OLLAMA_MODEL = os.getenv("OLLAMA_MODEL", "deepseek-r1:1.5b")
OLLAMA_HOST = os.getenv("OLLAMA_HOST", "http://localhost:11434")
