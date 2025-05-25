<template>
  <div>
    <!-- Menu Button -->
    <button @click="drawer = true" class="menu-button" aria-label="Open menu">
      <svg viewBox="0 0 24 24" width="24" height="24">
        <path
          fill="currentColor"
          d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"
        />
      </svg>
    </button>

    <!-- Navigation Drawer -->
    <div class="drawer-overlay" v-if="drawer" @click="drawer = false"></div>

    <div class="drawer" :class="{ 'drawer-open': drawer }">
      <div class="drawer-header">
        <h3>Menu</h3>
        <button
          @click="drawer = false"
          class="close-button"
          aria-label="Close menu"
        >
          <svg viewBox="0 0 24 24" width="24" height="24">
            <path
              fill="currentColor"
              d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
            />
          </svg>
        </button>
      </div>

      <nav class="drawer-nav">
        <router-link
          v-for="item in menuItems"
          :key="item.path"
          :to="item.path"
          @click="drawer = false"
          class="nav-item"
        >
          <svg-icon :path="item.icon" class="icon"></svg-icon>
          {{ item.name }}
        </router-link>
      </nav>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

//import SvgIcon from "@jamescoyle/vue-icon";
import SvgIcon from "vue3-icon";
interface MenuItem {
  name: string;
  path: string;
  icon: string;
  subtitle?: string;
}

interface Props {
  menuItems: MenuItem[];
}

const props = withDefaults(defineProps<Props>(), {
  menuItems: () => [{ name: "Home", path: "/", icon: "home" }],
});

const drawer = ref(false);

console.log(`Dn`, props.menuItems);
</script>

<style scoped>
/* Add the same styles as in the previous Drawer example */
/* Menu Button */
.menu-button {
  background: none;
  border: none;
  padding: 12px;
  color: #333;
}

/* Drawer Styles */
.drawer-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 100;
}

.drawer {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  width: 280px;
  background: white;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.15);
  transform: translateX(-100%);
  transition: transform 0.3s ease;
  z-index: 101;
}

.drawer-open {
  transform: translateX(0);
}

.drawer-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid #eee;
}

.close-button {
  background: none;
  border: none;
  padding: 8px;
}

/* Navigation Items */
.drawer-nav {
  padding: 8px 0;
}

.nav-item {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  text-decoration: none;
  color: #333;
}

.nav-item:hover {
  background-color: #f5f5f5;
}

.nav-item.router-link-active {
  background-color: #e3f2fd;
  color: #1976d2;
}

.nav-item span {
  margin-right: 16px;
  font-size: 24px;
}

.icon {
  color: currentColor;
  transform: scale(2); /* 2x size */
  transform-origin: center;
}
</style>
