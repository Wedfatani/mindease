# =========================================================
# MindEase - Academic Stress & Recovery Simulator (Final Aug 13)
# Engine: Qwen 2.5 via Hugging Face API
# =========================================================


import os
import re
import gradio as gr
from huggingface_hub import InferenceClient

# 1. مفتاح الـ API
HF_TOKEN = os.getenv("HF_TOKEN", "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")

client = InferenceClient(
    model="Qwen/Qwen2.5-7B-Instruct",
    token=HF_TOKEN
)

# 2. دالة تنظيف النص
def clean_arabic_text(text):
    clean_text = re.sub(r'[^\u0600-\u06FF0-9\s\.\،\:\-\n]', '', text)
    return clean_text.strip()

# 3. System Prompt لضمان الجودة واكتمال 3 خطوات قصيرة
SYSTEM_PROMPT = """أنتِ "MindEase"، مرشدة أكاديمية ونفسية لطلاب الجامعة.
قواعد صارمة:
1. الكتابة باللغة العربية الفصحى البسيطة والواضحة فقط.
2. اكتبي 3 خطوات عملية قصيرة جداً (كل خطوة لا تتجاوز 4 كلمات).
3. تأكدي من إكمال النقطة الثالثة تماماً وبدون أي توقف ناقص."""

# 4. محرك الشات المباشر
def ai_chat_assistant(message, history):
    try:
        messages = [{"role": "system", "content": SYSTEM_PROMPT}]
        for item in history:
            if isinstance(item, (list, tuple)):
                if item[0]: messages.append({"role": "user", "content": str(item[0])})
                if item[1]: messages.append({"role": "assistant", "content": str(item[1])})
            elif isinstance(item, dict):
                messages.append(item)
        messages.append({"role": "user", "content": message})
        
        response = client.chat_completion(messages=messages, max_tokens=200, temperature=0.1)
        return clean_arabic_text(response.choices[0].message.content)
    except Exception as e:
        return f"حدث خطأ أثناء الاتصال: {str(e)}"

# 5. محرك محاكي استعادة التوازن
def recovery_simulator(scenario, time_left):
    if not scenario or not time_left:
        return "الرجاء اختيار السيناريو والوقت المتبقي لتوليد الخطة."

    prompt = f"""طالبة تعاني من: [{scenario}]
الوقت المتبقي: [{time_left}].

المطلوب:
اكتبي 3 خطوات إنقاذ سريعة ومكتملة تماماً باللغة العربية. اجعلي كل خطوة قصيرة جداً (أقل من 5 كلمات)."""

    try:
        response = client.chat_completion(
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": prompt}
            ],
            max_tokens=200,
            temperature=0.1
        )
        raw_text = response.choices[0].message.content
        clean_text = clean_arabic_text(raw_text)
        return f"خطة الإنقاذ السريعة ({time_left}):\n--------------------------------------------------\n{clean_text}"
    except Exception as e:
        return f"حدث خطأ: {str(e)}"

# 6. قائمة السيناريوهات والأوقات المعتمدة
scenarios_list = [
    "ضغط اختبار قريب وتراكم المواد",
    "تشتت شديد وتراكم المهام والتكاليف",
    "انخفاض الدرجات وفقدان الشغف والخوف"
]

time_frames = ["أقل من 24 ساعة (طوارئ)", "من 2 إلى 3 أيام", "أسبوع أو أكثر"]

# 7. الواجهة المحدثة
sim_interface = gr.Interface(
    fn=recovery_simulator,
    inputs=[
        gr.Radio(choices=scenarios_list, label="اختاري حالة الضغط الأكاديمي:"),
        gr.Radio(choices=time_frames, label="الوقت المتبقي:")
    ],
    outputs=gr.Textbox(label="خطة الإنقاذ الفورية", lines=5),
    description="اختر سيناريو الضغط الأكاديمي والوقت المتبقي للحصول على خطة عمل فورية ومخصصة.",
    submit_btn="توليد خطة الإنقاذ",
    clear_btn="مسح الاختيارات"
)

chat_interface = gr.ChatInterface(
    fn=ai_chat_assistant, 
    description="🔒 المحادثة مشفرة بالكامل ولا نطلب أي بيانات شخصية أو أرقام جامعية."
)

demo = gr.TabbedInterface(
    interface_list=[sim_interface, chat_interface],
    tab_names=["محاكي استعادة التوازن", "الموجه الذكي"],
    title="MindEase Simulator"
)

demo.launch(share=True)
