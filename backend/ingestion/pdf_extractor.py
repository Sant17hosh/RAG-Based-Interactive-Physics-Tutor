import os
import pdfplumber

def extract_pdf_text(pdf_path: str) -> str:
    """
    Given a path to a Class 11 NCERT Physics chapter PDF,
    extracts, cleans, and returns raw text without page numbers, headers, and footers.
    """
    if not os.path.exists(pdf_path):
        print(f"File not found: {pdf_path}")
        return ""

    full_text = []
    with pdfplumber.open(pdf_path) as pdf:
        for idx, page in enumerate(pdf.pages):
            text = page.extract_text()
            if not text:
                continue
            
            # Simple cleaning criteria (remove headers/footers containing 'Chapter' or numbers at bounds)
            lines = text.split("\n")
            cleaned_lines = []
            for line in lines:
                striped = line.strip()
                # Exclude lines that are solely numeric (likely page numbers)
                if striped.isdigit():
                    continue
                # Exclude standard headers
                if "PHYSICS" in striped or "Rationalised" in striped or "Chapter" in striped:
                    continue
                cleaned_lines.append(line)
            
            full_text.append("\n".join(cleaned_lines))
            
    return "\n\n".join(full_text)

if __name__ == "__main__":
    print("PDF Extractor initialized.")
