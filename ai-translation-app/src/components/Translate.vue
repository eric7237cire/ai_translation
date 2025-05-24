<script setup lang="ts">
import { usePairs } from "@composables/pairs";
import { useSaveLoad } from "@composables/file-save-load";
import { useShortcuts } from "@composables/shortcuts";
defineProps<{ msg: string }>();

const { english, spanish, prompt, currentIndex, next, prev, storageService } =
  usePairs();
const { saveToFile, loadFromFile, triggerFile, fileInput } =
  useSaveLoad(storageService);
useShortcuts(next, prev);

import { ref } from "vue";

const visible = ref(false);

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
  <div class="container flex flex-col h-full">
    <button
      @click="visible = !visible"
      class="mb-4 px-4 py-2 bg-blue-500 text-white rounded"
    >
      {{ visible ? "Hide Header/Prompt" : "Show Header/Prompt" }}
    </button>
    <h1
      v-if="visible"
      class="flex flex-row items-center justify-center text-2xl"
    >
      <a href="https://vite.dev" target="_blank">
        <img src="/vite.svg" class="logo" alt="Vite logo" />
      </a>
      AI Translation Helper<a href="https://vuejs.org/" target="_blank">
        <img src="../assets/vue.svg" class="logo vue" alt="Vue logo" />
      </a>
    </h1>

    <div class="section" v-if="visible">
      <label for="prompt">Prompt</label>
      <textarea id="prompt" v-model="prompt" rows="5"></textarea>
    </div>

    <div
      ref="swipeTarget"
      class="nav flex flex-row items-center justify-center gap-4 mb-6"
    >
      <button @click="prev" :disabled="currentIndex <= 0">⬅</button>
      <span>Index: {{ currentIndex }}</span>
      <button @click="next">➡</button>
    </div>

    <div class="section grow max-h-[350px] flex flex-col">
      <label for="english">English</label>
      <textarea id="english" v-model="english" class="flex-grow"></textarea>
    </div>

    <div class="section grow max-h-[350px] flex flex-col">
      <label for="spanish">Spanish</label>
      <textarea id="spanish" v-model="spanish" class="flex-grow"></textarea>
    </div>

    <div
      class="button-bar flex flex-row items-center justify-center gap-4 mb-4"
    >
      <button @click="saveToFile()">Save</button>
      <!-- <button @click="loadFromFile()">Load</button> -->
      <button @click="triggerFile" class="rounded">Load</button>
      <input
        ref="fileInput"
        type="file"
        accept=".json"
        @change="loadFromFile"
        class="hidden"
      />
      <button @click="copyToClipboard()">Copy</button>
    </div>
  </div>
</template>

<style scoped>
.container {
  max-width: 900px;
  width: 100vw;
  font-family: sans-serif;

  padding: 1rem;
  box-sizing: border-box;
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
  border-color: black;
  border-width: 1px;
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
