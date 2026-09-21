from fastapi import FastAPI, Form
from fastapi.responses import HTMLResponse

app = FastAPI()


@app.get("/", response_class=HTMLResponse)
async def home():
    return """
    <!DOCTYPE html>
    <html lang="ar" dir="rtl">
    <head>
        <meta charset="UTF-8">
        <title>MindEase - مساعدك الذكي</title>
    </head>
    <body>
        <h1>MindEase</h1>
        <p>مساعدتك في تفريغ الأفكار والدعم النفسي</p>

        <form method="post" action="/message">
            <input
                type="text"
                name="user_input"
                placeholder="اكتبي ما يشغل تفكيرك هنا..."
                required
            >
            <button type="submit">إرسال</button>
        </form>
    </body>
    </html>
    """


@app.post("/message", response_class=HTMLResponse)
async def message(user_input: str = Form(...)):
    return f"""
    <!DOCTYPE html>
    <html lang="ar" dir="rtl">
    <head>
        <meta charset="UTF-8">
        <title>MindEase</title>
    </head>
    <body>
        <h1>MindEase</h1>
        <p>تفهمي رسالتك:</p>
        <p>{user_input}</p>
        <p>💚 شكرًا لأنك عبرتِ عن شعورك.</p>

        <a href="/">العودة</a>
    </body>
    </html>
    """
