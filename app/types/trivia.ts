export type AnswerKey = 'A' | 'B' | 'C' | 'D'

export interface QuestionOption {
  key: AnswerKey
  text: string
}

export interface Question {
  question: string
  options: QuestionOption[]
  correctAnswer: AnswerKey
  timeLimitSeconds: number
}

export interface AnswerRecord {
  question: string
  selectedAnswer: AnswerKey | null
  correctAnswer: AnswerKey
  isCorrect: boolean
  timeTakenSeconds: number
}
