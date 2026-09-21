<script setup lang="ts">
import type { AnswerKey, Question } from '~/types/trivia'

const props = defineProps<{
  question: Question
  questionNumber: number
  totalQuestions: number
}>()

const emit = defineEmits<{
  answer: [selectedAnswer: AnswerKey | null, timeTakenSeconds: number]
}>()

const FEEDBACK_DELAY_MS = 1200

const progressPercent = ref(100)
const selectedAnswer = ref<AnswerKey | null>(null)
const isAnswered = ref(false)

const durationMs = props.question.timeLimitSeconds * 1000
const startedAt = performance.now()

let rafId: number | null = null
let feedbackTimeoutId: ReturnType<typeof setTimeout> | null = null

function tick() {
  const elapsed = performance.now() - startedAt
  const remaining = Math.max(durationMs - elapsed, 0)
  progressPercent.value = (remaining / durationMs) * 100

  if (remaining <= 0) {
    handleTimeout()
    return
  }

  rafId = requestAnimationFrame(tick)
}

function stopTicking() {
  if (rafId !== null) {
    cancelAnimationFrame(rafId)
    rafId = null
  }
}

function elapsedSeconds() {
  return Math.min((performance.now() - startedAt) / 1000, props.question.timeLimitSeconds)
}

function selectAnswer(answer: AnswerKey) {
  if (isAnswered.value) return
  isAnswered.value = true
  selectedAnswer.value = answer
  stopTicking()
  feedbackTimeoutId = setTimeout(() => {
    emit('answer', answer, elapsedSeconds())
  }, FEEDBACK_DELAY_MS)
}

function handleTimeout() {
  if (isAnswered.value) return
  isAnswered.value = true
  selectedAnswer.value = null
  stopTicking()
  feedbackTimeoutId = setTimeout(() => {
    emit('answer', null, elapsedSeconds())
  }, FEEDBACK_DELAY_MS)
}

function optionClass(optionKey: AnswerKey) {
  if (!isAnswered.value) return ''
  if (optionKey === props.question.correctAnswer) return 'correct'
  if (optionKey === selectedAnswer.value) return 'incorrect'
  return ''
}

onMounted(() => {
  rafId = requestAnimationFrame(tick)
})

onBeforeUnmount(() => {
  stopTicking()
  if (feedbackTimeoutId !== null) clearTimeout(feedbackTimeoutId)
})
</script>

<template>
  <div class="question-card">
    <div class="progress-track">
      <div
        class="progress-fill"
        :class="{ urgent: progressPercent < 25 }"
        :style="{ width: `${progressPercent}%` }"
      />
    </div>

    <p class="question-meta">Question {{ questionNumber }} of {{ totalQuestions }}</p>
    <h2 class="question-text">{{ question.question }}</h2>

    <div class="options">
      <button
        v-for="option in question.options"
        :key="option.key"
        type="button"
        class="option"
        :class="optionClass(option.key)"
        :disabled="isAnswered"
        @click="selectAnswer(option.key)"
      >
        <span class="option-key">{{ option.key }}</span>
        <span>{{ option.text }}</span>
      </button>
    </div>
  </div>
</template>

<style scoped>
.question-card {
  max-width: 32rem;
  margin: 3rem auto;
  padding: 2rem;
  border-radius: 0.75rem;
  background: #fff;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
}

.progress-track {
  height: 0.5rem;
  border-radius: 999px;
  background: #e5e7eb;
  overflow: hidden;
  margin-bottom: 1.5rem;
}

.progress-fill {
  height: 100%;
  background: #4f46e5;
  transition: width 0.1s linear, background-color 0.2s ease;
}

.progress-fill.urgent {
  background: #dc2626;
}

.question-meta {
  margin: 0 0 0.5rem;
  color: #6b7280;
  font-size: 0.875rem;
}

.question-text {
  margin: 0 0 1.5rem;
}

.options {
  display: grid;
  gap: 0.75rem;
}

.option {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.85rem 1rem;
  font-size: 1rem;
  text-align: left;
  background: #f3f4f6;
  border: 2px solid transparent;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: background 0.15s ease, border-color 0.15s ease;
}

.option:hover:not(:disabled) {
  background: #e5e7eb;
}

.option:disabled {
  cursor: default;
}

.option-key {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.75rem;
  height: 1.75rem;
  border-radius: 999px;
  background: #fff;
  font-weight: 600;
  flex-shrink: 0;
}

.option.correct {
  background: #dcfce7;
  border-color: #22c55e;
}

.option.incorrect {
  background: #fee2e2;
  border-color: #ef4444;
}
</style>
