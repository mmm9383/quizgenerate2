import { Quiz, Question } from "@shared/schema";

export function generateQuizTemplate(
  quiz: Quiz,
  answers?: Array<{
    questionIndex: number;
    selectedOption: number;
    timeSpent: number;
  }>,
  finalScore?: number,
) {
  const isResults = answers !== undefined && finalScore !== undefined;

  const template = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${isResults ? `Results - ${quiz.title}` : quiz.title}</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
    :root {
      --color-bg-light: linear-gradient(to bottom right, #ffffff, #f3f4f6);
      --color-bg-dark: linear-gradient(to bottom right, #111827, #1f2937);
      --color-text-light: #1f2937;
      --color-text-dark: #f3f4f6;
      --color-card-light: white;
      --color-card-dark: #1f2937;
      --color-border-light: #e5e7eb;
      --color-border-dark: #374151;
    }
    body { 
      font-family: 'Inter', sans-serif;
      min-height: 100vh;
      background: var(--color-bg-light);
      color: var(--color-text-light);
      transition: background 0.3s, color 0.3s;
    }
    body.dark {
      background: var(--color-bg-dark);
      color: var(--color-text-dark);
    }
    .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border-radius: 0.5rem;
      font-weight: 500;
      transition: all 0.2s;
      padding: 0.5rem 1rem;
    }
    .btn-primary {
      background: linear-gradient(to right, #2563eb, #3b82f6);
      color: white;
    }
    .btn-primary:hover {
      background: linear-gradient(to right, #1d4ed8, #2563eb);
    }
    .btn-outline {
      border: 1px solid var(--color-border-light);
      background: var(--color-card-light);
    }
    body.dark .btn-outline {
      border-color: var(--color-border-dark);
      background: var(--color-card-dark);
    }
    body.dark .bg-green-50 {
      background-color: #1f3235 !important;
        }
    body.dark .bg-red-50 {
          background-color: #332830 !important;
        }
    body.dark .bg-blue-50 {
          background-color: #243d75;
        }
    body.dark .bg-gray-50 {
          background-color: #113457 !important;
        }
    .text-gray-600 {
          color: #006aff !important;
        }
    .btn-outline:hover {
      background: #f9fafb;
    }
    body.dark .btn-outline:hover {
      background: #374151;
    }
    .card {
      background: var(--color-card-light);
      border-radius: 0.75rem;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
      padding: 1.5rem;
    }
    body.dark .card {
      background: var(--color-card-dark);
    }
    .theme-toggle {
      position: fixed;
      top: 1rem;
      right: 1rem;
      z-index: 50;
      background: rgba(255, 255, 255, 0.2);
      backdrop-filter: blur(4px);
      border-radius: 9999px;
      padding: 0.5rem;
      border: 1px solid rgba(255, 255, 255, 0.1);
      cursor: pointer;
      transition: all 0.2s;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 2.5rem;
      height: 2.5rem;
    }
    body.dark .theme-toggle {
      background: rgba(0, 0, 0, 0.2);
    }
    .theme-toggle:hover {
      transform: scale(1.05);
    }
  </style>
</head>
<body class="p-4">
  <div class="container max-w-3xl mx-auto">
    <button id="theme-toggle" class="theme-toggle" aria-label="Toggle theme">
      <svg id="theme-icon-sun" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
      <svg id="theme-icon-moon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display: none;"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
    </button>
    ${
      isResults
        ? generateResultsContent(quiz, answers, finalScore)
        : generateQuizContent(quiz)
    }
  </div>
  ${!isResults ? generateQuizScript(quiz) : ""}
  <script>
    // Theme toggle functionality
    const themeToggle = document.getElementById('theme-toggle');
    const sunIcon = document.getElementById('theme-icon-sun');
    const moonIcon = document.getElementById('theme-icon-moon');

    // Function to update icons based on current theme
    function updateThemeIcons(isDark) {
      if (isDark) {
        sunIcon.style.display = 'none';
        moonIcon.style.display = 'block';
      } else {
        sunIcon.style.display = 'block';
        moonIcon.style.display = 'none';
      }
    }

    // Check for saved theme preference or use system preference
    const savedTheme = localStorage.getItem('quiz-theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme === 'dark') {
      document.body.classList.add('dark');
      updateThemeIcons(true);
    } else if (savedTheme === 'light') {
      document.body.classList.add('light');
      updateThemeIcons(false);
    } else {
      // Use system preference by default
      if (prefersDark) {
        document.body.classList.add('dark');
        updateThemeIcons(true);
      } else {
        document.body.classList.add('light');
        updateThemeIcons(false);
      }
    }

    // Listen for system theme changes if no preference is set
    if (!savedTheme) {
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        const newPrefersDark = e.matches;
        document.body.classList.remove('dark', 'light');
        document.body.classList.add(newPrefersDark ? 'dark' : 'light');
        updateThemeIcons(newPrefersDark);
      });
    }

    // Toggle theme when the button is clicked
    themeToggle.addEventListener('click', () => {
      const isDarkMode = document.body.classList.contains('dark');
      document.body.classList.remove('dark', 'light');

      if (isDarkMode) {
        document.body.classList.add('light');
        localStorage.setItem('quiz-theme', 'light');
        updateThemeIcons(false);
      } else {
        document.body.classList.add('dark');
        localStorage.setItem('quiz-theme', 'dark');
        updateThemeIcons(true);
      }
    });
  </script>
</body>
</html>
`;

  return template;
}

function generateQuizContent(quiz: Quiz) {
  return `
    <div id="cover" class="py-12">
      <div class="card text-center">
        <h1 class="text-3xl font-bold mb-4">${quiz.title}</h1>
        <p class="text-gray-600 dark:text-gray-400 mb-8">${quiz.description || ""}</p>
        <button
          onclick="startQuiz()"
          class="btn btn-primary"
        >
          Start Quiz
        </button>
      </div>
    </div>

    <div id="quiz" class="hidden">
      <div class="flex items-center justify-between mb-4">
        <div class="text-sm text-gray-600 dark:text-gray-400">
          Question <span id="current-question">1</span> of ${quiz.questions.length}
        </div>
        <div class="text-sm text-gray-600 dark:text-gray-400">
          Time remaining: <span id="timer">30</span>s
        </div>
      </div>

      <div class="card mb-4">
        <h2 id="question-text" class="text-xl font-semibold mb-4"></h2>
        <div id="question-image" class="mb-4"></div>
        <div id="options" class="space-y-2"></div>
      </div>

      <div class="flex gap-2">
        <button
          id="skip-btn"
          onclick="skipQuestion()"
          class="btn btn-outline flex-1"
        >
          Skip Question
        </button>
        <button
          id="submit-btn"
          onclick="submitAnswer()"
          class="btn btn-primary flex-1"
          disabled
        >
          Submit Answer
        </button>
      </div>
    </div>

    <div id="results" class="hidden">
      <div class="card text-center py-8">
        <div class="text-6xl font-bold mb-4">
          <span id="score">0</span>%
        </div>
        <p id="performance-message" class="text-2xl text-gray-600 dark:text-gray-400"></p>
      </div>
    </div>
  `;
}

function generateQuizScript(quiz: Quiz) {
  return `
    <script>
      const quiz = ${JSON.stringify(quiz)};
      let currentQuestionIndex = 0;
      let answers = [];
      let timer;
      let timeSpent = 0;
      let selectedOption = null;

      function startQuiz() {
        document.getElementById('cover').classList.add('hidden');
        document.getElementById('quiz').classList.remove('hidden');
        showQuestion();
      }

      function showQuestion() {
        const question = quiz.questions[currentQuestionIndex];
        document.getElementById('current-question').textContent = currentQuestionIndex + 1;
        document.getElementById('question-text').textContent = question.text;

        // Display question image if available - using direct URL
        const questionImageContainer = document.getElementById('question-image');
        if (question.imageUrl) {
          questionImageContainer.innerHTML = \`<img src="\${question.imageUrl}" alt="Question image" class="max-w-full rounded-lg">\`;
        } else {
          questionImageContainer.innerHTML = '';
        }

        const optionsContainer = document.getElementById('options');
        // Remove any existing explanation div
        const existingExplanation = optionsContainer.parentNode.querySelector('.mt-4.p-4.bg-gray-50');
        if (existingExplanation) {
          existingExplanation.remove();
        }

        optionsContainer.innerHTML = question.options.map((option, index) => \`
          <button
            onclick="selectOption(\${index})"
            class="btn btn-outline w-full text-left"
          >
            \${String.fromCharCode(65 + index)}: \${option}
          </button>
        \`).join('');

        // Reset the submit button for each question
        const submitBtn = document.getElementById('submit-btn');
        submitBtn.disabled = true;
        submitBtn.textContent = 'Submit Answer';
        submitBtn.onclick = function() {
          submitAnswer();
        };

        startTimer(question.timeLimit || 30);
      }

      function selectOption(index) {
        selectedOption = index;
        const buttons = document.getElementById('options').children;
        Array.from(buttons).forEach(btn => {
          btn.classList.remove('bg-blue-50', 'border-blue-500');
        });
        buttons[index].classList.add('bg-blue-50', 'border-blue-500');

        document.getElementById('submit-btn').disabled = false;
      }

      function skipQuestion() {
        clearInterval(timer);
        // Record that this question was skipped with explicit status
        answers.push({
          questionIndex: currentQuestionIndex,
          selectedOption: null,
          timeSpent,
          status: 'skipped'
        });

        currentQuestionIndex++;
        selectedOption = null;

        if (currentQuestionIndex < quiz.questions.length) {
          showQuestion();
        } else {
          showResults();
        }
      }

      function startTimer(duration) {
        clearInterval(timer);
        timeSpent = 0;
        let timeLeft = duration;

        document.getElementById('timer').textContent = timeLeft;

        timer = setInterval(() => {
          timeLeft--;
          timeSpent++;
          document.getElementById('timer').textContent = timeLeft;

          if (timeLeft <= 0) {
            clearInterval(timer);
            handleTimeExpired();
          }
        }, 1000);
      }

      function handleTimeExpired() {
        // Handle case when time expires but no option is selected
        if (selectedOption === null) {
          answers.push({
            questionIndex: currentQuestionIndex,
            selectedOption: -1,  // Mark as no selection
            timeSpent: quiz.questions[currentQuestionIndex].timeLimit || 30,
            status: 'timeExpired'
          });

          showCorrectAnswer();
          enableNextButton();
          return;
        }
        
        submitAnswer('timeExpired');
      }
      
      function enableNextButton() {
        const submitBtn = document.getElementById('submit-btn');
        if (submitBtn) {
          submitBtn.textContent = currentQuestionIndex < quiz.questions.length - 1 ? 'Next Question' : 'View Results';
          submitBtn.onclick = handleNextQuestion;
          submitBtn.disabled = false;
        }
      }
      
      function showCorrectAnswer() {
        const question = quiz.questions[currentQuestionIndex];
        const optionsContainer = document.getElementById('options');
        const buttons = optionsContainer.children;
        
        // Show correct answer
        Array.from(buttons).forEach((btn, index) => {
          if (index === question.correctAnswer) {
            btn.classList.add('bg-green-50', 'border-green-500', 'text-green-700');
          }
        });
        
        // Show explanation if available
        if (question.explanation) {
          const explanationDiv = document.createElement('div');
          explanationDiv.className = 'mt-4 p-4 bg-gray-50 rounded-lg';
          explanationDiv.innerHTML = \`<p class="font-semibold">Explanation:</p><p>\${question.explanation}</p>\`;
          optionsContainer.parentNode.appendChild(explanationDiv);
        }
      }

      function submitAnswer(forcedStatus = null) {
        // Only proceed if an option has been selected or if a status is forced
        if (selectedOption === null && !forcedStatus) {
          return;
        }

        clearInterval(timer);
        const question = quiz.questions[currentQuestionIndex];
        const isCorrect = selectedOption === question.correctAnswer;

        const optionsContainer = document.getElementById('options');
        const buttons = optionsContainer.children;

        // Show correct and wrong answers
        Array.from(buttons).forEach((btn, index) => {
          if (index === question.correctAnswer) {
            btn.classList.add('bg-green-50', 'border-green-500', 'text-green-700');
          } else if (index === selectedOption && !isCorrect) {
            btn.classList.add('bg-red-50', 'border-red-500', 'text-red-700');
          }
        });

        // Show explanation if available
        if (question.explanation) {
          const explanationDiv = document.createElement('div');
          explanationDiv.className = 'mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg';
          explanationDiv.innerHTML = \`
            <p class="font-medium">Explanation:</p>
            <p class="text-gray-600 dark:text-gray-400">\${question.explanation}</p>
          \`;
          optionsContainer.parentNode.appendChild(explanationDiv);
        }

        // Update submit button based on question position
        const submitBtn = document.getElementById('submit-btn');
        if (currentQuestionIndex < quiz.questions.length - 1) {
          submitBtn.textContent = 'Next Question';
        } else {
          submitBtn.textContent = 'View Results';
        }
        submitBtn.onclick = handleNextQuestion;
        submitBtn.disabled = false;
        
        // If a status is forced (like timeExpired), use that status
        if (forcedStatus) {
          // Add the answer with forced status but don't move to next question yet
          answers.push({
            questionIndex: currentQuestionIndex,
            selectedOption: selectedOption,
            timeSpent,
            status: forcedStatus
          });
        }
      }

      function handleNextQuestion() {
        // Only add answer if not already added (in case of time expired)
        const existingAnswer = answers.find(a => a.questionIndex === currentQuestionIndex);
        
        if (!existingAnswer) {
          // Determine status based on selected option
          const question = quiz.questions[currentQuestionIndex];
          let status;
          
          if (selectedOption === null) {
            status = 'skipped';
          } else if (selectedOption === question.correctAnswer) {
            status = 'correct';
          } else {
            status = 'incorrect';
          }
          
          // Save the answer with the appropriate status
          answers.push({
            questionIndex: currentQuestionIndex,
            selectedOption,
            timeSpent,
            status
          });
        }

        currentQuestionIndex++;
        selectedOption = null; // Reset selected option for next question

        if (currentQuestionIndex < quiz.questions.length) {
          showQuestion();
        } else {
          showResults();
        }
      }

      function showResults() {
        document.getElementById('quiz').classList.add('hidden');
        document.getElementById('results').classList.remove('hidden');

        // Count answers by status
        const correctAnswers = answers.filter(a => a.status === 'correct').length;
        const skippedQuestions = answers.filter(a => a.status === 'skipped').length;
        const timeExpiredQuestions = answers.filter(a => a.status === 'timeExpired').length;

        const score = Math.round((correctAnswers / quiz.questions.length) * 100);
        document.getElementById('score').textContent = score;

        // Show performance message
        const thresholds = Object.keys(quiz.performanceMessages)
          .map(Number)
          .sort((a, b) => b - a);

        let message = quiz.performanceMessages[0];
        for (const threshold of thresholds) {
          if (score >= threshold) {
            message = quiz.performanceMessages[threshold];
            break;
          }
        }

        document.getElementById('performance-message').textContent = message;

        // Add review section
        const resultsDiv = document.getElementById('results');
        const reviewDiv = document.createElement('div');
        reviewDiv.className = 'space-y-6 mt-8';

        quiz.questions.forEach((question, index) => {
          const answer = answers.find(a => a.questionIndex === index) || {
            questionIndex: index,
            selectedOption: null,
            timeSpent: 0,
            status: 'skipped'
          };
          
          let statusClass = '';
          let statusText = '';
          
          switch (answer.status) {
            case 'correct':
              statusClass = 'text-green-600';
              statusText = 'Correct';
              break;
            case 'incorrect':
              statusClass = 'text-red-600';
              statusText = 'Incorrect';
              break;
            case 'skipped':
              statusClass = 'text-blue-600';
              statusText = 'Skipped';
              break;
            case 'timeExpired':
              statusClass = 'text-orange-600';
              statusText = 'Time Expired';
              break;
          }

          reviewDiv.innerHTML += \`
            <div class="card">
              <div class="flex items-center justify-between mb-4">
                <h3 class="font-medium">Question \${index + 1}</h3>
                <div class="flex items-center gap-4">
                  <span class="text-sm text-gray-600 dark:text-gray-400">
                    Time spent: \${answer.timeSpent}s
                  </span>
                  <span class="text-sm \${statusClass}">
                    \${statusText}
                  </span>
                </div>
              </div>

              <p class="mb-4">\${question.text}</p>
              \${question.imageUrl ? \`<img src="\${question.imageUrl}" alt="Question image" class="mb-4 max-w-full rounded-lg">\` : ''}

              <div class="space-y-2">
                \${question.options.map((option, optIndex) => \`
                  <div class="p-4 rounded-lg \${
                    optIndex === question.correctAnswer
                      ? 'bg-green-50 dark:bg-green-900/20 border-green-500'
                      : (answer.selectedOption !== null && optIndex === answer.selectedOption)
                      ? 'bg-red-50 dark:bg-red-900/20 border-red-500'
                      : 'border border-gray-200 dark:border-gray-700'
                  }">
                    \${String.fromCharCode(65 + optIndex)}: \${option}
                  </div>
                \`).join('')}
              </div>
              
              \${answer.status === 'skipped' ? \`
                <div class="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <p class="text-blue-600">This question was skipped.</p>
                </div>
              \` : ''}
              
              \${answer.status === 'timeExpired' ? \`
                <div class="mt-4 p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                  <p class="text-orange-600">Time expired for this question.</p>
                </div>
              \` : ''}

              \${question.explanation ? \`
                <div class="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <p class="font-medium">Explanation:</p>
                  <p class="text-gray-600 dark:text-gray-400">\${question.explanation}</p>
                </div>
              \` : ''}
            </div>
          \`;
        });

        resultsDiv.appendChild(reviewDiv);
      }
    </script>
  `;
}

function generateResultsContent(
  quiz: Quiz,
  answers: Array<{
    questionIndex: number;
    selectedOption: number;
    timeSpent: number;
    status: 'correct' | 'incorrect' | 'skipped' | 'timeExpired';
  }>,
  score: number,
) {
  // Ensure all questions have a corresponding answer entry
  const normalizedAnswers = quiz.questions.map((question, index) => {
    const existingAnswer = answers.find(a => a.questionIndex === index);
    if (existingAnswer) {
      return existingAnswer;
    }
    // If the question wasn't answered, create a skipped entry
    return {
      questionIndex: index,
      selectedOption: null,
      timeSpent: 0,
      status: 'skipped' as 'skipped'
    };
  });

  const totalQuestions = quiz.questions.length;
  const correctCount = normalizedAnswers.filter(a => a.status === 'correct').length;
  const incorrectCount = normalizedAnswers.filter(a => a.status === 'incorrect').length;
  const skippedCount = normalizedAnswers.filter(a => a.status === 'skipped').length;
  const timeExpiredCount = normalizedAnswers.filter(a => a.status === 'timeExpired').length;

  const correctPercentage = (correctCount / totalQuestions) * 100;
  const incorrectPercentage = (incorrectCount / totalQuestions) * 100;
  const skippedPercentage = (skippedCount / totalQuestions) * 100;
  const timeExpiredPercentage = (timeExpiredCount / totalQuestions) * 100;

  let content = `
    <div class="min-h-screen bg-gradient-to-br from-background to-secondary/10 p-4">
      <div class="container max-w-3xl mx-auto text-center">
        <h1 class="text-3xl font-bold mb-4">${quiz.title} - Results</h1>
        <div class="text-6xl font-bold mb-4">${score}%</div>
        <p class="text-2xl text-gray-600 dark:text-gray-400">
          ${correctCount} of ${totalQuestions} correct
        </p>
        
        <div class="mt-2">
          ${skippedCount > 0 ? `<p class="text-sm text-blue-500">${skippedCount} question${skippedCount !== 1 ? 's' : ''} skipped</p>` : ''}
          ${timeExpiredCount > 0 ? `<p class="text-sm text-orange-500">${timeExpiredCount} question${timeExpiredCount !== 1 ? 's' : ''} timed out</p>` : ''}
        </div>

        <div class="grid grid-cols-2 gap-4 my-8 text-center">
          <div class="bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400 p-4 rounded-lg border border-green-200 dark:border-green-800">
            <p class="font-medium">Correct</p>
            <p class="text-2xl font-bold">${correctCount}</p>
            <p class="text-sm">${correctPercentage.toFixed(1)}% of total</p>
          </div>
          <div class="bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-lg border border-red-200 dark:border-red-800">
            <p class="font-medium">Incorrect</p>
            <p class="text-2xl font-bold">${incorrectCount}</p>
            <p class="text-sm">${incorrectPercentage.toFixed(1)}% of total</p>
          </div>
          <div class="bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
            <p class="font-medium">Skipped</p>
            <p class="text-2xl font-bold">${skippedCount}</p>
            <p class="text-sm">${skippedPercentage.toFixed(1)}% of total</p>
          </div>
          <div class="bg-orange-100 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 p-4 rounded-lg border border-orange-200 dark:border-orange-800">
            <p class="font-medium">Time Expired</p>
            <p class="text-2xl font-bold">${timeExpiredCount}</p>
            <p class="text-sm">${timeExpiredPercentage.toFixed(1)}% of total</p>
          </div>
        </div>
        
        <div class="review-summary bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg mb-8 text-left">
          <h2 class="font-bold mb-2">Quiz Summary</h2>
          <ul class="space-y-1 text-sm">
            <li>• Total questions: ${totalQuestions}</li>
            <li>• Correctly answered: ${correctCount} (${correctPercentage.toFixed(1)}%)</li>
            <li>• Incorrectly answered: ${incorrectCount} (${incorrectPercentage.toFixed(1)}%)</li>
            <li>• Skipped questions: ${skippedCount} (${skippedPercentage.toFixed(1)}%)</li>
            <li>• Time expired questions: ${timeExpiredCount} (${timeExpiredPercentage.toFixed(1)}%)</li>
          </ul>
        </div>
      </div>
    </div>
  `;

  return content;
}