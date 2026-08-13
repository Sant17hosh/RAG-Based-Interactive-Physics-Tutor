import os
from backend.ingestion.pdf_extractor import extract_pdf_text
from backend.ingestion.chunker import chunk_text
from backend.ingestion.embedder import ChromaEmbedder

def main():
    print("Starting ingestion process...")
    # Paths to our PDFs
    pdf_files = [
        ("public/pdfs/chapters/electromagnetic-induction.pdf", "Electromagnetic Induction", "NCERT Chapter 6"),
        ("public/pdfs/chapters/electromagnetic-waves.pdf", "Electromagnetic Waves", "NCERT Chapter 8"),
        ("public/pdfs/practice/practice-question-paper.pdf", "Practice Question Paper", "Practice Paper")
    ]
    
    # Initialize embedder using the standard model and folder
    embedder = ChromaEmbedder(persist_directory="./vectorstore")
    
    for pdf_path, chapter_name, doc_type in pdf_files:
        if not os.path.exists(pdf_path):
            print(f"PDF not found at {pdf_path}, skipping...")
            continue
            
        print(f"Extracting text from {pdf_path}...")
        text = extract_pdf_text(pdf_path)
        if not text:
            print(f"No text extracted from {pdf_path}.")
            continue
            
        print(f"Chunking text for {chapter_name}...")
        chunks = chunk_text(text, chapter_name, chunk_size=800, overlap=100)
        
        # Add additional metadata if needed
        for c in chunks:
            c["chunk_type"] = doc_type
            
        print(f"Adding {len(chunks)} chunks to ChromaDB...")
        embedder.add_chunks(chunks)
        
    print("Ingestion complete. ChromaDB vector store is ready!")

if __name__ == "__main__":
    main()
