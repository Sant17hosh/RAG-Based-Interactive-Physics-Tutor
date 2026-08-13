import re
from typing import List, Dict, Any

def chunk_text(text: str, chapter_name: str, chunk_size: int = 800, overlap: int = 100) -> List[Dict[str, Any]]:
    """
    Splits text intelligently into sections or character-based chunks with overlap.
    Assigns metadata (chapter, chunk type, likely Bloom taxonomy level).
    """
    # Clean spacing
    text = re.sub(r'\s+', ' ', text)
    
    chunks = []
    start = 0
    chunk_idx = 0
    
    while start < len(text):
        end = min(start + chunk_size, len(text))
        chunk_content = text[start:end]
        
        # Deduce a section name from text if available (looks like "11.1 Introduction" or "3.4 Uniform motion")
        section_match = re.search(r'\b\d+\.\d+\s+[A-Z][a-zA-Z\s]+', chunk_content)
        section_name = section_match.group(0) if section_match else f"{chapter_name} general section"
        
        # Deduct a likely Bloom level based on verb content
        bloom_level = "Understand"
        lower_content = chunk_content.lower()
        if any(v in lower_content for v in ["define", "stat", "list", "name", "recall", "si unit"]):
            bloom_level = "Remember"
        elif any(v in lower_content for v in ["apply", "derive", "calculat", "solve", "find velocity"]):
            bloom_level = "Apply"
        elif any(v in lower_content for v in ["compare", "analyz", "explain why", "deduc", "consequence"]):
            bloom_level = "Analyze"
        elif any(v in lower_content for v in ["evaluate", "prove", "assess", "carnot efficiency", "limit"]):
            bloom_level = "Evaluate"

        chunks.append({
            "id": f"{chapter_name.lower().replace(' ', '-')}-chunk-{chunk_idx}",
            "chapter": chapter_name,
            "section": section_name,
            "content": chunk_content,
            "chunk_type": "text_body",
            "bloom_level": bloom_level
        })
        
        chunk_idx += 1
        start += (chunk_size - overlap)
        
    return chunks
