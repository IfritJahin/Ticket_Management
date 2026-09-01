import os

from dotenv import load_dotenv
from google import genai
from pydantic import BaseModel
from typing import Literal


load_dotenv()


class TicketTriage(BaseModel):
    category: Literal[
        "billing",
        "account",
        "technical",
        "feature_request",
        "general",
    ]

    urgency: Literal[
        "low",
        "medium",
        "high",
    ]


class AIServiceError(Exception):
    """Raised when ticket triage cannot be completed by Gemini."""


def categorize_ticket(subject: str, message: str):
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise AIServiceError("Gemini is not configured")


    prompt = f"""
        You are a support ticket classifier.

        Classify this support ticket.

        Allowed categories:
        - billing
        - account
        - technical
        - feature_request
        - general

        Allowed urgency:
        - low
        - medium
        - high

        Subject:
        {subject}

        Message:
        {message}

        Choose the most appropriate category and urgency.
        """
    # Use Gemini to classify the ticket instead of relying on
    # hard-coded keyword rules. Structured output ensures the
    # response contains only our allowed category and urgency values.


    try:
        client = genai.Client(api_key=api_key)
        response = client.models.generate_content(
            model="gemini-3.5-flash-lite",
            contents=prompt,
            config={
                "response_mime_type": "application/json",
                "response_schema": TicketTriage,
            },
        )
        result = TicketTriage.model_validate(response.parsed)
    except Exception as exc:
        raise AIServiceError("Ticket categorization is temporarily unavailable") from exc

    return {
        "category": result.category,
        "urgency": result.urgency,
    }
