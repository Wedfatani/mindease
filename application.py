import os
from pathlib import Path
from typing import List

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, Field
from openai import OpenAI

load_dotenv()

BASE_DIR = Path(__file__).resolve().parent
STATIC_DIR = BASE_DIR / "static"

app = FastAPI(
    title="MindEase",
    version="1.0.0"
)

app.mount(
    "/static",
    StaticFiles(directory=STATIC_DIR),
    name="static"
)

# =========================
# Azure OpenAI Configuration
# =========================

AZURE_OPENAI_ENDPOINT = os.getenv(
    "AZURE_OPENAI_ENDPOINT",
    ""
).rstrip("/")

AZURE_OPENAI_API_KEY = os.getenv(
    "AZURE_OPENAI_API_KEY",
    ""
)

AZURE_OPENAI_DEPLOYMENT = os.getenv(
    "AZURE_OPENAI_DEPLOYMENT",
    ""
)

client = None

if (
    AZURE_OPENAI_ENDPOINT
    and AZURE_OPENAI_API_KEY
    and AZURE_OPENAI_DEPLOYMENT
):
    client = OpenAI(
        api_key=AZURE_OPENAI_API_KEY,
        base_url=f"{AZURE_OPENAI_ENDPOINT}/openai/v1/"
    )


# =========================
# MindEase AI Personality
# =========================

SYSTEM_PROMPT = """
أنت MindEase، مساعد دراسة ذكي باللغة العربية.

هدفك الأساسي هو مساعدة الطالب على:
- فهم الدروس.
- المذاكرة بطريقة منظمة.
- التدريب على الأسئلة.
- اكتشاف نقاط الضعف.
- بناء خطط دراسة.
- الاستعداد للاختبارات.

أنت لست مجرد chatbot عام.

قواعدك:

1. اشرح بطريقة بسيطة ومناسبة لمستوى الطالب.
2. استخدم أمثلة وتشبيهات عندما تكون مفيدة.
3. لا تعطِ الحل النهائي مباشرة في الأسئلة التدريبية إذا كان من الأفضل أن تساعد الطالب خطوة بخطوة.
4. إذا طلب الطالب شرح موضوع، ابدأ بالفكرة الأساسية ثم التفاصيل.
5. استخدم عناوين ونقاط واضحة.
6. اجعل إجاباتك باللغة العربية ما لم يطلب الطالب لغة أخرى.
7. في نهاية الشرح اقترح سؤال تحقق أو تدريب قصير.
8. إذا كانت المعلومة غير مؤكدة، لا تخترعها.
9. حافظ على أسلوب مشجع وهادئ.
10. هدف MindEase هو أن يفهم الطالب، وليس فقط أن يحصل على الإجابة.
"""


# =========================
# Request Models
# =========================

class ChatMessage(BaseModel):
    role: str
    content: str


class ChatRequest(BaseModel):
    message: str = Field(
        min_length=1,
        max_length=8000
    )

    history: List[ChatMessage] = []


class ExplainRequest(BaseModel):
    topic: str = Field(
        min_length=1,
        max_length=3000
    )

    level: str = "متوسط"


class QuizRequest(BaseModel):
    topic: str = Field(
        min_length=1,
        max_length=2000
    )

    count: int = Field(
        default=5,
        ge=3,
        le=10
    )

    level: str = "متوسط"


class PlanRequest(BaseModel):
    subject: str = Field(
        min_length=1,
        max_length=300
    )

    exam_date: str = Field(
        min_length=4,
        max_length=50
    )

    hours_per_day: float = Field(
        default=2,
        ge=0.5,
        le=12
    )

    level: str = "متوسط"


# =========================
# AI Function
# =========================

def ask_ai(messages, max_output_tokens=900):

    if client is None:
        raise HTTPException(
            status_code=500,
            detail=(
                "AI is not configured. "
                "Add AZURE_OPENAI_ENDPOINT, "
                "AZURE_OPENAI_API_KEY and "
                "AZURE_OPENAI_DEPLOYMENT."
            )
        )

    try:

        response = client.responses.create(
            model=AZURE_OPENAI_DEPLOYMENT,
            input=messages,
            max_output_tokens=max_output_tokens
        )

        return response.output_text

    except Exception as exc:

        raise HTTPException(
            status_code=502,
            detail=f"AI request failed: {exc}"
        )


# =========================
# Website
# =========================

@app.get("/")
def home():

    return FileResponse(
        STATIC_DIR / "index.html"
    )


# =========================
# Health Check
# =========================

@app.get("/health")
def health():

    return {
        "ok": True,
        "app": "MindEase",
        "ai_configured": client is not None
    }


# =========================
# Chat# =========================

@app.post("/api/chat")
def chat(req: ChatRequest):

    history = []

    for item in req.history[-12:]:

        if item.role in {
            "user",
            "assistant"
        }:

            history.append({
                "role": item.role,
                "content": item.content
            })

    messages = [
        {
            "role": "system",
            "content": SYSTEM_PROMPT
        }
    ]

    messages.extend(history)

    messages.append({
        "role": "user",
        "content": req.message
    })

    answer = ask_ai(
        messages,
        1000
    )

    return {
        "answer": answer
    }


# =========================
# Explain Lesson
# =========================

@app.post("/api/explain")
def explain(req: ExplainRequest):

    prompt = f"""
اشرح للطالب الموضوع التالي:

{req.topic}

مستوى الطالب:
{req.level}

رتب الإجابة كالتالي:

1. الفكرة الأساسية.
2. شرح مبسط خطوة بخطوة.
3. مثال واضح.
4. خطأ شائع يجب الانتباه له.
5. سؤال تحقق قصير في النهاية.
"""

    answer = ask_ai(
        [
            {
                "role": "system",
                "content": SYSTEM_PROMPT
            },
            {
                "role": "user",
                "content": prompt
            }
        ],
        1200
    )

    return {
        "answer": answer
    }


# =========================
# Quiz
# =========================

@app.post("/api/quiz")
def quiz(req: QuizRequest):

    prompt = f"""
أنشئ اختباراً تعليمياً من {req.count} أسئلة
عن الموضوع:

{req.topic}

مستوى الطالب:
{req.level}

المطلوب:

- أسئلة اختيار من متعدد.
- أسئلة قصيرة عند الحاجة.
- لا تعرض الإجابة بجانب السؤال.
- في النهاية ضع قسم بعنوان:

مفتاح الإجابة

ثم ضع الإجابة الصحيحة مع شرح مختصر.
"""

    answer = ask_ai(
        [
            {
                "role": "system",
                "content": SYSTEM_PROMPT
            },
            {
                "role": "user",
                "content": prompt
            }
        ],
        1400
    )

    return {
        "answer": answer
    }


# =========================
# Study Plan
# =========================

@app.post("/api/plan")
def plan(req: PlanRequest):

    prompt = f"""
أنشئ خطة دراسة عملية لمادة:

{req.subject}

تاريخ الاختبار:
{req.exam_date}

عدد الساعات المتاحة يومياً:
{req.hours_per_day}

مستوى الطالب:
{req.level}

قسّم الخطة إلى:

1. مرحلة الفهم.
2. مرحلة التدريب.
3. مرحلة المراجعة.
4. الاختبارات التجريبية.

اجعل الخطة واقعية وقابلة للتنفيذ.
واقترح فواصل قصيرة أثناء الدراسة.
"""

    answer = ask_ai(
        [
            {
                "role": "system",
                "content": SYSTEM_PROMPT
            },
            {
                "role": "user",
                "content": prompt
            }
        ],
        1400
    )

    return {
        "answer": answer
    }
