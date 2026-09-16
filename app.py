import gradio as gr
from openai import AzureOpenAI

# 1. إعدادات باكت الاتصال بـ Azure OpenAI
AZURE_OPENAI_KEY = "SMUCUKBWERjjj672bcV4MVuKGBWJpycHr9Gwo700J7PICI47 J3AAABC6GcZF"
AZURE_OPENAI_ENDPOINT = "https://mindease2027.openai.azure.com/"
DEPLOYMENT_NAME = "gpt-4o"

# 2. إعداد العميل
client = AzureOpenAI(
    azure_endpoint=AZURE_OPENAI_ENDPOINT,
    api_key=AZURE_OPENAI_KEY,
    api_version="2024-02-01"
)

# 3. دالة معالجة الرسائل (Robust History Handling)
def mindease_response(message, history):
    system_prompt = (
        "أنت مساعد نفسي داعم وأكاديمي مصمم لمساعدة طلاب الجامعات في تخفيف التوتر وتقسيم مهامهم الدراسية. "
        "تحدث بلغة عربية دافئة، متعاطفة، ومشجعة. قدم نصائح عملية ومختصرة."
    )
    
    # تحويل سجل المحادثة (History) بالصيغة التي تفهمها OpenAI API
    messages = [{"role": "system", "content": system_prompt}]
    
    if history:
        for human_msg, assistant_msg in history:
            if human_msg:
                messages.append({"role": "user", "content": human_msg})
            if assistant_msg:
                messages.append({"role": "assistant", "content": assistant_msg})
                
    messages.append({"role": "user", "content": message})
    
    try:
        response = client.chat.completions.create(
            model=DEPLOYMENT_NAME,
            messages=messages,
            max_tokens=500,
            temperature=0.7,
        )
        return response.choices[0].message.content
    except Exception as e:
        return "عذراً، حدث خطأ بسيط في الاتصال. تأكد من المحاولة مرة أخرى قريباً."

# 4. تصميم الواجهة باستخدام Gradio
demo = gr.ChatInterface(
    fn=mindease_response,
    title="MindEase - رفيقك الذكي للدعم الأكاديمي والنفسي",
    description="مشروع مشارك في Microsoft Imagine Cup 2026.",
    textbox=gr.Textbox(placeholder="اكتب رسالتك هنا وطبق Enter...", container=False, scale=7),
)

if name == "__main__":
    import os
    port = int(os.environ.get("PORT", 8000))
    demo.launch(server_name="0.0.0.0", server_port=port)
