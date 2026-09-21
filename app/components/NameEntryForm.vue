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
    <h1>🧠 Trivia Time!</h1>
    <p>Enter your name to start the quiz.</p>
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
  max-width: 24rem;
  margin: 4rem auto;
  padding: 2rem;
  border-radius: 0.75rem;
  background: #fff;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  text-align: center;
}

h1 {
  margin: 0;
}

input {
  width: 100%;
  padding: 0.65rem 0.85rem;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 0.5rem;
  box-sizing: border-box;
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
  transition: background 0.15s ease;
}

button:hover {
  background: #4338ca;
}
</style>
