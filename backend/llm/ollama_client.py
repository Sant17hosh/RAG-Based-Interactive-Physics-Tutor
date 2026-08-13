import os
import requests
from backend.llm.prompts import TUTOR_SYSTEM_PROMPT

class OllamaClient:
    def __init__(self, model_name: str = None, url: str = None):
        self.model_name = model_name or os.getenv("OLLAMA_MODEL", "phi3:mini")
        self.url = url or os.getenv("OLLAMA_URL", "http://localhost:11434")

    def query(self, prompt: str, system_prompt: str = TUTOR_SYSTEM_PROMPT, format_json: bool = False) -> str:
        """
        Sends generation requests to the centralized Ollama API: /api/generate
        """
        try:
            # First check if Ollama is running
            tags_url = f"{self.url.rstrip('/')}/api/tags"
            try:
                check_resp = requests.get(tags_url, timeout=3)
                check_resp.raise_for_status()
            except Exception:
                return (
                    f"OLLAMA_ERROR: Ollama service is offline or unreachable at {self.url}. "
                    "Please execute 'ollama serve' first to boot the local model daemon."
                )

            # Check if the desired model is downloaded
            models_list = check_resp.json().get("models", [])
            downloaded_model_names = [m.get("name") for m in models_list]
            downloaded_model_specs = [m.get("model") for m in models_list]
            
            model_exists = False
            for spec in downloaded_model_names + downloaded_model_specs:
                if spec and (self.model_name in spec or spec in self.model_name):
                    model_exists = True
                    break

            if not model_exists:
                return (
                    f"OLLAMA_MODEL_ERROR: Selected model '{self.model_name}' is not pulled. "
                    f"Please pull this model locally by running 'ollama pull {self.model_name}'."
                )

            # Fire standard completion request
            generate_url = f"{self.url.rstrip('/')}/api/generate"
            payload = {
                "model": self.model_name,
                "prompt": prompt,
                "system": system_prompt,
                "stream": False,
                "options": {
                    "temperature": 0.2
                }
            }
            if format_json:
                payload["format"] = "json"

            resp = requests.post(generate_url, json=payload, timeout=60)
            resp.raise_for_status()
            return resp.json().get("response", "No response received.")
            
        except Exception as e:
            return f"Ollama execution error: {str(e)}"
