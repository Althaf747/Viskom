let currentQuestionIndex = 0;
let questions = [];
let userAnswers = []; // This will store selected answers for each question
let correctAnswers = 0;
let quizStarted = false;

function loadJSONFromSelection(event) {
    const selectedFile = event.target.value;
    if (!selectedFile) return;

    const fileMap = {
        "quiz1.json": "data/quiz1.json",
        "quiz2.json": "data/quiz2.json",   // Update with correct path to your JSON file
    };

    // Fetch the selected JSON file
    fetch(fileMap[selectedFile])
        .then(response => response.json())
        .then(data => {
            parseQuestions(data);  // Ensure this function exists as well
        });
}

function parseQuestions(data) {
    data.forEach((questionData) => {
        const questionText = questionData.question;
        const options = questionData.options;
        const correctAnswers = questionData.answer.split(';'); // Split multiple correct answers by semicolon

        questions.push({
            questionText,
            options,
            correctAnswers
        });
    });

    // Start the quiz after loading all questions
    startQuiz();
}

function startQuiz() {
    quizStarted = true;
    document.getElementById('json-file-selector').style.display = 'none';  // Hide file dropdown after starting
    document.getElementById('next-button').innerText = "Next";   // Change button text to Next after quiz starts
    document.getElementById('check-answer-button').style.display = 'inline-block'; // Show Check Answer button
    document.getElementById('previous-button').style.display = 'inline-block'; // Show Previous button
    displayQuestion(currentQuestionIndex);  // Display the first question
}

function displayQuestion(index) {
    const question = questions[index];
    
    // Display the question number in the format "Question i of j"
    document.getElementById('question-number').innerText = `Question ${index + 1} of ${questions.length}`;

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

    // Preselect answers if the user has already selected them
    if (userAnswers[index]) {
        userAnswers[index].selectedOptions.forEach(selectedOption => {
            const checkbox = document.querySelector(`#options input[value="${selectedOption}"]`);
            if (checkbox) checkbox.checked = true;
        });
    }

    document.getElementById('next-button').disabled = false;
    document.getElementById('previous-button').disabled = index === 0; // Disable "Previous" on the first question
    document.getElementById('reset-button').disabled = false;
}

function nextQuestion() {
    const selectedOptions = getSelectedOptions();
    checkAnswers(selectedOptions);

    currentQuestionIndex++;

    // If the current question is the last one, show results
    if (currentQuestionIndex < questions.length) {
        displayQuestion(currentQuestionIndex);
    } else {
        displayResults(); // Show the results if it's the last question
    }
}

function previousQuestion() {
    currentQuestionIndex--;

    if (currentQuestionIndex >= 0) {
        displayQuestion(currentQuestionIndex);
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

    const isCorrect = selectedOptions.length === correctAnswersForQuestion.length && 
                      selectedOptions.every((option, index) => option === correctAnswersForQuestion[index]);

    // Ensure the score is only updated if the answer is correct and has not been checked before
    if (userAnswers[currentQuestionIndex] === undefined || userAnswers[currentQuestionIndex].isCorrect !== isCorrect) {
        if (isCorrect) {
            correctAnswers++;  // Increment score if the selected answers are correct
        }
    }

    // Store user answers for later when navigating back
    userAnswers[currentQuestionIndex] = { selectedOptions, isCorrect };
}

function displayResults() {
    // Display the result score
    document.getElementById('score').innerText = `You answered ${correctAnswers} out of ${questions.length} questions correctly.`;
    
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
    document.getElementById('previous-button').style.display = 'none'; // Hide the Previous button

    // Reset question and options display
    document.getElementById('question').innerText = '';
    document.getElementById('options').innerHTML = '';

    // Reset all checkboxes
    const checkboxes = document.querySelectorAll('#options input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        checkbox.checked = false;  // Uncheck all checkboxes
        checkbox.disabled = false;  // Enable all checkboxes
    });

    // Show file input again and reset its value
    document.getElementById('json-file-selector').style.display = 'block';
    document.getElementById('json-file-selector').value = '';  // Clear the previous file selection

    // Re-enable the Check Answer button
    document.getElementById('check-answer-button').style.display = 'inline-block';  // Ensure it's visible
    document.getElementById('check-answer-button').disabled = false;  // Ensure it's enabled and clickable
}