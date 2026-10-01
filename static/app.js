const pages = [
    "home",
    "chat",
    "explain",
    "quiz",
    "plan",
    "progress"
];

let currentPage = "home";
let selectedFile = null;

let currentLanguage =
    localStorage.getItem("mindEaseLanguage") || "ar";

let history = [];


// ==========================================
// TRANSLATIONS
// ==========================================

const translations = {

    ar: {

        brandSubtitle: "مساحة مذاكرة أهدأ",

        navHome: "الرئيسية",
        navChat: "مساحة المذاكرة",
        navProgress: "تقدمي",

        badge: "مذاكرة بدون ضغط",

        heroTitle:
            "مو لازم تواجهين المذاكرة لحالك.",

        heroText:
            "MindEase مساحة هادئة تساعدك تفهمين، تراجعين، وتخططين لمذاكرتك خطوة بخطوة.",

        startBtn: "ابدئي معي",

        toolsEyebrow: "أدواتك",
        toolsTitle: "اختاري اللي تحتاجينه الآن",

        explainTitle: "أفهم درس",
        explainText:
            "اشرحي لي أي موضوع بطريقة بسيطة.",

        quizTitle: "أختبر نفسي",
        quizText:
            "اختبري فهمك بأسئلة قصيرة.",

        planTitle: "خطتي",
        planText:
            "رتبي مذاكرتك بدون ما تضغطين نفسك.",

        progressTitle: "تقدمي",
        progressText:
            "تابعي خطواتك وإنجازاتك.",

        chatTitle: "مساحة المذاكرة",

        chatSubtitle:
            "قولي اللي بخاطرك، ونبدأ من أبسط نقطة.",

        online: "معك الآن",

        welcomeMessage:
            "هلا 🤍 أنا MindEase. إذا تحسين إن كل شيء ملخبط، عادي. قولي لي وش أكثر شيء مضايقك ونفككه سوا خطوة خطوة.",

        explainPageText:
            "اكتبي الموضوع وأنا أشرحه لك ببساطة.",

        quizPageText:
            "خلينا نشوف وش فهمتي بطريقة خفيفة.",

        planPageText:
            "نبني خطة تناسب وقتك بدل ما نضغط عليك.",

        progressPageText:
            "كل خطوة صغيرة تعتبر تقدم.",

        topicLabel: "وش الموضوع؟",
        levelLabel: "مستواك",
        countLabel: "عدد الأسئلة",
        subjectLabel: "المادة",
        dateLabel: "تاريخ الاختبار",
        hoursLabel:
            "كم ساعة تقدرين تذاكرين يوميًا؟",

        explainBtn: "اشرح لي 🤍",
        quizBtn: "ابدأ الاختبار",
        planBtn: "ابني لي الخطة",

        progressMessage:
            "لسه البداية، وهذا شيء جميل 🤍",

        resetProgress:
            "تصفير التقدم"
    },


    en: {

        brandSubtitle:
            "A calmer study space",

        navHome: "Home",
        navChat: "Study Space",
        navProgress: "Progress",

        badge: "Study without the pressure",

        heroTitle:
            "You don't have to study alone.",

        heroText:
            "MindEase is a calm study space that helps you understand, review, and plan one step at a time.",

        startBtn: "Start with me",

        toolsEyebrow: "Your tools",
        toolsTitle: "Choose what you need right now",

        explainTitle: "Understand a lesson",
        explainText:
            "Explain any topic to me simply.",

        quizTitle: "Test myself",
        quizText:
            "Check your understanding with short questions.",

        planTitle: "My plan",
        planText:
            "Plan your study time without overwhelming yourself.",

        progressTitle: "My progress",
        progressText:
            "Keep track of your small wins.",

        chatTitle: "Study Space",

        chatSubtitle:
            "Tell me what's on your mind, and we'll start small.",

        online: "Here with you",

        welcomeMessage:
            "Hey 🤍 I'm MindEase. If everything feels a little messy right now, that's okay. Tell me what's bothering you most, and we'll take it one step at a time.",

        explainPageText:
            "Tell me the topic and I'll explain it simply.",

        quizPageText:
            "Let's gently check what you understand.",

        planPageText:
            "We'll build a realistic plan around your time.",

        progressPageText:
            "Every small step counts.",

        topicLabel: "What's the topic?",
        levelLabel: "Your level",
        countLabel: "Number of questions",
        subjectLabel: "Subject",
        dateLabel: "Exam date",
        hoursLabel:
            "How many hours can you study each day?",

        explainBtn: "Explain it 🤍",
        quizBtn: "Start quiz",
        planBtn: "Build my plan",

        progressMessage:
            "This is just the beginning, and that's okay 🤍",

        resetProgress:
            "Reset progress"
    }

};


// ==========================================
// LANGUAGE
// ==========================================

function applyLanguage() {

    const lang = translations[currentLanguage];

    document.documentElement.lang =
        currentLanguage;

    document.documentElement.dir =
        currentLanguage === "ar"
            ? "rtl"
            : "ltr";

    document
        .querySelectorAll("[data-i18n]")
        .forEach(element => {

            const key =
                element.dataset.i18n;

            if (lang[key]) {
                element.textContent =
                    lang[key];
            }
        });


    document
        .querySelectorAll("[data-placeholder-ar]")
        .forEach(element => {

            element.placeholder =
                currentLanguage === "ar"
                    ? element.dataset.placeholderAr
                    : element.dataset.placeholderEn;
        });


    const langBtn =
        document.getElementById("langBtn");

    langBtn.textContent =
        currentLanguage === "ar"
            ? "EN"
            : "ع";


    document.getElementById("chatInput").placeholder =
        currentLanguage === "ar"
            ? "قولي لي وش تحتاجين..."
            : "Tell me what you need...";
}


document
    .getElementById("langBtn")
    .addEventListener("click", () => {

        currentLanguage =
            currentLanguage === "ar"
                ? "en"
                : "ar";

        localStorage.setItem(
            "mindEaseLanguage",
            currentLanguage
        );

        applyLanguage();
    });


// ==========================================
// NAVIGATION
// ==========================================

function showPage(page) {

    if (!pages.includes(page)) {
        page = "home";
    }

    currentPage = page;

    document
        .querySelectorAll(".page")
        .forEach(section => {
            section.classList.remove("active");
        });

    const target =
        document.getElementById(
            `${page}Page`
        );

    if (target) {
        target.classList.add("active");
    }


    document
        .querySelectorAll(".nav-link")
        .forEach(button => {

            button.classList.toggle(
                "active",
                button.dataset.page === page
            );
        });


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


document.addEventListener(
    "click",
    event => {

        const button =
            event.target.closest("[data-page]");

        if (!button) return;

        const page =
            button.dataset.page;

        showPage(page);
    }
);


document
    .getElementById("homeBtn")
    .addEventListener(
        "click",
        () => showPage("home")
    );


document
    .getElementById("backBtn")
    .addEventListener(
        "click",
        () => {

            if (currentPage !== "home") {
                showPage("home");
            }
        }
    );


document
    .getElementById("chatBack")
    ?.addEventListener(
        "click",
        () => showPage("home")
    );


// ==========================================
// THEME
// ==========================================

const savedTheme =
    localStorage.getItem("mindEaseTheme");

if (savedTheme === "light") {
    document.body.classList.add("light");
}


document
    .getElementById("themeBtn")
    .addEventListener(
        "click",
        () => {

            document.body.classList.toggle(
                "light"
            );

            localStorage.setItem(
                "mindEaseTheme",
                document.body.classList.contains("light")
                    ? "light"
                    : "dark"
            );

            document.getElementById(
                "themeBtn"
            ).textContent =
                document.body.classList.contains("light")
                    ? "☀"
                    : "☾";
        }
    );


// ==========================================
// HELPERS
// ==========================================

function escapeHTML(text) {

    return text
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}


function addMessage(
    text,
    type = "ai"
) {

    const chatWindow =
        document.getElementById("chatWindow");

    const wrapper =
        document.createElement("div");

    wrapper.className =
        `message ${type === "user"
            ? "user-message"
            : "ai-message"}`;


    if (type === "ai") {

        const avatar =
            document.createElement("div");

        avatar.className =
            "avatar-ai";

        avatar.textContent = "🧠";

        wrapper.appendChild(avatar);
    }


    const bubble =
        document.createElement("div");

    bubble.className = "bubble";

    bubble.innerHTML =
        escapeHTML(text);


    wrapper.appendChild(bubble);

    chatWindow.appendChild(wrapper);

    chatWindow.scrollTop =
        chatWindow.scrollHeight;
}


function showToast(message) {

    const toast =
        document.getElementById("toast");

    toast.textContent = message;

    toast.classList.add("show");

    setTimeout(() => {
        toast.classList.remove("show");
    }, 2500);
}


function setLoading(button, loading) {

    if (!button) return;

    if (loading) {

        button.dataset.originalText =
            button.textContent;

        button.disabled = true;

        button.textContent =
            currentLanguage === "ar"
                ? "لحظة..."
                : "One moment...";

    } else {

        button.disabled = false;

        button.textContent =
            button.dataset.originalText;
    }
}


// ==========================================
// CHAT
// ==========================================

document
    .getElementById("chatForm")
    .addEventListener(
        "submit",
        async event => {

            event.preventDefault();

            const input =
                document.getElementById(
                    "chatInput"
                );

            const message =
                input.value.trim();

            if (!message && !selectedFile) {
                return;
            }


            if (selectedFile) {

                await analyzeUploadedFile(
                    message
                );

                input.value = "";

                return;
            }


            addMessage(
                message,
                "user"
            );

            input.value = "";

            const loadingMessage =
                currentLanguage === "ar"
                    ? "ثواني 🤍 خليني أفكر فيها معك..."
                    : "One second 🤍 Let me think this through with you...";

            addMessage(
                loadingMessage,
                "ai"
            );

            const chatWindow =
                document.getElementById(
                    "chatWindow"
                );

            const lastMessage =
                chatWindow.lastElementChild;

            try {

                const response =
                    await fetch(
                        "/api/chat",
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body: JSON.stringify({
                                message,
                                history
                            })
                        }
                    );


                const data =
                    await response.json();


                if (!response.ok) {
                    throw new Error(
                        data.detail ||
                        "Request failed"
                    );
                }


                lastMessage.remove();


                addMessage(
                    data.answer,
                    "ai"
                );


                history.push({
                    role: "user",
                    content: message
                });

                history.push({
                    role: "assistant",
                    content: data.answer
                });

                updateProgress(5);

            } catch (error) {

                lastMessage.remove();

                addMessage(
                    currentLanguage === "ar"
                        ? "صار عندي تعليق بسيط 🤍 جربي مرة ثانية."
                        : "I hit a small snag 🤍 Try again.",
                    "ai"
                );

                console.error(error);
            }
        }
    );


// ==========================================
// FILE UPLOAD
// ==========================================

const fileInput =
    document.getElementById(
        "fileInput"
    );

const attachBtn =
    document.getElementById(
        "attachBtn"
    );

const attachmentPreview =
    document.getElementById(
        "attachmentPreview"
    );

const fileName =
    document.getElementById(
        "fileName"
    );

const removeFile =
    document.getElementById(
        "removeFile"
    );


attachBtn.addEventListener(
    "click",
    () => fileInput.click()
);


fileInput.addEventListener(
    "change",
    () => {

        const file =
            fileInput.files[0];

        if (!file) return;

        selectedFile = file;

        fileName.textContent =
            file.name;

        attachmentPreview.classList.remove(
            "hidden"
        );
    }
);


removeFile.addEventListener(
    "click",
    () => {

        selectedFile = null;

        fileInput.value = "";

        attachmentPreview.classList.add(
            "hidden"
        );
    }
);


async function analyzeUploadedFile(
    message
) {

    addMessage(
        selectedFile.name,
        "user"
    );

    const loadingText =
        currentLanguage === "ar"
            ? "خليني أشوف الملف معك 🤍"
            : "Let me look through this with you 🤍";

    addMessage(
        loadingText,
        "ai"
    );


    const formData =
        new FormData();

    formData.append(
        "file",
        selectedFile
    );

    formData.append(
        "message",
        message
    );


    try {

        const response =
            await fetch(
                "/api/analyze-file",
                {
                    method: "POST",
                    body: formData
                }
            );


        const data =
            await response.json();


        if (!response.ok) {
            throw new Error(
                data.detail ||
                "File analysis failed"
            );
        }


        const chatWindow =
            document.getElementById(
                "chatWindow"
            );

        chatWindow.lastElementChild.remove();


        addMessage(
            data.answer,
            "ai"
        );


        updateProgress(10);

    } catch (error) {

        const chatWindow =
            document.getElementById(
                "chatWindow"
            );

        chatWindow.lastElementChild.remove();


        addMessage(
            currentLanguage === "ar"
                ? "ما قدرت أقرأ الملف هالمرة 🤍 تأكدي أنه صورة أو PDF أو TXT وجربي مرة ثانية."
                : "I couldn't read that file this time 🤍 Make sure it's an image, PDF, or TXT and try again.",
            "ai"
        );

        console.error(error);

    } finally {

        selectedFile = null;

        fileInput.value = "";

        attachmentPreview.classList.add(
            "hidden"
        );
    }
}


// ==========================================
// EXPLAIN
// ==========================================

document
    .getElementById("explainForm")
    .addEventListener(
        "submit",
        async event => {

            event.preventDefault();

            const button =
                event.target.querySelector(
                    "button"
                );

            const topic =
                document.getElementById(
                    "explainTopic"
                ).value.trim();

            const level =
                document.getElementById(
                    "explainLevel"
                ).value;


            if (!topic) return;


            setLoading(button, true);


            try {

                const response =
                    await fetch(
                        "/api/explain",
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body: JSON.stringify({
                                topic,
                                level
                            })
                        }
                    );


                const data =
                    await response.json();


                if (!response.ok) {
                    throw new Error(
                        data.detail
                    );
                }


                const result =
                    document.getElementById(
                        "explainResult"
                    );

                result.textContent =
                    data.answer;

                result.classList.remove(
                    "hidden"
                );

                updateProgress(10);

            } catch (error) {

                showToast(
                    currentLanguage === "ar"
                        ? "صار خطأ بسيط 🤍"
                        : "Something went wrong 🤍"
                );

                console.error(error);

            } finally {

                setLoading(button, false);
            }
        }
    );


// ==========================================
// QUIZ
// ==========================================

document
    .getElementById("quizForm")
    .addEventListener(
        "submit",
        async event => {

            event.preventDefault();

            const button =
                event.target.querySelector(
                    "button"
                );

            const topic =
                document.getElementById(
                    "quizTopic"
                ).value.trim();

            const count =
                Number(
                    document.getElementById(
                        "quizCount"
                    ).value
                );


            if (!topic) return;


            setLoading(button, true);


            try {

                const response =
                    await fetch(
                        "/api/quiz",
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body: JSON.stringify({
                                topic,
                                count,
                                level: "متوسط"
                            })
                        }
                    );


                const data =
                    await response.json();


                if (!response.ok) {
                    throw new Error(
                        data.detail
                    );
                }


                const result =
                    document.getElementById(
                        "quizResult"
                    );

                result.textContent =
                    data.answer;

                result.classList.remove(
                    "hidden"
                );

                updateProgress(15);

            } catch (error) {

                showToast(
                    currentLanguage === "ar"
                        ? "تعطلت شوي 🤍 جربي مرة ثانية."
                        : "I hit a small snag 🤍 Try again."
                );

                console.error(error);

            } finally {

                setLoading(button, false);
            }
        }
    );


// ==========================================
// PLAN
// ==========================================

document
    .getElementById("planForm")
    .addEventListener(
        "submit",
        async event => {

            event.preventDefault();

            const button =
                event.target.querySelector(
                    "button"
                );


            const subject =
                document.getElementById(
                    "planSubject"
                ).value.trim();

            const exam_date =
                document.getElementById(
                    "planDate"
                ).value;

            const hours_per_day =
                Number(
                    document.getElementById(
                        "planHours"
                    ).value
                );


            if (!subject || !exam_date) {
                return;
            }


            setLoading(button, true);


            try {

                const response =
                    await fetch(
                        "/api/plan",
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body: JSON.stringify({
                                subject,
                                exam_date,
                                hours_per_day,
                                level: "متوسط"
                            })
                        }
                    );


                const data =
                    await response.json();


                if (!response.ok) {
                    throw new Error(
                        data.detail
                    );
                }


                const result =
                    document.getElementById(
                        "planResult"
                    );

                result.textContent =
                    data.answer;

                result.classList.remove(
                    "hidden"
                );

                updateProgress(15);

            } catch (error) {

                showToast(
                    currentLanguage === "ar"
                        ? "صار خطأ بسيط 🤍"
                        : "Something went wrong 🤍"
                );

                console.error(error);

            } finally {

                setLoading(button, false);
            }
        }
    );


// ==========================================
// PROGRESS
// ==========================================

function getProgress() {

    return Number(
        localStorage.getItem(
            "mindEaseProgress"
        ) || 0
    );
}


function updateProgress(amount) {

    let progress =
        getProgress();

    progress =
        Math.min(
            100,
            progress + amount
        );

    localStorage.setItem(
        "mindEaseProgress",
        progress
    );

    renderProgress();
}


function renderProgress() {

    const progress =
        getProgress();

    const number =
        document.getElementById(
            "progressNumber"
        );

    const fill =
        document.getElementById(
            "progressFill"
        );


    number.textContent =
        `${progress}%`;

    fill.style.width =
        `${progress}%`;
}


document
    .getElementById("resetProgress")
    .addEventListener(
        "click",
        () => {

            localStorage.setItem(
                "mindEaseProgress",
                "0"
            );

            renderProgress();

            showToast(
                currentLanguage === "ar"
                    ? "تم تصفير التقدم 🤍"
                    : "Progress reset 🤍"
            );
        }
    );


// ==========================================
// START
// ==========================================

applyLanguage();

renderProgress();

showPage("home");
