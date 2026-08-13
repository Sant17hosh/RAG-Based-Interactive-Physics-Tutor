from backend.ingestion.embedder import ChromaEmbedder
from typing import List, Dict, Any

class PhysicsRetriever:
    def __init__(self, persist_dir: str = "./vectorstore"):
        self.embedder = ChromaEmbedder(persist_directory=persist_dir)

    def retrieve_context(self, query: str, chapter_id: str = None, bloom_level: str = None, top_k: int = 3) -> str:
        """
        Queries ChromaDB for context segments and returns standard concatenated text block
        """
        results = self.embedder.query(
            query_text=query,
            top_k=top_k,
            chapter_filter=chapter_id,
            bloom_filter=bloom_level
        )
        
        if not results:
            return "No NCERT textbook paragraphs matching query found."
            
        context_blocks = []
        for idx, res in enumerate(results):
            meta = res["metadata"]
            context_blocks.append(
                f"[Chunk {idx+1} | Chapter: {meta.get('chapter', 'Physics')} | Section: {meta.get('section', 'General')}]\n"
                f"{res['content']}"
            )
            
        return "\n\n".join(context_blocks)
