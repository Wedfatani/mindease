import gradio as gr

def greet(name):
    return f"مرحباً بكِ يا {name}! مساحتك الهادئة جاهزة. 🌿"

demo = gr.Interface(
    fn=greet, 
    inputs=gr.Textbox(label="اكتبي شيئاً هنا..."), 
    outputs=gr.Textbox(label="الرد"),
    title="MindEase"
)

if name == "__main__":
    demo.launch(server_name="0.0.0.0", server_port=8000)
