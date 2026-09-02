import os
import unittest
from unittest.mock import Mock, patch

import requests

os.environ.setdefault("GEMINI_API_KEY", "test-key")

from app import _KNOWLEDGE_BASE, app


class ChatRouteTests(unittest.TestCase):
    def setUp(self):
        self.client = app.test_client()

    def test_profile_data_is_loaded(self):
        self.assertIn("Q:", _KNOWLEDGE_BASE)
        self.assertIn("A:", _KNOWLEDGE_BASE)

    @patch("app.http_requests.post")
    def test_chat_sends_question_and_returns_gemini_text(self, post):
        response = Mock()
        response.json.return_value = {
            "candidates": [{"content": {"parts": [{"text": "Hello from the profile."}]}}]
        }
        post.return_value = response

        result = self.client.post("/api/chat", json={"message": "Hello"})

        self.assertEqual(result.status_code, 200)
        self.assertEqual(result.get_json(), {"reply": "Hello from the profile."})
        self.assertEqual(post.call_args.kwargs["json"]["contents"][0]["parts"][0]["text"], "Hello")
        self.assertIn("third person", post.call_args.kwargs["json"]["system_instruction"]["parts"][0]["text"].lower())
        self.assertIn("hiring", post.call_args.kwargs["json"]["system_instruction"]["parts"][0]["text"].lower())
        self.assertIn("gemini-2.5-flash", post.call_args.args[0])

    @patch("app.http_requests.post", side_effect=requests.RequestException("network failure"))
    def test_chat_returns_a_safe_service_error(self, _post):
        result = self.client.post("/api/chat", json={"message": "Hello"})

        self.assertEqual(result.status_code, 502)
        self.assertIn("temporarily unavailable", result.get_json()["reply"])


if __name__ == "__main__":
    unittest.main()
