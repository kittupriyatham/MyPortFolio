import os
import unittest
from unittest.mock import Mock, patch
from types import SimpleNamespace

os.environ.setdefault("GEMINI_API_KEY", "test-key")

from app import _KNOWLEDGE_BASE, app


class ChatRouteTests(unittest.TestCase):
    def setUp(self):
        self.client = app.test_client()

    def test_profile_data_is_loaded(self):
        self.assertIn("Q:", _KNOWLEDGE_BASE)
        self.assertIn("A:", _KNOWLEDGE_BASE)

    @patch("app._create_gemini_client")
    def test_chat_sends_question_and_returns_gemini_text(self, create_client):
        response = Mock()
        response.text = "Hello from the profile."

        chat_session = Mock()
        chat_session.send_message.return_value = response

        chats = Mock()
        chats.create.return_value = chat_session

        client = Mock()
        client.chats = chats
        create_client.return_value = client

        result = self.client.post("/api/chat", json={"message": "Hello"})

        self.assertEqual(result.status_code, 200)
        self.assertEqual(result.get_json(), {"reply": "Hello from the profile."})
        self.assertEqual(chat_session.send_message.call_args.args[0], "Hello")
        self.assertIn("third person", chats.create.call_args.kwargs["config"].system_instruction.lower())
        self.assertIn("hiring", chats.create.call_args.kwargs["config"].system_instruction.lower())
        self.assertIn("gemini-3.5-flash-lite", chats.create.call_args.kwargs["model"])

    @patch("app._create_gemini_client")
    def test_chat_returns_a_safe_service_error(self, create_client):
        chat_session = Mock()
        chat_session.send_message.side_effect = ValueError("network failure")

        chats = Mock()
        chats.create.return_value = chat_session

        client = Mock()
        client.chats = chats
        create_client.return_value = client

        result = self.client.post("/api/chat", json={"message": "Hello"})

        self.assertEqual(result.status_code, 502)
        self.assertIn("temporarily unavailable", result.get_json()["reply"])

    @patch("app.genai_errors", new=SimpleNamespace(APIError=Exception))
    @patch("app._create_gemini_client")
    def test_chat_returns_access_denied_message_for_gemini_403(self, create_client):
        class ForbiddenGeminiError(Exception):
            code = 403

        chat_session = Mock()
        chat_session.send_message.side_effect = ForbiddenGeminiError(
            "403 PERMISSION_DENIED. {'error': {'code': 403, 'status': 'PERMISSION_DENIED'}}"
        )

        chats = Mock()
        chats.create.return_value = chat_session

        client = Mock()
        client.chats = chats
        create_client.return_value = client

        result = self.client.post("/api/chat", json={"message": "Hello"})

        self.assertEqual(result.status_code, 503)
        self.assertIn("not configured for this Gemini project or model", result.get_json()["reply"])


if __name__ == "__main__":
    unittest.main()
