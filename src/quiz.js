let currentQuestionIndex = 0;
let questions = [];
let userAnswers = [];
let correctAnswers = 0;
let quizStarted = false;

function loadCSVFromSelection(event) {
    const selectedFile = event.target.value;
    if (!selectedFile) return;

    const fileMap = {
        "file1.csv": "data/quiz1_questions.csv",  // Update to match your file
        "file2.csv": "data/quiz2_questions.csv", // Update with actual file paths
    };

    // Fetch the selected CSV
    fetch(fileMap[selectedFile])
        .then(response => response.text())
        .then(data => {
            const rows = data.split("\n").map(row => row.split(","));
            parseQuestions(rows);
        });
}

function parseQuestions(rows) {
    rows.forEach((row, index) => {
        if (index === 0) return; // Skip header row

        const questionText = row[0];
        const options = row.slice(1, -1); // All options except the answer

        // Parse the correct answers and trim any quotes or spaces
        const correctAnswers = row.slice(-1).map(item => item.trim().replace(/"/g, '').trim()); // Remove extra quotes and spaces

        questions.push({
            questionText,
            options,
            correctAnswers: correctAnswers[0].split(';') // Split answers by semicolon
        });
    });

    // Start the quiz after loading all questions
    startQuiz();
}


function startQuiz() {
    quizStarted = true;
    document.getElementById('csv-file-selector').style.display = 'none';  // Hide file dropdown after starting
    document.getElementById('next-button').innerText = "Next";   // Change button text to Next after quiz starts
    document.getElementById('check-answer-button').style.display = 'inline-block'; // Show Check Answer button
    displayQuestion(currentQuestionIndex);  // Display the first question
}

function displayQuestion(index) {
    const question = questions[index];
    
    // Display the question number in the format "Question i of j"
    document.getElementById('question-number').innerText = `Question ${index + 1} of ${questions.length-1}`;

    document.getElementById('question').innerText = question.questionText;

    const optionsContainer = document.getElementById('options');
    optionsContainer.innerHTML = ''; // Clear previous options
    question.options.forEach((option, i) => {
        const label = document.createElement('label');
        label.innerHTML = `
            <input type="checkbox" id="option${i}" value="${option}" /> ${String.fromCharCode(97 + i)}. ${option}
        `;
        optionsContainer.appendChild(label);
    });

    document.getElementById('next-button').disabled = false;
    document.getElementById('reset-button').disabled = false;
}

function nextQuestion() {
    const selectedOptions = getSelectedOptions();
    checkAnswers(selectedOptions);

    currentQuestionIndex++;

    // If the current question is the last one, show results
    if (currentQuestionIndex < questions.length-1) {
        displayQuestion(currentQuestionIndex);
    } else {
        displayResults(); // Show the results if it's the last question
    }
}


function getSelectedOptions() {
    const selected = [];
    const checkboxes = document.querySelectorAll('#options input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        if (checkbox.checked) {
            selected.push(checkbox.value);
        }
    });
    return selected;
}

function checkAnswer() {
    const selectedOptions = getSelectedOptions();
    checkAnswers(selectedOptions);

    // Get the correct answers for the current question
    const correctAnswersForQuestion = questions[currentQuestionIndex].correctAnswers;

    // Display the correct answers in the alert
    alert(`ANSWER : ${correctAnswersForQuestion.join(', ')}`);
}

function checkAnswers(selectedOptions) {
    const correctAnswersForQuestion = questions[currentQuestionIndex].correctAnswers;
   

    // Sort the selected answers and the correct answers for proper comparison
    selectedOptions.sort();
    correctAnswersForQuestion.sort();
    console.log("selected : " + selectedOptions);
    console.log("answer : " +correctAnswersForQuestion);

    // Check if the selected answers match the correct answers
    const isCorrect = selectedOptions.length === correctAnswersForQuestion.length && 
                      selectedOptions.every((option, index) => option === correctAnswersForQuestion[index]);

    if (isCorrect) {
        correctAnswers++;  // Increment score if the selected answers are correct
    }

    userAnswers.push({ question: questions[currentQuestionIndex], selectedOptions, correct: isCorrect });
}


function displayResults() {
    // Display the result score
    document.getElementById('score').innerText = `You answered ${correctAnswers} out of ${questions.length-1} questions correctly.`;
    
    // Disable Next and Check Answer buttons once the quiz is finished
    document.getElementById('next-button').disabled = true;
    document.getElementById('check-answer-button').disabled = true;
}


function resetQuiz() {
    // Reset quiz state
    currentQuestionIndex = 0;
    correctAnswers = 0;
    userAnswers = [];
    document.getElementById('score').innerText = '';

    // Clear the questions array to avoid doubling
    questions = [];

    // Disable the Next button and reset its text to "Start Quiz"
    document.getElementById('next-button').disabled = true;
    document.getElementById('next-button').innerText = "Start Quiz";

    // Hide Check Answer button
    document.getElementById('check-answer-button').style.display = 'none';

    // Reset question and options display
    document.getElementById('question').innerText = '';
    document.getElementById('options').innerHTML = '';

    // Show file input again and reset its value
    document.getElementById('csv-file-selector').style.display = 'block';
    document.getElementById('csv-file-selector').value = '';  // Clear the previous file selection
}
