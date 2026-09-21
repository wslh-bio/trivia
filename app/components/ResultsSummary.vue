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
    <h1>🎉 Nice work, {{ playerName }}!</h1>
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

    <button type="button" @click="emit('restart')">Play Again</button>
  </div>
</template>

<style scoped>
.results {
  max-width: 32rem;
  margin: 3rem auto;
  padding: 2rem;
  border-radius: 0.75rem;
  background: #fff;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  text-align: center;
}

.score {
  font-size: 1.25rem;
  font-weight: 600;
}

.status {
  color: #6b7280;
}

.status.error {
  color: #dc2626;
}

.status.success {
  color: #16a34a;
}

.answer-list {
  list-style: none;
  margin: 1.5rem 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  text-align: left;
}

.answer-list li {
  padding: 0.65rem 0.85rem;
  border-radius: 0.5rem;
  border-left: 4px solid transparent;
  background: #f9fafb;
}

.answer-list li.correct {
  border-left-color: #22c55e;
}

.answer-list li.incorrect {
  border-left-color: #ef4444;
}

.question {
  display: block;
  font-weight: 600;
}

.detail {
  display: block;
  font-size: 0.875rem;
  color: #6b7280;
}

button {
  padding: 0.65rem 1.5rem;
  font-size: 1rem;
  font-weight: 600;
  color: #fff;
  background: #4f46e5;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
}

button:hover {
  background: #4338ca;
}
</style>
