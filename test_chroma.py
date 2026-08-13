import json
import subprocess
import sys

queries = [
    ("Faraday's law of electromagnetic induction", "Electromagnetic Induction"),
    ("displacement current electromagnetic waves", "Electromagnetic Waves"),
]

for query, chapter in queries:
    print(f"\n{'='*60}")
    print(f"Query: {query}")
    print(f"Chapter: {chapter}")
    print('='*60)
    result = subprocess.run(
        [sys.executable, "query_chroma.py", "--query", query, "--chapter", chapter, "--top_k", "2"],
        capture_output=True, text=True
    )
    # Get last line (JSON output)
    lines = result.stdout.strip().split('\n')
    json_line = lines[-1]
    chunks = json.loads(json_line)
    for i, chunk in enumerate(chunks):
        print(f"\n[Chunk {i+1}] Section: {chunk['section']}")
        print(f"  Bloom: {chunk['bloomLevel']}")
        print(f"  Content preview: {chunk['content'][:200]}...")
