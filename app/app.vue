<script setup lang="ts">
import type { AnswerKey, AnswerRecord } from '~/types/trivia'

type Stage = 'name' | 'loading' | 'quiz' | 'results'

const stage = ref<Stage>('name')
const playerName = ref('')
const currentIndex = ref(0)
const answers = ref<AnswerRecord[]>([])

const { questions, error: loadError, loadQuestions } = useQuestions()
const { isSubmitting, submitError, submitResults } = useSubmitResults()

const currentQuestion = computed(() => questions.value[currentIndex.value])
const score = computed(() => answers.value.filter(a => a.isCorrect).length)

async function startQuiz(name: string) {
  playerName.value = name
  stage.value = 'loading'

  await loadQuestions()

  if (loadError.value || questions.value.length === 0) {
    stage.value = 'name'
    return
  }

  currentIndex.value = 0
  answers.value = []
  stage.value = 'quiz'
}

function handleAnswer(selectedAnswer: AnswerKey | null, timeTakenSeconds: number) {
  const question = currentQuestion.value
  answers.value.push({
    question: question.question,
    selectedAnswer,
    correctAnswer: question.correctAnswer,
    isCorrect: selectedAnswer === question.correctAnswer,
    timeTakenSeconds
  })

  if (currentIndex.value + 1 < questions.value.length) {
    currentIndex.value += 1
  } else {
    finishQuiz()
  }
}

async function finishQuiz() {
  stage.value = 'results'
  await submitResults({
    playerName: playerName.value,
    answers: answers.value,
    score: score.value,
    totalQuestions: questions.value.length,
    submittedAt: new Date().toISOString()
  })
}

function restart() {
  playerName.value = ''
  currentIndex.value = 0
  answers.value = []
  stage.value = 'name'
}
</script>

<template>
  <div class="app-shell">
    <main class="content">
      <NameEntryForm v-if="stage === 'name'" @start="startQuiz" />

      <p v-else-if="stage === 'loading'" class="status">Loading questions…</p>

      <QuestionCard
        v-else-if="stage === 'quiz' && currentQuestion"
        :key="currentIndex"
        :question="currentQuestion"
        :question-number="currentIndex + 1"
        :total-questions="questions.length"
        @answer="handleAnswer"
      />

      <ResultsSummary
        v-else-if="stage === 'results'"
        :player-name="playerName"
        :answers="answers"
        :score="score"
        :is-submitting="isSubmitting"
        :submit-error="submitError"
        @restart="restart"
      />

      <p v-if="loadError && stage === 'name'" class="status error">{{ loadError }}</p>
    </main>
  </div>
</template>

<style>
:root {
  --uw-red: #c5050c;
  --uw-dark-red: #9b0000;
  --uw-black: #121212;
  --uw-light-gray: #e1e5e7;
  --uw-off-white: #f6f7f8;
  --uw-success: #0f8a5f;
  --uw-warning: #d97706;
}

html {
  background: var(--uw-off-white);
}

body {
  margin: 0;
  min-height: 100vh;
  font-family: 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
  background: linear-gradient(180deg, #f7f7f7 0%, #eef1f3 100%);
  color: var(--uw-black);
}

* {
  box-sizing: border-box;
}

button,
input {
  font: inherit;
}

.app-shell {
  min-height: 100vh;
}

.content {
  max-width: 64rem;
  margin: 0 auto;
  padding: 2rem 1rem 3rem;
}

.status {
  text-align: center;
  margin-top: 4rem;
  font-size: 1.1rem;
  color: #4b5563;
}

.status.error {
  max-width: 24rem;
  margin: 1rem auto 0;
  color: var(--uw-red);
}

</style>
