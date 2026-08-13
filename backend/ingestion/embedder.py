import chromadb
from sentence_transformers import SentenceTransformer
from typing import List, Dict, Any

class ChromaEmbedder:
    def __init__(self, persist_directory: str = "./vectorstore", model_name: str = "sentence-transformers/all-MiniLM-L6-v2"):
        # Initialize sentence-transformers model
        self.encoder = SentenceTransformer(model_name)
        
        # Initialize chroma client
        self.chroma_client = chromadb.PersistentClient(path=persist_directory)
        
        # Create or fetch collection
        self.collection = self.chroma_client.get_or_create_collection(
            name="karnataka_1st_puc_physics",
            metadata={"hnsw:space": "cosine"}
        )

    def add_chunks(self, chunks: List[Dict[str, Any]]):
        """
        Embeds texts and stores them directly in ChromaDB
        """
        ids = [c["id"] for c in chunks]
        texts = [c["content"] for c in chunks]
        
        # Build metadata arrays for query filters
        metadatas = [{
            "chapter": c["chapter"],
            "section": c["section"],
            "bloom_level": c["bloom_level"],
            "chunk_type": c["chunk_type"]
        } for c in chunks]
        
        # Generate embeddings on CPU
        embeddings = self.encoder.encode(texts, show_progress_bar=True).tolist()
        
        # Insert into collection
        self.collection.add(
            ids=ids,
            embeddings=embeddings,
            documents=texts,
            metadatas=metadatas
        )
        print(f"Successfully added {len(ids)} document chunks to ChromaDB vector store.")

    def query(self, query_text: str, top_k: int = 3, chapter_filter: str = None, bloom_filter: str = None) -> List[Dict[str, Any]]:
        """
        Retrieves top_k context paragraphs matching the query semantic meaning
        """
        query_embedding = self.encoder.encode([query_text]).tolist()[0]
        
        # Optional filters mapping
        where_filter = {}
        if chapter_filter:
            where_filter["chapter"] = chapter_filter
        if bloom_filter:
            where_filter["bloom_level"] = bloom_filter
            
        results = self.collection.query(
            query_embeddings=[query_embedding],
            n_results=top_k,
            where=where_filter if where_filter else None
        )
        
        out_chunks = []
        if results and "documents" in results and len(results["documents"]) > 0:
            docs = results["documents"][0]
            metas = results["metadatas"][0]
            ids = results["ids"][0]
            
            for i in range(len(docs)):
                out_chunks.append({
                    "id": ids[i],
                    "content": docs[i],
                    "metadata": metas[i]
                })
        
        return out_chunks
