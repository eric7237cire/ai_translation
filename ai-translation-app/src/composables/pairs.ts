import { onMounted, ref, watch, watchEffect } from "vue";
import { StorageService } from "@services/storage.service";
import { ASIMOV_FILE, TextLoader } from "@services/textloader.service";
import { isNumber } from "lodash";
export function usePairs() {
  const prompt = ref(
    "Ignore all previous attemps/instructions.  Act as if this were a new chat/session.  Check my translation.  Correct my spelling, grammar, word choice, etc.  Give the corrections and commentary in spanish.  You should use no english in the response.  Prefer latin american spanish in the translation corrections.  Note all changes in bold in the corrected text with numbered footnotes giving the explanation of the change.  If my translation is correct gramatically only give a correction if its unnatural / ackward in its phrasing."
  );
  const english = ref(
    "But slowly Multivac learned enough to answer deeper questions more fundamentally, and on May 14, 2061, what had been theory, became fact."
  );
  const spanish = ref(
    "Pero poco a poco Multivac aprendía suficiente para responder  preguntas más profundas y fundamentales, y el 14 de mayo de 2061, lo que había sido teoría se convirtió en realidad. "
  );

  const currentIndex = ref(0);

  const storageService = new StorageService();

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

      if (isNumber(curIdx)) {
        currentIndex.value = curIdx;
      }
    } catch (error) {
      console.error("Error al cargar el archivo:", error);
    }
  });

  watchEffect(() => {
    const _version = storageService.versionTracker;
    console.log(`Data changed ${_version.value}`);
    loadPair();
  });

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

  return { english, spanish, prompt, currentIndex, next, prev, storageService };
}
