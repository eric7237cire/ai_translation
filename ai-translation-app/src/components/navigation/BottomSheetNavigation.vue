<template>
  <div>
    <!-- Menu Button -->
    <button @click="showMenu = true" class="fab-button" aria-label="Open menu">
      <svg viewBox="0 0 24 24" width="24" height="24">
        <path
          fill="currentColor"
          d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"
        />
      </svg>
    </button>

    <!-- Bottom Sheet Menu -->
    <div
      class="bottom-sheet-overlay"
      v-if="showMenu"
      @click="showMenu = false"
    ></div>

    <div class="bottom-sheet" :class="{ 'bottom-sheet-open': showMenu }">
      <div class="bottom-sheet-header">
        <div class="drag-handle"></div>
      </div>

      <nav class="bottom-sheet-nav">
        <router-link
          v-for="item in menuItems"
          :key="item.path"
          :to="item.path"
          @click="showMenu = false"
          class="nav-item"
        >
          <span class="material-icons" v-if="item.icon">{{ item.icon }}</span>
          <div>
            <div class="nav-title">{{ item.name }} {{ item.subtitle }}</div>
            <div class="nav-subtitle" v-if="item.subtitle">
              {{ item.subtitle }}
            </div>
          </div>
        </router-link>
      </nav>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

interface MenuItem {
  name: string;
  path: string;
  icon?: string;
  subtitle: string;
}

interface Props {
  menuItems: MenuItem[];
}

withDefaults(defineProps<Props>(), {
  menuItems: () => [
    {
      name: "Home",
      path: "/",
      icon: "home",
      subtitle: "Return to main page",
    },
  ],
});

const showMenu = ref(false);
</script>

<style scoped>
/* Add the same styles as in the previous BottomSheet example */
/* FAB Button */
.fab-button {
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background-color: #6200ee;
  color: white;
  border: none;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 99;
}

/* Bottom Sheet Styles */
.bottom-sheet-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 100;
}

.bottom-sheet {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  background: white;
  border-radius: 16px 16px 0 0;
  transform: translateY(100%);
  transition: transform 0.3s ease;
  z-index: 101;
  max-height: 80vh;
  overflow-y: auto;
  padding-bottom: env(safe-area-inset-bottom);
}

.bottom-sheet-open {
  transform: translateY(0);
}

.bottom-sheet-header {
  padding: 16px;
  display: flex;
  justify-content: center;
}

.drag-handle {
  width: 40px;
  height: 4px;
  background-color: #ccc;
  border-radius: 2px;
}

/* Navigation Items */
.bottom-sheet-nav {
  padding: 8px 0;
}

.nav-item {
  display: flex;
  align-items: center;
  padding: 16px;
  text-decoration: none;
  color: #333;
  gap: 16px;
}

.nav-item:hover {
  background-color: #f5f5f5;
}

.nav-item.router-link-active {
  background-color: #f1e6ff;
}

.nav-title {
  font-weight: 500;
}

.nav-subtitle {
  font-size: 0.8em;
  color: #666;
  margin-top: 4px;
}
</style>
