# WSLH Trivia

A single-page trivia app built with Nuxt. Players enter their name, answer
timed multiple-choice questions loaded from a CSV file, and their results are
submitted to a Google Sheet.

## How it works

- Questions live in [public/questions.csv](public/questions.csv) with columns:
  `question, option_a, option_b, option_c, option_d, correct_answer, time_limit_seconds`.
  `correct_answer` is one of `A`/`B`/`C`/`D`. `time_limit_seconds` is optional
  (defaults to 15 seconds if omitted or invalid).
- Each question shows a progress bar that ticks down over its time limit; if
  time runs out before an answer is chosen, it's recorded as unanswered.
- After the last question, the player's name, score, and per-question answers
  are POSTed to a Google Apps Script Web App, which appends a row to a Google
  Sheet.

## Google Sheets setup

1. Create a new Google Sheet with a header row: `Timestamp, Player Name, Score, Total Questions, Answers`.
2. In the Sheet, open **Extensions > Apps Script** and replace the default
   code with the contents of [google-apps-script/Code.gs](google-apps-script/Code.gs).
3. Click **Deploy > New deployment**, choose type **Web app**, set
   "Execute as" to **Me** and "Who has access" to **Anyone**, then deploy.
4. Copy the deployment URL and set it as `NUXT_PUBLIC_GAS_URL` in a `.env`
   file (see [.env.example](.env.example)).

## Setup

Make sure to install dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm dev

# yarn
yarn dev

# bun
bun run dev
```

## Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm build

# yarn
yarn build

# bun
bun run build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm preview

# yarn
yarn preview

# bun
bun run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.
