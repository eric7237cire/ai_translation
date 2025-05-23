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
    const target = e.target as HTMLElement;
    //console.log(target.tagName);
    const isTextInput =
      target.tagName === "INPUT" &&
      (target as HTMLInputElement).type === "text";
    const isTextarea = target.tagName === "TEXTAREA";
    const isContentEditable = target.isContentEditable;

    if (isTextInput || isTextarea || isContentEditable) {
      /*console.log(
        `Not navigating ${isTextInput} ${isTextarea} ${isContentEditable}`
      );*/
      return; // Don't navigate
    }
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
