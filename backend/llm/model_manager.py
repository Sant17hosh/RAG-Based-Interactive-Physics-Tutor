import os
import requests

class ModelManager:
    def __init__(self, ollama_url: str = None):
        self.url = ollama_url or os.getenv("OLLAMA_URL", "http://localhost:11434")
        self.supported_models = [
            "phi3:mini",
            "llama3.2:3b",
            "mistral",
            "phi3",
            "qwen2.5",
            "gemma"
        ]

    def check_health(self) -> dict:
        """
        Check if Ollama service is reachable, and identify if the currently set model exists.
        """
        current_model = os.getenv("OLLAMA_MODEL", "phi3:mini")
        status = {
            "ollama_running": False,
            "current_model": current_model,
            "current_model_available": False,
            "available_models": []
        }
        
        try:
            tags_url = f"{self.url.rstrip('/')}/api/tags"
            resp = requests.get(tags_url, timeout=3)
            if resp.status_code == 200:
                status["ollama_running"] = True
                models_data = resp.json().get("models", [])
                
                downloaded_names = []
                for m in models_data:
                    name = m.get("name")
                    model_spec = m.get("model")
                    if name:
                        downloaded_names.append(name)
                    if model_spec and model_spec not in downloaded_names:
                        downloaded_names.append(model_spec)

                status["available_models"] = downloaded_names
                
                # Check availability of configured model
                for spec in downloaded_names:
                    if spec and (current_model in spec or spec in current_model):
                        status["current_model_available"] = True
                        break
        except Exception:
            pass # remains False
            
        return status

    def pull_model(self, model_name: str) -> dict:
        """
        Sends pull request to local Ollama.
        """
        pull_url = f"{self.url.rstrip('/')}/api/pull"
        try:
            resp = requests.post(pull_url, json={"name": model_name, "stream": False}, timeout=120)
            if resp.status_code == 200:
                return {"status": "success", "message": f"Successfully pulled model original metadata '{model_name}'"}
            else:
                return {"status": "failed", "message": f"Server returned error code {resp.status_code}"}
        except Exception as e:
            return {"status": "failed", "message": f"Exception raised during attempt: {str(e)}"}

    def get_supported_models(self) -> list:
        return self.supported_models
