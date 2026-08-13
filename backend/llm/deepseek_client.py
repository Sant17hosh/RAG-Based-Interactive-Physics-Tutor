import ollama
from backend.llm.prompts import TUTOR_SYSTEM_PROMPT

class DeepSeekClient:
    def __init__(self, model_name: str = "deepseek-r1:1.5b"):
        self.model_name = model_name

    def query(self, prompt: str, system_prompt: str = TUTOR_SYSTEM_PROMPT) -> str:
        """
        Sends requests to local Ollama daemon hosting DeepSeek R1 1.5B
        """
        try:
            response = ollama.generate(
                model=self.model_name,
                prompt=prompt,
                system=system_prompt,
                options={
                    "temperature": 0.2
                }
            )
            return response.get("response", "No response received.")
        except Exception as e:
            return f"Ollama query failed: {str(e)}. Please check if 'ollama serve' is active and '{self.model_name}' is pulled."
