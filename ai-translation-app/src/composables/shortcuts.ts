import { useSwipe, type UseSwipeDirection } from "@vueuse/core";
import { onBeforeUnmount, onMounted, ref, watch } from "vue";

import { Logger } from "@services/log.service";
export function useShortcuts(next: () => void, prev: () => void) {
  // --- Handle swipe using VueUse
  const swipeTarget = ref<HTMLElement | null>(null);
  const log = Logger.getInstance();

  //Need to go to system gestures in android

  const { direction } = useSwipe(swipeTarget, {
    threshold: 50,
  });

  watch(direction, (dir: UseSwipeDirection) => {
    log.debug(`swipe ${dir}`);

    // If focus is on a textarea or input, ignore swipe
    const activeElement = document.activeElement;
    if (
      activeElement instanceof HTMLTextAreaElement ||
      (activeElement instanceof HTMLInputElement &&
        ["text", "search", "email", "url", "tel", "number"].includes(
          activeElement.type
        ))
    ) {
      log.debug("Ignoring swipe, focus is on text area");
      return;
    }
    if (dir === "left") {
      next();
    } else if (dir === "right") {
      prev();
    }
  });

  log.info("Loading shortcuts 2");

  // Register the directive globally in this component

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

  return {
    swipeTarget,
  };
}
