<script setup lang="ts">
import type { AnswerRecord } from '~/types/trivia'

defineProps<{
  playerName: string
  answers: AnswerRecord[]
  score: number
  isSubmitting: boolean
  submitError: string | null
}>()

const emit = defineEmits<{ restart: [] }>()
</script>

<template>
  <div class="results">
    <span class="eyebrow">Results</span>
    <h1>Nice work, {{ playerName }}!</h1>
    <p class="score">You scored {{ score }} / {{ answers.length }}</p>

    <p v-if="isSubmitting" class="status">Submitting your results…</p>
    <p v-else-if="submitError" class="status error">{{ submitError }}</p>
    <p v-else class="status success">Your results were saved. Thanks for playing!</p>

    <ol class="answer-list">
      <li v-for="(answer, index) in answers" :key="index" :class="{ correct: answer.isCorrect, incorrect: !answer.isCorrect }">
        <span class="question">{{ answer.question }}</span>
        <span class="detail">
          Your answer: {{ answer.selectedAnswer ?? 'No answer (time up)' }}
          <template v-if="!answer.isCorrect"> · Correct: {{ answer.correctAnswer }}</template>
        </span>
      </li>
    </ol>
  </div>
</template>

<style scoped>
.results {
  max-width: 42rem;
  margin: 3rem auto;
  padding: 2.25rem 2rem;
  border-radius: 1rem;
  background: #fff;
  border: 1px solid rgba(197, 5, 12, 0.18);
  box-shadow: 0 0.75rem 1.5rem rgba(18, 18, 18, 0.08);
  text-align: center;
}

.eyebrow {
  display: inline-block;
  margin-bottom: 0.75rem;
  color: #9b0000;
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

h1 {
  margin: 0;
  color: #121212;
  font-size: clamp(2rem, 3vw, 2.7rem);
}

.score {
  margin: 1rem auto 0.25rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem 1rem;
  border-radius: 999px;
  background: #f8e8e9;
  color: #9b0000;
  font-size: 1.1rem;
  font-weight: 700;
}

.status {
  color: #4b5563;
  margin-top: 1rem;
}

.status.error {
  color: #c5050c;
}

.status.success {
  color: #0f8a5f;
}

.answer-list {
  list-style: none;
  margin: 1.5rem 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  text-align: left;
}

.answer-list li {
  padding: 0.8rem 0.9rem;
  border-radius: 0.75rem;
  border-left: 0.35rem solid transparent;
  background: #f6f7f8;
}

.answer-list li.correct {
  border-left-color: #0f8a5f;
}

.answer-list li.incorrect {
  border-left-color: #c5050c;
}

.question {
  display: block;
  font-weight: 700;
  color: #121212;
}

.detail {
  display: block;
  margin-top: 0.25rem;
  font-size: 0.875rem;
  color: #4b5563;
}

button {
  padding: 0.8rem 1.75rem;
  font-size: 1rem;
  font-weight: 700;
  color: #fff;
  background: linear-gradient(180deg, #c5050c 0%, #9b0000 100%);
  border: none;
  border-radius: 0.75rem;
  cursor: pointer;
  box-shadow: 0 0.5rem 1rem rgba(197, 5, 12, 0.18);
}

button:hover {
  box-shadow: 0 0.75rem 1.3rem rgba(197, 5, 12, 0.22);
}
</style>
