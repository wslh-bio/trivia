import type { AnswerRecord } from '~/types/trivia'

export interface TriviaSubmission {
  playerName: string
  answers: AnswerRecord[]
  score: number
  totalQuestions: number
  submittedAt: string
}

/**
 * Submits the final trivia results to a Google Sheet via a Google Apps
 * Script Web App (see README.md for how to set this up). The request is
 * sent with mode "no-cors" because Apps Script web apps don't return
 * CORS headers that the browser can read; the data still reaches the
 * script and gets appended to the sheet, we just can't read the response.
 */
export function useSubmitResults() {
  const isSubmitting = ref(false)
  const submitError = ref<string | null>(null)

  async function submitResults(submission: TriviaSubmission) {
    const config = useRuntimeConfig()
    const gasUrl = config.public.gasUrl

    if (!gasUrl) {
      submitError.value = 'No Google Sheets endpoint is configured (NUXT_PUBLIC_GAS_URL).'
      return false
    }

    isSubmitting.value = true
    submitError.value = null

    try {
      const body = new URLSearchParams()
      body.set('playerName', submission.playerName)
      body.set('score', String(submission.score))
      body.set('totalQuestions', String(submission.totalQuestions))
      body.set('submittedAt', submission.submittedAt)
      body.set('answers', JSON.stringify(submission.answers))

      await fetch(gasUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body
      })

      return true
    } catch (err) {
      submitError.value = 'Failed to submit results to Google Sheets.'
      console.error(err)
      return false
    } finally {
      isSubmitting.value = false
    }
  }

  return { isSubmitting, submitError, submitResults }
}
