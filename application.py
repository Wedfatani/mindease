from flask import Flask, render_template_string, request

app = Flask(__name__)

HTML_TEMPLATE = """
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <title>MindEase - مساعدك الذكي</title>

    <style>
        body {
            font-family: Tahoma, sans-serif;
            background-color: #f4f7f6;
            text-align: center;
            padding: 50px;
        }

        .container {
            background: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0px 4px 10px rgba(0,0,0,0.1);
            display: inline-block;
            width: 400px;
        }

        input[type="text"] {
            width: 90%;
            padding: 10px;
            margin: 10px 0;
            border: 1px solid #ccc;
            border-radius: 5px;
        }

        input[type="submit"] {
            background: #4CAF50;
            color: white;
            border: 0;
            padding: 10px 20px;
            border-radius: 5px;
            cursor: pointer;
        }

        .result {
            margin-top: 20px;
            color: #333;
            background: #e8f5e9;
            padding: 10px;
            border-radius: 5px;
        }
    </style>
</head>

<body>

    <div class="container">

        <h2>MindEase</h2>

        <p>
            مساعدتك في تفريغ الأفكار والدعم النفسي
        </p>

        <form method="POST">

            <input
                type="text"
                name="user_input"
                placeholder="اكتبي ما يشغل تفكيرك هنا..."
                required
            >

            <br>

            <input type="submit" value="إرسال">

        </form>

        {% if user_message %}
            <div class="result">

                <strong>تفهمي رسالتك:</strong>

                <p>{{ user_message }}</p>

                <p style="color: #2e7d32; font-size: 0.9em;">
                    💚 أحسنتِ، شكرًا لأنك عبرتِ عن شعورك.
                </p>

            </div>
        {% endif %}

    </div>

</body>
</html>
"""


@app.route("/", methods=["GET", "POST"])
def home():

    user_message = None

    if request.method == "POST":
        user_message = request.form.get("user_input")

    return render_template_string(
        HTML_TEMPLATE,
        user_message=user_message
    )


if __name__ == "__main__":
    app.run()
