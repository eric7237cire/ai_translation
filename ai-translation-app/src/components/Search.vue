<template>
  <div class="search-container h-full flex flex-col">
    <div class="search-box flex-grow-0">
      <input
        v-model="searchQuery"
        @input="performSearch"
        placeholder="Search..."
        class="search-input"
      />
      <button @click="clearSearch" class="clear-button" v-if="searchQuery">
        ×
      </button>
    </div>

    <ul class="results-list flex-grow" v-if="filteredResults.length > 0">
      <li
        v-for="(result, index) in filteredResults"
        :key="index"
        @click="selectResult(result)"
        class="result-item"
      >
        <span v-html="highlightMatches(result.text)"></span>
      </li>
    </ul>

    <div v-if="searchQuery && filteredResults.length === 0" class="no-results">
      No results found for "{{ searchQuery }}"
    </div>
  </div>
</template>

<script setup lang="ts">
import { StorageService } from "@services/storage.service";
import { ref, computed, type Ref } from "vue";
import { useRoute, useRouter, type LocationQueryValue } from "vue-router";

interface SearchItem {
  index: number;
  text: string;
  is_eng: boolean;
}

const storageService = new StorageService();

const items: Ref<Array<SearchItem>> = ref([]);

const router = useRouter();
const route = useRoute();
const searchQuery = ref((route.query.q as LocationQueryValue) || "");

storageService.getAllPairs().then((pairs) => {
  const newItems = [];
  for (const [idx, pair] of pairs.entries()) {
    newItems.push({
      index: idx,
      text: pair.english,
      is_eng: true,
    });
    newItems.push({
      index: idx,
      text: pair.spanish,
      is_eng: false,
    });
  }

  items.value = newItems;
});

// Perform search whenever query changes
const filteredResults = computed(() => {
  router.replace({
    query: { ...route.query, q: searchQuery.value },
  });
  if (!searchQuery.value) return [];

  const query = searchQuery.value.toLowerCase();
  return items.value
    .filter((item) => item.text.toLowerCase().includes(query))
    .map((item) => {
      //find sentence with item
      // Find the matching sentence
      const sentences = item.text.split(/[.!?"]/);
      const matchingSentences = sentences.filter((sentence) =>
        sentence.toLowerCase().includes(query)
      );

      return {
        ...item,
        text: matchingSentences.join(" "),
      };

      //only include that sentence
    });
});

// Highlight matching text in results
function highlightMatches(text: string) {
  if (!searchQuery.value) return text;

  const query = searchQuery.value.toLowerCase();
  const index = text.toLowerCase().indexOf(query);

  if (index === -1) return text;

  const before = text.substring(0, index);
  const match = text.substring(index, index + query.length);
  const after = text.substring(index + query.length);

  return `${before}<strong>${match}</strong>${after}`;
}

function clearSearch() {
  searchQuery.value = "";
}

const emit = defineEmits(["select"]);

function selectResult(result: SearchItem) {
  storageService.setMeta("currentIndex", result.index);
  router.push("/");
}
</script>

<style scoped>
.search-container {
  position: relative;
  max-width: 600px;
  margin: 0 auto;
}

.search-box {
  position: relative;
  display: flex;
  align-items: center;
}

.search-input {
  width: 100%;
  padding: 12px 20px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
  outline: none;
  transition: border-color 0.3s;
}

.search-input:focus {
  border-color: #4285f4;
}

.clear-button {
  position: absolute;
  right: 10px;
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: #999;
}

.clear-button:hover {
  color: #333;
}

.results-list {
  list-style: none;
  padding: 0;
  margin: 8px 0 0;
  border: 1px solid #eee;
  border-radius: 4px;

  overflow-y: auto;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.result-item {
  padding: 12px 20px;
  cursor: pointer;
  border-bottom: 1px solid #eee;
  transition: background-color 0.2s;
}

.result-item:last-child {
  border-bottom: none;
}

.result-item:hover {
  background-color: #f5f5f5;
}

.no-results {
  padding: 12px;
  color: #666;
  text-align: center;
}

/* Make the highlighted text bold */
.result-item strong {
  font-weight: bold;
  color: #4285f4;
}
</style>
