import os
import base64
from pathlib import Path
from typing import Any

from fastapi import FastAPI, HTTPException, UploadFile, File, Form
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, Field
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

BASE_DIR = Path(__file__).resolve().parent
STATIC_DIR = BASE_DIR / "static"

app = FastAPI(title="MindEase")

app.mount(
    "/static",
    StaticFiles(directory=str(STATIC_DIR)),
    name="static"
)


@app.get("/")
def home():
    return FileResponse(STATIC_DIR / "index.html")


# --------------------------------------------------
# Azure OpenAI
# --------------------------------------------------

def get_client():
    api_key = os.getenv("AZURE_OPENAI_API_KEY")
    endpoint = os.getenv("AZURE_OPENAI_ENDPOINT")

    if not api_key or not endpoint:
        raise HTTPException(
            status_code=500,
            detail="Azure OpenAI is not configured."
        )

    base_url = endpoint.rstrip("/")

    if not base_url.endswith("/openai/v1"):
        base_url += "/openai/v1"

    return OpenAI(
        api_key=api_key,
        base_url=base_url + "/"
    )


def get_deployment():
    deployment = os.getenv("AZURE_OPENAI_DEPLOYMENT")

    if not deployment:
        raise HTTPException(
            status_code=500,
            detail="AZURE_OPENAI_DEPLOYMENT is not configured."
        )

    return deployment


# --------------------------------------------------
# MindEase Personality
# --------------------------------------------------

SYSTEM_PROMPT = """
You are MindEase, a warm and emotionally supportive AI study companion.

Your personality is the heart of MindEase.

You are NOT cold, robotic, overly formal, or overly enthusiastic.

You speak like a calm, kind study companion sitting beside the student.

The student may come to you feeling:
- stressed
- confused
- overwhelmed
- tired
- distracted
- afraid of an exam
- unsure where to start

When the student sounds stressed or overwhelmed:
1. Acknowledge how they feel briefly.
2. Reassure them without exaggerating.
3. Give one small clear next step.
4. Do not overwhelm them with a huge answer.

Examples of your tone:
Arabic:
"ولا يهمك 🤍 خلينا نفككها خطوة خطوة."
"خذي نفس، ونبدأ بأبسط جزء."
"مو لازم تفهمين كل شيء مرة وحدة، نبدأ من هنا."
"أنا معك، وش أكثر نقطة لخبطتك؟"

English:
"You're okay 🤍 Let's take it one step at a time."
"No pressure. We'll start with the simplest part."
"You don't need to understand everything at once."
"I'm with you. Which part feels confusing?"

IMPORTANT STYLE RULES:

- Be concise.
- Prefer short paragraphs.
- Usually answer in 2–6 short sentences.
- Use simple language.
- Avoid huge walls of text.
- Avoid unnecessary headings unless they help.
- Ask only one question at a time.
- Use emojis lightly, usually 0–2.
- Never sound judgmental.
- Never make the student feel stupid for not understanding.
- Never say "this is easy" when the student is struggling.
- Never overuse "أكيد!" or generic motivational phrases.
- Do not repeat the student's entire question.
- Explain concepts using a simple example when useful.

LANGUAGE:

If the student writes Arabic, answer in natural friendly Arabic.
If the student writes English, answer in natural friendly English.
If the student asks to switch language, follow that request.

For Arabic, use natural modern Arabic with a warm Gulf/Saudi-friendly tone,
but remain understandable to Arabic speakers internationally.

STUDY BEHAVIOR:

If the student is confused:
Explain → give example → ask one tiny check question.

If the student asks for a plan:
Keep it realistic and include breaks.

If the student asks for a quiz:
Make it useful and not unnecessarily difficult.

If the student uploads a question/image/file:
First understand what is shown.
Then explain it clearly.
If there is a direct question, solve it step by step.
Do not pretend to see something that is not readable.

The goal is for students to feel:
"I can talk to MindEase without feeling judged."

MindEase should feel like a safe study space, not a strict teacher.
"""


# --------------------------------------------------
# Models
# --------------------------------------------------

class ChatRequest(BaseModel):
    message: str = Field(min_length=1)
    history: list[dict[str, Any]] = []


class ExplainRequest(BaseModel):
    topic: str = Field(min_length=1)
    level: str = "متوسط"


class QuizRequest(BaseModel):
    topic: str = Field(min_length=1)
    count: int = Field(default=5, ge=1, le=20)
    level: str = "متوسط"


class PlanRequest(BaseModel):
    subject: str = Field(min_length=1)
    exam_date: str
    hours_per_day: float = Field(default=2, gt=0, le=12)
    level: str = "متوسط"


# --------------------------------------------------
# AI helper
# --------------------------------------------------

def ask_ai(prompt: str, max_tokens: int = 1000) -> str:
    client = get_client()

    try:
        response = client.responses.create(
            model=get_deployment(),
            instructions=SYSTEM_PROMPT,
            input=prompt,
            max_output_tokens=max_tokens
        )

        answer = response.output_text

        if not answer:
            raise HTTPException(
                status_code=502,
                detail="AI returned an empty response."
            )

        return answer

    except HTTPException:
        raise

    except Exception as error:
        raise HTTPException(
            status_code=502,
            detail=f"AI request failed: {str(error)}"
        )


# --------------------------------------------------
# Chat
# --------------------------------------------------

@app.post("/api/chat")
def chat(data: ChatRequest):

    history_text = "\n".join(
        f"{item.get('role', 'user')}: {item.get('content', '')}"
        for item in data.history[-10:]
    )

    prompt = f"""
Previous conversation:
{history_text}

Current student message:
{data.message}

Respond naturally as MindEase.

Remember:
- Be warm.
- Be concise.
- If the student sounds stressed, reassure them first.
- Give one clear next step.
- Match the student's language.
"""

    return {
        "answer": ask_ai(prompt)
    }


# --------------------------------------------------
# Explain
# --------------------------------------------------

@app.post("/api/explain")
def explain(data: ExplainRequest):

    prompt = f"""
The student wants help understanding this topic:

Topic:
{data.topic}

Student level:
{data.level}

Explain it in a friendly, simple way.

Structure:

1. Simple explanation
2. One example
3. Key idea to remember
4. One very short check question

Do not make the response unnecessarily long.
"""

    return {
        "answer": ask_ai(prompt, max_tokens=1200)
    }


# --------------------------------------------------
# Quiz
# --------------------------------------------------

@app.post("/api/quiz")
def quiz(data: QuizRequest):

    prompt = f"""
Create a study quiz.

Topic:
{data.topic}

Student level:
{data.level}

Number of questions:
{data.count}

Make the questions clear and useful.

Use a mixture of:
- multiple choice
- short answer

At the end include:

Answer Key

Keep the formatting easy to read.
"""

    return {
        "answer": ask_ai(prompt, max_tokens=1800)
    }


# --------------------------------------------------
# Study Plan
# --------------------------------------------------

@app.post("/api/plan")
def plan(data: PlanRequest):

    prompt = f"""
Create a realistic study plan.

Subject:
{data.subject}

Exam date:
{data.exam_date}

Hours available per day:
{data.hours_per_day}

Student level:
{data.level}

Create a simple day-by-day plan.

Include:
- study blocks
- review
- practice
- breaks
- important topics

The plan should feel realistic rather than overwhelming.
"""

    return {
        "answer": ask_ai(prompt, max_tokens=1800)
    }


# --------------------------------------------------
# Image / File analysis
# --------------------------------------------------

@app.post("/api/analyze-file")
async def analyze_file(
    file: UploadFile = File(...),
    message: str = Form("")
):

    allowed_types = {
        "image/png",
        "image/jpeg",
        "image/webp",
        "application/pdf",
        "text/plain"
    }

    if file.content_type not in allowed_types:
        raise HTTPException(
            status_code=400,
            detail="Supported files: PNG, JPG, WEBP, PDF, TXT."
        )

    content = await file.read()

    # Keep uploads reasonably small
    if len(content) > 8 * 1024 * 1024:
        raise HTTPException(
            status_code=400,
            detail="File is too large. Please upload a file smaller than 8 MB."
        )

    client = get_client()

    encoded = base64.b64encode(content).decode("utf-8")

    user_message = message.strip()

    if not user_message:
        user_message = """
Please understand this uploaded study material and help the student.

If it is a question:
solve it and explain the reasoning.

If it is a page or document:
summarize the important ideas and explain the difficult parts.

Keep the explanation friendly and concise.
"""

    if file.content_type.startswith("image/"):

        data_url = (
            f"data:{file.content_type};base64,{encoded}"
        )

        input_content = [
            {
                "type": "input_text",
                "text": user_message
            },
            {
                "type": "input_image",
                "image_url": data_url,
                "detail": "auto"
            }
        ]

    else:

        file_data = (
            f"data:{file.content_type};base64,{encoded}"
        )

        input_content = [
            {
                "type": "input_text",
                "text": user_message
            },
            {
                "type": "input_file",
                "filename": file.filename or "study-file",
                "file_data": file_data
            }
        ]

    try:

        response = client.responses.create(
            model=get_deployment(),
            instructions=SYSTEM_PROMPT,
            input=[
                {
                    "role": "user",
                    "content": input_content
                }
            ],
            max_output_tokens=1600
        )

        answer = response.output_text

        if not answer:
            raise HTTPException(
                status_code=502,
                detail="AI returned an empty response."
            )

        return {
            "answer": answer,
            "filename": file.filename
        }

    except HTTPException:
        raise

    except Exception as error:
        raise HTTPException(
            status_code=502,
            detail=f"File analysis failed: {str(error)}"
        )


# --------------------------------------------------
# Health
# --------------------------------------------------

@app.get("/health")
def health():
    return {
        "status": "ok",
        "service": "MindEase"
    }
