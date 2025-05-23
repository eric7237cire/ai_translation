<script setup lang="ts">
import { usePairs } from "@/composables/pairs";
defineProps<{ msg: string }>();

const { english, spanish, prompt, currentIndex, next, prev } = usePairs();

async function copyToClipboard() {
  try {
    const text = prompt.value + "\n\n" + english.value + "\n\n" + spanish.value;
    await navigator.clipboard.writeText(text);
    //alert(`Copied to clipboard!\n${text}`);
  } catch (err) {
    alert("Failed to copy: " + err);
  }
}
</script>

<template>
  <div class="container">
    <h1>
      <a href="https://vite.dev" target="_blank">
        <img src="/vite.svg" class="logo" alt="Vite logo" />
      </a>
      AI Translation Helper<a href="https://vuejs.org/" target="_blank">
        <img src="../assets/vue.svg" class="logo vue" alt="Vue logo" />
      </a>
    </h1>

    <div class="section">
      <label for="prompt">Prompt</label>
      <textarea id="prompt" v-model="prompt" rows="5"></textarea>
    </div>

    <div class="nav">
      <button @click="prev" :disabled="currentIndex <= 0">⬅</button>
      <span>Index: {{ currentIndex }}</span>
      <button @click="next">➡</button>
    </div>

    <div class="section">
      <label for="english">English</label>
      <textarea id="english" v-model="english" rows="7"></textarea>
    </div>

    <div class="section">
      <label for="spanish">Spanish</label>
      <textarea id="spanish" v-model="spanish" rows="7"></textarea>
    </div>

    <button @click="copyToClipboard()">Copy</button>
  </div>
</template>

<style scoped>
.container {
  max-width: 900px;
  width: 900px;
  margin: auto;
  padding: 1rem;
  font-family: sans-serif;
}
h1 {
  text-align: center;
  margin-bottom: 1rem;
}
.nav {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
}
.section {
  margin-bottom: 1.5rem;
}
label {
  display: block;
  margin-bottom: 0.25rem;
  font-weight: bold;
}
textarea {
  width: 100%;
  margin-bottom: 0.5rem;
  padding: 0.5rem;
  font-size: 1rem;
}
button {
  padding: 0.5rem 1rem;
  cursor: pointer;
}
.logo {
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
