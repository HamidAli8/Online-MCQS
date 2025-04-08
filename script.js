// script.js
const unsplashAccessKey = 'pbjdDT2Db0tgp_7a33DawyfDKClkYGvDPMO6aasgQro'; 
const backgroundContainer = document.getElementById('background-container');
const questionContainer = document.getElementById('question-container');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const submitBtn = document.getElementById('submit-btn');
const resultDiv = document.getElementById('result');

let currentQuestionIndex = 0;
let userAnswers = {};

const questions = Array.from(document.querySelectorAll('#questions .question'));

async function fetchBackgroundImage(keyword) {
  const url = `https://api.unsplash.com/photos/random?query=${keyword}&client_id=${unsplashAccessKey}`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    const imageUrl = data.urls.regular;
    backgroundContainer.style.backgroundImage = `url(${imageUrl})`;
  } catch (error) {
    console.error('Error fetching image:', error);
  }
}
function displayQuestion(index) {
  const question = questions[index];
  questionContainer.innerHTML = question.innerHTML;

  const keyword = question.getAttribute('data-keyword');
  fetchBackgroundImage(keyword);

  if (userAnswers[index] !== undefined) {
    document.querySelector(`input[name="q${index + 1}"][value="${userAnswers[index]}"]`).checked = true;
  }

  prevBtn.disabled = index === 0;
  nextBtn.disabled = index === questions.length - 1;
  submitBtn.style.display = index === questions.length - 1 ? 'block' : 'none';
}

function saveAnswer(index) {
  const selectedOption = document.querySelector(`input[name="q${index + 1}"]:checked`);
  if (selectedOption) {
    userAnswers[index] = selectedOption.value;
  }
}

prevBtn.addEventListener('click', () => {
  saveAnswer(currentQuestionIndex);
  currentQuestionIndex--;
  displayQuestion(currentQuestionIndex);
});

nextBtn.addEventListener('click', () => {
  saveAnswer(currentQuestionIndex);
  currentQuestionIndex++;
  displayQuestion(currentQuestionIndex);
});

submitBtn.addEventListener('click', () => {
  saveAnswer(currentQuestionIndex);
  let score = 0;
  questions.forEach((question, index) => {
    const correctAnswer = question.getAttribute('data-correct');
    if (userAnswers[index] === correctAnswer) {
      score++;
    }
  });
  resultDiv.innerHTML = `You scored ${score} out of ${questions.length}!`;
});

displayQuestion(currentQuestionIndex);