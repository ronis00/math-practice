let questions = [];
let current = 0;
let score = 0;
let timer;
let timeLimit = 10;
let startTime;

document.getElementById("settings-form").addEventListener("submit", function (e) {
    e.preventDefault();
    const min = parseInt(document.getElementById("min").value);
    const max = parseInt(document.getElementById("max").value);
    const num = parseInt(document.getElementById("num").value);
    timeLimit = parseInt(document.getElementById("time").value);
    const ops = Array.from(document.querySelectorAll('input[name="op"]:checked')).map(cb => cb.value);

    if (ops.length === 0) {
        alert("בחר לפחות פעולה אחת!");
        return;
    }

    questions = [];

    for (let i = 0; i < num; i++) {
        let a, b, op, answer;
        op = ops[Math.floor(Math.random() * ops.length)];

        if (op === "/") {
            b = getRandom(min, max);
            let result = getRandom(min, max);
            a = b * result;
            answer = result;
        } else if (op === "-") {
            a = getRandom(min, max);
            b = getRandom(min, max);
            if (a < b) {
                [a, b] = [b, a]; 
            }
            answer = a - b;
        } else {
            a = getRandom(min, max);
            b = getRandom(min, max);
            answer = eval(`${a} ${op} ${b}`);
        }

        questions.push({ a, b, op, answer, text: `${a} ${op} ${b}` });
    }

    document.getElementById("settings-form").style.display = "none";
    document.getElementById("quiz-area").style.display = "block";
    document.getElementById("result").style.display = "none";
    current = 0;
    score = 0;
    startTime = new Date();
    showQuestion();
});

function getRandom(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function showQuestion() {
    if (current >= questions.length) {
        finishQuiz();
        return;
    }

    document.getElementById("feedback").innerText = "";
    document.getElementById("answer").value = "";
    
    // וידוא שהתצוגה תישאר בסדר הנכון גם אם היישור הוא RTL
    document.getElementById("question").innerHTML = `<span style="direction: ltr; unicode-bidi: bidi-override;">${questions[current].text}</span>`;

    setTimeout(() => {
        document.getElementById("answer").focus();
    }, 100);

    let timeLeft = timeLimit;
    document.getElementById("timer").innerText = `נותרו ${timeLeft} שניות`;
    clearInterval(timer);

    timer = setInterval(() => {
        timeLeft--;
        document.getElementById("timer").innerText = `נותרו ${timeLeft} שניות`;
        if (timeLeft <= 0) {
            clearInterval(timer);
            submitAnswer(true);
        }
    }, 1000);
}

// מאזין למקש Enter כדי לשלוח תשובה
document.getElementById("answer").addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        submitAnswer();
    }
});

function submitAnswer(timeout = false) {
    clearInterval(timer);
    const userAnswer = parseFloat(document.getElementById("answer").value);
    const correct = questions[current].answer;

    if (!timeout && userAnswer === correct) {
        score++;
        document.getElementById("feedback").innerText = "נכון!";
    } else if (timeout) {
        document.getElementById("feedback").innerText = `נגמר הזמן! התשובה הנכונה: ${correct}`;
    } else {
        document.getElementById("feedback").innerText = `שגוי! התשובה הנכונה: ${correct}`;
    }

    current++;
    setTimeout(showQuestion, 1000);
}

function finishQuiz() {
    document.getElementById("quiz-area").style.display = "none";
    document.getElementById("result").style.display = "block";

    const totalTime = Math.round((new Date() - startTime) / 1000);
    const resultText = `סיום תרגול 🎉 הצלחת ${score} מתוך ${questions.length} תרגילים. זמן כולל: ${totalTime} שניות`;

    document.getElementById("result").innerText = resultText;

    const againBtn = document.createElement("button");
    againBtn.innerText = "תרגול נוסף";
    againBtn.onclick = () => location.reload();

    const exitBtn = document.createElement("button");
    exitBtn.innerText = "סיום";
    exitBtn.style.marginRight = "10px";
    exitBtn.onclick = () => {
        document.getElementById("result").innerText = "תודה ולהתראות!";
        againBtn.remove();
        exitBtn.remove();
    };

    document.getElementById("result").appendChild(document.createElement("br"));
    document.getElementById("result").appendChild(exitBtn);
    document.getElementById("result").appendChild(againBtn);
}
