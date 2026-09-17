import gradio as gr

def mind_ease_response(user_input):
    if not user_input.strip():
        return "الرجاء كتابة ما تفكر فيه لنتمكن من مساعدتك."
    
    response = (
        f"أهلاً بكِ. لقد تلقيت رسالتكِ: '{user_input}'\n\n"
        "خذي نفساً عميقاً وافرغي ذهنك قليلاً. نحن هنا دائماً لدعمك ومساعدتك في تخطي الضغوط والوصول للراحة النفسية والذهنية المطلوبة. 🌿✨"
    )
    return response

# استخدام الطريقة المتوافقة تماماً مع الإصدارات الحديثة
theme = gr.themes.Soft()

with gr.Blocks(theme=theme) as demo:
    gr.Markdown("# 🧠 MindEase")
    gr.Markdown("مساحتك الآمنة للاسترخاء، تفريغ الأفكار، والدعم النفسي الذكي.")
    
    with gr.Row():
        with gr.Column():
            user_msg = gr.Textbox(label="ما الذي يراودك أو يشغل تفكيرك الآن؟", placeholder="اكتبي هنا...")
            submit_btn = gr.Button("إرسال ودعم", variant="primary")
        
        with gr.Column():
            output_box = gr.Textbox(label="الاستجابة والمساحة الهادئة", lines=5)
            
    submit_btn.click(fn=mind_ease_response, inputs=user_msg, outputs=output_box)

if name == "__main__":
    demo.launch(server_name="0.0.0.0", server_port=8000)
