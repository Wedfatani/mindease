import gradio as gr

def mind_ease_response(user_input):
    if not user_input.strip():
        return "الرجاء كتابة ما تفكر فيه لنتمكن من مساعدتك."
    
    response = (
        f"أهلاً بكِ. لقد تلقيت رسالتكِ: '{user_input}'\n\n"
        "خذي نفساً عميقاً وافرغي ذهنك قليلاً. نحن هنا دائماً لدعمك ومساعدتك في تخطي الضغوط والوصول للراحة النفسية والذهنية المطلوبة. 🌿✨"
    )
    return response

# بناء الواجهة باستخدام Gradio
with gr.Blocks() as demo:
    gr.Markdown("# 🧠 MindEase")
    gr.Markdown("مساحتك الآمنة للاسترخاء، تفريغ الأفكار، والدعم النفسي الذكي.")
    
    with gr.Row():
        with gr.Column():
            user_msg = gr.Textbox(label="ما الذي يراودك أو يشغل تفكيرك الآن؟", placeholder="اكتبي هنا...")
            submit_btn = gr.Button("إرسال ودعم", variant="primary")
        
        with gr.Column():
            output_box = gr.Textbox(label="الاستجابة والمساحة الهادئة", lines=5)
            
    submit_btn.click(fn=mind_ease_response, inputs=user_msg, outputs=output_box)

# هذا السطر ضروري جداً لكي يتعرف عليه Gunicorn في أزور
app = gr.mount_gradio_app(None, demo, path="/")
