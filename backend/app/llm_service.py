from google import genai
from app.config import GOOGLE_GEMINI_API_KEY
import logging

logger = logging.getLogger(__name__)

class LLMService:
    def __init__(self):
        self.client = genai.Client(api_key=GOOGLE_GEMINI_API_KEY)
        self.model = "gemini-2.5-flash"

    def generate_user_response(self, rating: int, review: str) -> str:
        """Generate a user-facing AI response to the review"""
        try:
            prompt = f"""You are a helpful customer service AI. A user has submitted the following feedback:

Rating: {rating}/5
Review: {review}

Generate a warm, empathetic, and professional response to acknowledge their feedback. Keep it concise (2-3 sentences). 
If the review is negative, offer to help resolve the issue. If positive, thank them for their kind words."""

            response = self.client.models.generate_content(
                model=self.model,
                contents=prompt,
                config={
                    "temperature": 0.9
                }
            )
            
            if response.text:
                return response.text.strip()
            return "Thank you for your feedback!"
        except Exception as e:
            logger.error(f"Error generating user response: {e}")
            return "Thank you for your feedback! We appreciate your input."

    def generate_summary(self, review: str) -> str:
        """Generate a summary of the review for admin dashboard"""
        try:
            prompt = f"""Summarize the following customer review in 1-2 sentences for internal use:

Review: {review}

Provide a concise summary that captures the main points."""

            response = self.client.models.generate_content(
                model=self.model,
                contents=prompt,
                config={
                    "temperature": 0.5
                }
            )
            
            if response.text:
                return response.text.strip()
            return "Review received"
        except Exception as e:
            logger.error(f"Error generating summary: {e}")
            return "Review received"

    def generate_recommended_actions(self, rating: int, review: str) -> str:
        """Generate recommended actions for admin to take"""
        try:
            prompt = f"""Based on the following customer review, suggest 1-2 recommended actions for the support team:

Rating: {rating}/5
Review: {review}

Provide specific, actionable recommendations (e.g., "Follow up with customer", "Escalate to management", "Document as feature request", etc.)"""

            response = self.client.models.generate_content(
                model=self.model,
                contents=prompt,
                config={
                    "temperature": 0.6
                }
            )
            
            if response.text:
                return response.text.strip()
            return "Review and categorize feedback"
        except Exception as e:
            logger.error(f"Error generating recommended actions: {e}")
            return "Review and categorize feedback"
