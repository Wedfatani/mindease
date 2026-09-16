import gradio as gr
import os

# هنا يمكنك وضع دوال أو منطق تطبيق MindEase الخاص بك
def mind_ease_response(user_input):
    # مثال بسيط، استبدليه بمنطق مشروعك الفعلي
    return f"مرحباً بكِ في منصة MindEase الدعم الأكاديمي. استلمنا استفسارك: '{user_input}'"

# تصميم واجهة Gradio
with gr.Blocks(theme=gr.themes.Soft()) as demo:
    gr.Markdown("# 🧠 MindEase - منصة الدعم الأكاديمي والنفسي للطلاب")
    gr.Markdown("مرحباً بكِ، نحن هنا لمساعدتك في رحلتك الجامعية.")
    
    with gr.Row():
        with gr.Column():
            txt_input = gr.Textbox(label="اكتبي مشكلتك أو استفسارك هنا:", placeholder="مثلاً: أعاني من ضغط في المذاكرة...")
            submit_btn = gr.Button("إرسال", variant="primary")
        with gr.Column():
            output = gr.Textbox(label="رد المساعد:")

    submit_btn.click(fn=mind_ease_response, inputs=txt_input, outputs=output)

# تشغيل التطبيق بالاعتماد على منفذ Azure
if name == "__main__":
    port = int(os.environ.get("PORT", 8000))
    demo.launch(server_name="0.0.0.0", server_port=port, share=False)
