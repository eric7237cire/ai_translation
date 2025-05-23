import { useSwipe, type UseSwipeDirection } from "@vueuse/core";
import { onBeforeUnmount, onMounted, ref, watch } from "vue";

export function useShortcuts(next: () => void, prev: () => void) {
  // --- Handle swipe using VueUse
  const swipeTarget = ref(null);
  const { direction } = useSwipe(swipeTarget, {
    threshold: 50,
  });

  watch(direction, (dir: UseSwipeDirection) => {
    if (dir === "left") {
      next();
    } else if (dir === "right") {
      prev();
    }
  });

  // --- Keyboard support
  function handleKeydown(e: KeyboardEvent) {
    if (e.key === "ArrowLeft") {
      prev();
    } else if (e.key === "ArrowRight") {
      next();
    }
  }

  onMounted(() => {
    window.addEventListener("keydown", handleKeydown);
  });

  onBeforeUnmount(() => {
    window.removeEventListener("keydown", handleKeydown);
  });
}
