import Papa from 'papaparse'
import type { AnswerKey, Question } from '~/types/trivia'

const DEFAULT_TIME_LIMIT_SECONDS = 15
const VALID_ANSWER_KEYS: AnswerKey[] = ['A', 'B', 'C', 'D']

interface QuestionRow {
  question: string
  option_a: string
  option_b: string
  option_c: string
  option_d: string
  correct_answer: string
  time_limit_seconds?: string
}

function parseRow(row: QuestionRow): Question | null {
  if (!row.question?.trim()) return null

  const correctAnswer = row.correct_answer?.trim().toUpperCase() as AnswerKey
  if (!VALID_ANSWER_KEYS.includes(correctAnswer)) return null

  const parsedTimeLimit = Number.parseInt(row.time_limit_seconds ?? '', 10)
  const timeLimitSeconds = Number.isFinite(parsedTimeLimit) && parsedTimeLimit > 0
    ? parsedTimeLimit
    : DEFAULT_TIME_LIMIT_SECONDS

  return {
    question: row.question.trim(),
    options: [
      { key: 'A', text: row.option_a?.trim() ?? '' },
      { key: 'B', text: row.option_b?.trim() ?? '' },
      { key: 'C', text: row.option_c?.trim() ?? '' },
      { key: 'D', text: row.option_d?.trim() ?? '' }
    ].filter(option => option.text.length > 0),
    correctAnswer,
    timeLimitSeconds
  }
}

/**
 * Loads and parses the trivia questions from /questions.csv (in the public/ folder).
 */
export function useQuestions() {
  const questions = ref<Question[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  async function loadQuestions() {
    isLoading.value = true
    error.value = null

    try {
      const csvText = await $fetch<string>('/questions.csv', { responseType: 'text' })
      const parsed = Papa.parse<QuestionRow>(csvText, {
        header: true,
        skipEmptyLines: true
      })

      if (parsed.errors.length > 0) {
        console.warn('CSV parsing warnings:', parsed.errors)
      }

      questions.value = parsed.data
        .map(parseRow)
        .filter((question): question is Question => question !== null)

      if (questions.value.length === 0) {
        error.value = 'No valid questions were found in questions.csv.'
      }
    } catch (err) {
      error.value = 'Failed to load questions.csv. Please check the file exists in the public folder.'
      console.error(err)
    } finally {
      isLoading.value = false
    }
  }

  return { questions, isLoading, error, loadQuestions }
}
