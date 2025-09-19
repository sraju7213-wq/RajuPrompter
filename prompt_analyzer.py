"""Prompt quality analysis powered by Google Gemini.

Installation:
    pip install google-generativeai
"""

import argparse
import json
from typing import Any, Dict

import google.generativeai as genai

API_KEY = "AIzaSyDQl5fzQpM38az-ib-Mzo6burqNvl17F6I"
MODEL_NAME = "gemini-pro"

PROMPT_TEMPLATE = """Analyze the following user prompt for its quality, clarity, creativity, and potential improvements. Provide a detailed structured response in JSON format.\n\nPrompt: "{prompt_text}"\n\nYour JSON response should include the following fields:\n    summary: A brief summary of the prompt's core idea.\n    clarity_score: An integer score from 1 (very unclear) to 5 (extremely clear).\n    creativity_score: An integer score from 1 (unoriginal) to 5 (highly creative).\n    ambiguities: A list of strings identifying any unclear or ambiguous parts of the prompt. If none, an empty list.\n    improvements: A list of strings suggesting specific ways to improve the prompt. If none, an empty list.\n    difficulty_level: A string, one of 'Easy', 'Medium', 'Hard', indicating how challenging it would be for an AI to generate good content from this prompt.\n    keywords: A list of relevant keywords or tags for this prompt.\n\nEnsure the entire output is a valid JSON object."""

genai.configure(api_key=API_KEY)


def _parse_json_response(text: str) -> Dict[str, Any]:
    cleaned = text.strip()

    if cleaned.startswith("```"):
        cleaned = "\n".join(
            line
            for line in cleaned.splitlines()
            if not line.strip().startswith("```")
        ).strip()

    try:
        return json.loads(cleaned)
    except json.JSONDecodeError:
        start = cleaned.find("{")
        end = cleaned.rfind("}")
        if start != -1 and end != -1 and start < end:
            snippet = cleaned[start : end + 1]
            return json.loads(snippet)
        raise


def analyze_prompt(prompt_text: str) -> Dict[str, Any]:
    """Analyze a prompt and return Gemini's structured response."""

    model = genai.GenerativeModel(MODEL_NAME)
    request = PROMPT_TEMPLATE.format(prompt_text=prompt_text)

    try:
        response = model.generate_content(request)
    except Exception as exc:  # pragma: no cover - network issues
        raise RuntimeError("Gemini API request failed") from exc

    if not response or not getattr(response, "text", None):
        raise ValueError("No response content returned by Gemini")

    try:
        return _parse_json_response(response.text)
    except (json.JSONDecodeError, TypeError) as exc:
        raise ValueError("Gemini response was not valid JSON") from exc


def _build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        description="Analyze prompt quality using the Gemini API",
    )
    parser.add_argument(
        "prompt",
        nargs="?",
        default=(
            "Write a detailed description of a futuristic city that blends nature "
            "with advanced technology."
        ),
        help="Prompt text to analyze",
    )
    return parser


def main() -> None:
    parser = _build_parser()
    args = parser.parse_args()

    analysis = analyze_prompt(args.prompt)
    print(json.dumps(analysis, indent=2, ensure_ascii=False))


if __name__ == "__main__":  # pragma: no cover
    main()
