import sys
import json
import argparse
from backend.rag.retriever import PhysicsRetriever

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--query", type=str, required=True, help="Semantic search query")
    parser.add_argument("--chapter", type=str, default=None, help="NCERT Chapter filter name")
    parser.add_argument("--bloom", type=str, default=None, help="Bloom level filter")
    parser.add_argument("--top_k", type=int, default=3, help="Number of chunks to return")
    args = parser.parse_args()
    
    # Initialize retriever pointing to the vectorstore folder
    retriever = PhysicsRetriever(persist_dir="./vectorstore")
    
    try:
        # Query ChromaDB through the PhysicsRetriever's ChromaEmbedder
        results = retriever.embedder.query(
            query_text=args.query,
            top_k=args.top_k,
            chapter_filter=args.chapter if args.chapter else None,
            bloom_filter=args.bloom if args.bloom else None
        )
        
        output_chunks = []
        for r in results:
            output_chunks.append({
                "id": r["id"],
                "content": r["content"],
                "section": r["metadata"].get("section", "General"),
                "chapterName": r["metadata"].get("chapter", "Physics"),
                "bloomLevel": r["metadata"].get("bloom_level", "Understand")
            })
            
        print(json.dumps(output_chunks))
    except Exception as e:
        # Fallback to empty list on error
        sys.stderr.write(f"ChromaDB Query Error: {str(e)}\n")
        print(json.dumps([]))

if __name__ == "__main__":
    main()
