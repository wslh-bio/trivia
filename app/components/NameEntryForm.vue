<script setup lang="ts">
const name = ref('')
const emit = defineEmits<{ start: [name: string] }>()

function handleSubmit() {
  const trimmed = name.value.trim()
  if (!trimmed) return
  emit('start', trimmed)
}
</script>

<template>
  <form class="name-entry" @submit.prevent="handleSubmit">
    <span class="eyebrow">UW–Madison</span>
    <h1>Trivia Time</h1>
    <p>Enter your name to begin the challenge.</p>
    <input
      v-model="name"
      type="text"
      placeholder="Your name"
      autofocus
      maxlength="60"
      required
    >
    <button type="submit">Start Quiz</button>
  </form>
</template>

<style scoped>
.name-entry {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  max-width: 28rem;
  margin: 4rem auto;
  padding: 2.25rem 2rem;
  border-radius: 1rem;
  background: #fff;
  border: 1px solid rgba(197, 5, 12, 0.18);
  box-shadow: 0 0.75rem 1.5rem rgba(18, 18, 18, 0.08);
  text-align: center;
}

.eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.35rem 0.7rem;
  border-radius: 999px;
  background: #f8e8e9;
  color: #9b0000;
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

h1 {
  margin: 0;
  color: #121212;
  font-size: clamp(2rem, 4vw, 2.75rem);
  line-height: 1.1;
}

p {
  margin: 0;
  color: #4b5563;
  font-size: 1rem;
}

input {
  width: 100%;
  padding: 0.8rem 0.9rem;
  font-size: 1rem;
  color: #121212;
  background: #fff;
  border: 1px solid #cbd5e1;
  border-radius: 0.75rem;
  box-sizing: border-box;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
}

input:focus {
  outline: none;
  border-color: #c5050c;
  box-shadow: 0 0 0 3px rgba(197, 5, 12, 0.15);
}

button {
  padding: 0.8rem 1.75rem;
  font-size: 1rem;
  font-weight: 700;
  color: #fff;
  background: linear-gradient(180deg, #c5050c 0%, #a50209 100%);
  border: none;
  border-radius: 0.75rem;
  cursor: pointer;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
  box-shadow: 0 0.5rem 1rem rgba(197, 5, 12, 0.2);
}

button:hover {
  transform: translateY(-1px);
  box-shadow: 0 0.75rem 1.25rem rgba(197, 5, 12, 0.22);
}
</style>
