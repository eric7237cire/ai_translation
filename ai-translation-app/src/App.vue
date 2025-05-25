<script setup lang="ts">
import DrawerNavigation from "@components/navigation/DrawerNavigation.vue";
import { mdilHome } from "@mdi/light-js";
import { mdilMagnify } from "@mdi/light-js";
import { mdilTooltipText } from "@mdi/light-js";
const navItems = [
  { name: "Home", path: "/", subtitle: "Main page", icon: mdilHome },
  { name: "Search", path: "/search", subtitle: "Search", icon: mdilMagnify },
  { name: "Logs", path: "/logs", icon: mdilTooltipText },
];
</script>

<template>
  <div class="flex flex-col h-screen w-full">
    <DrawerNavigation :menu-items="navItems" class="flex-grow-0" />
    <div class="flex-grow">
      <router-view></router-view>
    </div>
  </div>
</template>

<style scoped></style>
