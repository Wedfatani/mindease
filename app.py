import gradio as gr
from openai import AzureOpenAI

# 1. بيانات الاتصال بـ Azure OpenAI
AZURE_OPENAI_KEY = "5WLUCuiX38EBjj1G7Zbclh4VGnGEkagxMklQ6hAsPblWZycr9igwJQQJ99CIACF24PCXJ3w3AAABACOGcoZf"
AZURE_OPENAI_ENDPOINT = "https://mindease2027.openai.azure.com/"
DEPLOYMENT_NAME = "gpt-4o"

# 2. إعداد العميل
client = AzureOpenAI(
    azure_endpoint=AZURE_OPENAI_ENDPOINT,
    api_key=AZURE_OPENAI_KEY,
    api_version="2024-02-01"
)

# 3. دالة معالجة المحادثة بدون أخطاء السجل (Robust History Handling)
def mindease_response(message, history):
    system_prompt = (
        "أنت 'MindEase'، مرشد وأخصائي دعم نفسي وأكاديمي ذكي للطلاب الجامعيين. "
        "قدم نصائح عملية ومباشرة ومختصرة جداً في نقاط قصيرة بدون مقدمات طويلة."
    )
    
    messages = [{"role": "system", "content": system_prompt}]
    
    # معالجة حذرة ومستقرة لسجل المحادثة
    if history:
        for turn in history:
            if isinstance(turn, (list, tuple)) and len(turn) == 2:
                user_msg, bot_msg = turn
                if user_msg:
                    messages.append({"role": "user", "content": str(user_msg)})
                if bot_msg:
                    messages.append({"role": "assistant", "content": str(bot_msg)})
            elif isinstance(turn, dict):
                messages.append(turn)
                
    messages.append({"role": "user", "content": str(message)})
    
    try:
        response = client.chat.completions.create(
            model=DEPLOYMENT_NAME,
            messages=messages,
            max_tokens=200,
            temperature=0.7
        )
        return response.choices[0].message.content
    except Exception as e:
        return f"خطأ: {str(e)}"

# 4. تشغيل الواجهة بصورة مستقرة
demo = gr.ChatInterface(
    fn=mindease_response,
    title="🧠 MindEase - المساعد الذكي للدعم الأكاديمي والنفسي",
    description="مشروع مشارك في مسابقة Microsoft Imagine Cup 2026",
    textbox=gr.Textbox(placeholder="اكتب استفسارك هنا واضغط Enter...", label="ريالتك")
)

if name == "__main__":
    demo.queue()
    demo.launch(server_name="0.0.0.0", server_port=8000)
