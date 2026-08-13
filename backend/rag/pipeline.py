from backend.llm.deepseek_client import DeepSeekClient
from backend.rag.retriever import PhysicsRetriever
from backend.llm.prompts import TUTOR_MODE_FORMAT, TUTOR_SYSTEM_PROMPT

class RAGTutoringPipeline:
    def __init__(self, vectorstore_path: str = "./vectorstore", model_name: str = "deepseek-r1:1.5b"):
        self.retriever = PhysicsRetriever(persist_dir=vectorstore_path)
        self.llm = DeepSeekClient(model_name=model_name)

    def answer_physics_question(self, question: str, chapter_name: str = None, bloom_level: str = None) -> dict:
        """
        Executes full RAG workflow:
        1. Retrieve top context parts
        2. Construct prompt grounded on returned context
        3. Generates grounded step-by-step thinking and final answers using DeepSeek R1
        """
        # 1. Retrieve Physics NCERT context
        context_text = self.retriever.retrieve_context(
            query=question,
            chapter_filter=chapter_name,
            bloom_filter=bloom_level,
            top_k=3
        )
        
        # 2. Setup final user prompt
        prompt = TUTOR_MODE_FORMAT.format(
            question=question,
            context=context_text
        )
        
        # 3. Generate answers from Local DeepSeek
        response_text = self.llm.query(prompt=prompt, system_prompt=TUTOR_SYSTEM_PROMPT)
        
        return {
            "question": question,
            "retrieved_context": context_text,
            "answer": response_text
        }
