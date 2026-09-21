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
  </div>
</template>

<style>
body {
  margin: 0;
  font-family: system-ui, -apple-system, 'Segoe UI', sans-serif;
  background: #f1f5f9;
  color: #111827;
}

.app-shell {
  min-height: 100vh;
}

.status {
  text-align: center;
  margin-top: 4rem;
  font-size: 1.1rem;
  color: #6b7280;
}

.status.error {
  max-width: 24rem;
  margin: 1rem auto 0;
  color: #dc2626;
}
</style>
