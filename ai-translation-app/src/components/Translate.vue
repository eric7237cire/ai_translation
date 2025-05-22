<script setup lang="ts">
import { ref, watch, onMounted } from "vue";
import { IndexedDBService } from "../services/storage.service";
import { TextLoader, ASIMOV_FILE } from "../services/textloader.service";
import _ from "lodash";
defineProps<{ msg: string }>();

const prompt = ref(
  "Ignore all previous chats / instructions. Check my translation.  I'm doing this to learn spanish.  Correct my spelling, grammar, word choice, etc.  Give the corrections and commentary in spanish.  You should use no english in the response.  Prefer latin american spanish.  Note all changes in bold in the corrected text with footnotes giving the explanation of the change.  If what I wrote is correct gramatically only give a correction if its unnatural / ackward in its phrasing."
);
const english = ref(
  "But slowly Multivac learned enough to answer deeper questions more fundamentally, and on May 14, 2061, what had been theory, became fact."
);
const spanish = ref(
  "Pero poco a poco Multivac aprendía suficiente para responder  preguntas más profundas y fundamentales, y el 14 de mayo de 2061, lo que había sido teoría se convirtió en realidad. "
);

const currentIndex = ref(0);

const storageService = new IndexedDBService();

onMounted(async () => {
  try {
    const text = await TextLoader.loadTextFile(ASIMOV_FILE);
    const parag = TextLoader.splitTextIntoParagraphs(text);
    console.log(`Num parag ${parag.length}`);
    for (const [pIdx, p] of parag.entries()) {
      const pair = await storageService.getPairAtIndex(pIdx);
      if (!pair || !pair.english) {
        await storageService.savePairAtIndex(pIdx, {
          english: p,
          spanish: "A hacer",
        });
      }
    }

    const curIdx = await storageService.getMeta("currentIndex");

    if (_.isNumber(curIdx)) {
      currentIndex.value = curIdx;
    }
    loadPair();
    //console.log(text);
  } catch (error) {
    console.error("Error al cargar el archivo:", error);
  }
});

async function copyToClipboard() {
  try {
    const text = prompt.value + "\n\n" + english.value + "\n\n" + spanish.value;
    await navigator.clipboard.writeText(text);
    //alert(`Copied to clipboard!\n${text}`);
  } catch (err) {
    alert("Failed to copy: " + err);
  }
}

// 🔄 Cargar datos cuando cambia el índice
async function loadPair() {
  const pair = await storageService.getPairAtIndex(currentIndex.value);
  english.value = pair?.english || "";
  spanish.value = pair?.spanish || "";
}

// 🔄 Guardar cuando cambian textos
watch([english, spanish], ([eng, spa]) => {
  storageService.savePairAtIndex(currentIndex.value, {
    english: eng,
    spanish: spa,
  });
});

watch(currentIndex, (curIdx) => {
  storageService.setMeta("currentIndex", curIdx);
});

// 🔁 Cambiar índice y recargar
function next() {
  currentIndex.value++;
  loadPair();
}
function prev() {
  if (currentIndex.value > 0) {
    currentIndex.value--;
    loadPair();
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
