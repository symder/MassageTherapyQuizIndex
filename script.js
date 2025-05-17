let questions = [];
const numQuestions = 2;

async function loadQuestions() {
  const res = await fetch('questions.json');
  const data = await res.json();
  questions = getRandomQuestions(data, numQuestions);
  renderQuiz();
}

function getRandomQuestions(questionBank, num) {
  return questionBank.sort(() => 0.5 - Math.random()).slice(0, num);
}

function renderQuiz() {
  const container = document.getElementById('quiz-container');
  container.innerHTML = '';

  questions.forEach((q, index) => {
    const qDiv = document.createElement('div');
    qDiv.classList.add('question');
    qDiv.innerHTML = `<p>${index + 1}. ${q.question}</p>` +
      q.choices.map((choice, i) => `
        <label>
          <input type="radio" name="q${index}" value="${i}">
          ${choice}
        </label><br>
      `).join('');
    container.appendChild(qDiv);
  });
}

function submitQuiz() {
  let score = 0;
  const resultsDiv = document.getElementById('results');
  resultsDiv.innerHTML = '';

  questions.forEach((q, index) => {
    const selected = document.querySelector(`input[name="q${index}"]:checked`);
    const userAnswer = selected ? parseInt(selected.value) : -1;

    const isCorrect = userAnswer === q.correctIndex;
    if (isCorrect) score++;

    if (selected) {
      selected.parentElement.classList.add(isCorrect ? "correct" : "incorrect");
    }

    const resultHTML = `
      <p><strong>Q${index + 1}:</strong> ${q.question}<br>
      Your answer: ${q.choices[userAnswer] || "None"}<br>
      ${isCorrect ? "<span style='color:green;'>Correct!</span>" : "<span style='color:red;'>Incorrect.</span>"}<br>
      <span class="feedback">${q.feedback}</span></p>
    `;
    resultsDiv.innerHTML += resultHTML;
  });

  resultsDiv.innerHTML = `<h2>Your Score: ${score} / ${questions.length}</h2>` + resultsDiv.innerHTML;
}

loadQuestions();
