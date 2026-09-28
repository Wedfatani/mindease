const state = {

    sessions:
        Number(
            localStorage.getItem("me_sessions") || 0
        ),

    minutes:
        Number(
            localStorage.getItem("me_minutes") || 0
        ),

    questions:
        Number(
            localStorage.getItem("me_questions") || 0
        ),

    history: []

};


const modes = {

    chat: [
        "Study Room",
        "جلسة دراسة",
        "تكلمي مع MindEase عن أي درس أو سؤال عندك."
    ],

    explain: [
        "Understand",
        "أفهم درس",
        "اكتبي اسم الموضوع وخلي MindEase يشرحه لك."
    ],

    quiz: [
        "Quiz Me",
        "أختبر نفسي",
        "اختبري فهمك واكتشفي الأشياء التي تحتاج مراجعة."
    ],

    plan: [
        "Smart Plan",
        "خطتي",
        "ابني خطة مذاكرة عملية حسب تاريخ اختبارك ووقتك."
    ],

    progress: [
        "Progress",
        "تقدمي",
        "شوفي جلساتك وإحصاءات مذاكرتك."
    ]

};


function $(id) {
    return document.getElementById(id);
}


/* =========================
   NAVIGATION
========================= */

function openMode(mode) {

    $("homeView").classList.add("hidden");

    $("modeView").classList.remove("hidden");

    $("modeTitle").textContent =
        modes[mode][1];

    $("modeSubtitle").textContent =
        modes[mode][2];


    const allModes = [
        "chat",
        "explain",
        "quiz",
        "plan",
        "progress"
    ];


    allModes.forEach(function (item) {

        const element =
            $(item + "Mode");

        if (item === mode) {

            element.classList.remove(
                "hidden"
            );

        } else {

            element.classList.add(
                "hidden"
            );

        }

    });


    if (mode === "progress") {
        updateStats();
    }


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}


function showHome() {

    $("modeView").classList.add("hidden");

    $("homeView").classList.remove("hidden");

    updateProgress();

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}


/* =========================
   CHAT
========================= */

function usePrompt(text) {

    $("chatInput").value = text;

    $("chatInput").focus();

}


function escapeHtml(text) {

    return text.replace(
        /[&<>"']/g,
        function (character) {

            return {

                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                '"': "&quot;",
                "'": "&#039;"

            }[character];

        }
    );

}


function addMessage(role, text) {

    const box =
        $("chatMessages");

    const element =
        document.createElement("div");


    if (role === "user") {

        element.className =
            "user-message";

        element.innerHTML = `
            <div>
                <p>
                    ${escapeHtml(text)}
                </p>
            </div>
        `;

    } else {

        element.className =
            "ai-message";

        element.innerHTML = `
            <div class="ai-icon">
                ✦
            </div>

            <div>
                <strong>
                    MindEase
                </strong>

                <p>
                    ${escapeHtml(text)}
                </p>
            </div>
        `;

    }


    box.appendChild(element);

    box.scrollTop =
        box.scrollHeight;

}


/* =========================
   API
========================= */

async function post(url, data) {

    const response =
        await fetch(
            url,
            {
                method: "POST",

                headers: {
                    "Content-Type":
                        "application/json"
                },

                body:
                    JSON.stringify(data)
            }
        );


    const result =
        await response.json();


    if (!response.ok) {

        throw new Error(
            result.detail ||
            "حدث خطأ"
        );

    }


    return result;

}


/* =========================
   CHAT SEND
========================= */

async function sendChat(event) {

    event.preventDefault();


    const input =
        $("chatInput");


    const text =
        input.value.trim();


    if (!text) {
        return;
    }


    addMessage(
        "user",
        text
    );


    input.value = "";


    try {

        const result =
            await post(
                "/api/chat",
                {
                    message: text,
                    history:
                        state.history
                }
            );


        addMessage(
            "assistant",
            result.answer
        );


        state.history.push(
            {
                role: "user",
                content: text
            },

            {
                role: "assistant",
                content:
                    result.answer
            }
        );


        state.history =
            state.history.slice(-12);


        finishSession(15);

    }

    catch (error) {

        addMessage(
            "assistant",
            "صار خطأ في الاتصال بالذكاء الاصطناعي. تأكدي من إعدادات Azure OpenAI في App Service."
        );

    }

}


/* =========================
   EXPLAIN
========================= */

async function runExplain() {

    const topic =
        $("explainTopic")
            .value
            .trim();


    if (!topic) {

        alert(
            "اكتبي الموضوع أولاً"
        );

        return;
    }


    setLoading(
        "explainResult"
    );


    try {

        const result =
            await post(
                "/api/explain",
                {
                    topic: topic,

                    level:
                        $("explainLevel")
                            .value
                }
            );


        showResult(
            "explainResult",
            result.answer
        );


        finishSession(15);

    }

    catch (error) {

        showResult(
            "explainResult",
            error.message
        );

    }

}


/* =========================
   QUIZ
========================= */

async function runQuiz() {

    const topic =
        $("quizTopic")
            .value
            .trim();


    if (!topic) {

        alert(
            "اكتبي الموضوع أولاً"
        );

        return;
    }


    const count =
        Number(
            $("quizCount").value
        );


    setLoading(
        "quizResult"
    );


    try {

        const result =
            await post(
                "/api/quiz",
                {
                    topic: topic,

                    count: count,

                    level:
                        $("quizLevel")
                            .value
                }
            );


        showResult(
            "quizResult",
            result.answer
        );


        state.questions += count;

        save();

        finishSession(20);

    }

    catch (error) {

        showResult(
            "quizResult",
            error.message
        );

    }

}


/* =========================
   STUDY PLAN
========================= */

async function runPlan() {

    const subject =
        $("planSubject")
            .value
            .trim();


    const date =
        $("planDate")
            .value;


    if (!subject || !date) {

        alert(
            "أدخلي المادة وتاريخ الاختبار"
        );

        return;
    }


    setLoading(
        "planResult"
    );


    try {

        const result =
            await post(
                "/api/plan",
                {
                    subject: subject,

                    exam_date: date,

                    hours_per_day:
                        Number(
                            $("planHours")
                                .value
                        ),

                    level:
                        $("planLevel")
                            .value
                }
            );


        showResult(
            "planResult",
            result.answer
        );


        finishSession(10);

    }

    catch (error) {

        showResult(
            "planResult",
            error.message
        );

    }

}


/* =========================
   RESULTS
========================= */

function setLoading(id) {

    const element =
        $(id);


    element.classList.remove(
        "hidden"
    );


    element.textContent =
        "MindEase يفكر لك... ✦";

}


function showResult(id, text) {

    const element =
        $(id);


    element.classList.remove(
        "hidden"
    );


    element.textContent =
        text;

}


/* =========================
   PROGRESS
========================= */

function finishSession(minutes) {

    state.sessions++;

    state.minutes += minutes;

    save();

    updateProgress();

}


function save() {

    localStorage.setItem(
        "me_sessions",
        state.sessions
    );

    localStorage.setItem(
        "me_minutes",
        state.minutes
    );

    localStorage.setItem(
        "me_questions",
        state.questions
    );

}


function updateProgress() {

    const percentage =
        Math.min(
            100,
            (state.sessions / 3) * 100
        );


    $("dailyBar")
        .style
        .width =
        percentage + "%";


    $("dailyText")
        .textContent =
        `${Math.min(state.sessions, 3)} / 3 جلسات`;

}


function updateStats() {

    $("statSessions")
        .textContent =
        state.sessions;


    $("statMinutes")
        .textContent =
        state.minutes;


    $("statQuestions")
        .textContent =
        state.questions;

}


/* =========================
   THEME
========================= */

function toggleTheme() {

    document.body.classList.toggle(
        "light-mode"
    );

}


/* =========================
   START
========================= */

updateProgress();
