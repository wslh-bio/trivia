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
  max-width: 40rem;
  margin: 3rem auto;
  padding: 2rem;
  border-radius: 1rem;
  background: #fff;
  border: 1px solid rgba(197, 5, 12, 0.15);
  box-shadow: 0 0.75rem 1.5rem rgba(18, 18, 18, 0.08);
}

.progress-track {
  height: 0.7rem;
  border-radius: 999px;
  background: #e1e5e7;
  overflow: hidden;
  margin-bottom: 1.5rem;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #c5050c 0%, #9b0000 100%);
  transition: width 0.1s linear, background-color 0.2s ease;
}

.progress-fill.urgent {
  background: linear-gradient(90deg, #9b0000 0%, #c5050c 100%);
}

.question-meta {
  margin: 0 0 0.75rem;
  color: #6b7280;
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.question-text {
  margin: 0 0 1.5rem;
  color: #121212;
  font-size: clamp(1.5rem, 2.5vw, 2.1rem);
  line-height: 1.3;
}

.options {
  display: grid;
  gap: 0.85rem;
}

.option {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  padding: 0.9rem 1rem;
  font-size: 1rem;
  text-align: left;
  background: #f5f7f8;
  border: 2px solid transparent;
  border-radius: 0.8rem;
  cursor: pointer;
  transition: background 0.15s ease, border-color 0.15s ease, transform 0.15s ease;
  color: #121212;
}

.option:hover:not(:disabled) {
  background: #edf1f3;
  transform: translateY(-1px);
}

.option:disabled {
  cursor: default;
}

.option-key {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border-radius: 999px;
  background: #fff;
  border: 1px solid rgba(18, 18, 18, 0.12);
  color: #9b0000;
  font-weight: 800;
  flex-shrink: 0;
}

.option.correct {
  background: #ebf8f1;
  border-color: #0f8a5f;
}

.option.incorrect {
  background: #feeceb;
  border-color: #c5050c;
}
</style>
