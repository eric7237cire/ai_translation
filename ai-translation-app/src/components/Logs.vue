<template>
  <div class="p-4">
    <h2 class="text-xl font-bold mb-4">Logs</h2>
    <table class="w-full border border-gray-300 text-sm">
      <thead>
        <tr class="bg-gray-100 text-left">
          <th class="p-2 border">Nivel</th>
          <th class="p-2 border">Fecha</th>
          <th class="p-2 border">Mensaje</th>
          <th class="p-2 border">Objeto</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(log, index) in logs" :key="index" class="border-t">
          <td class="p-2 border">{{ levelToString(log.level) }}</td>
          <td class="p-2 border">{{ formatDate(log.timestamp) }}</td>
          <td class="p-2 border">{{ log.message }}</td>
          <td class="p-2 border whitespace-pre-wrap">
            <pre v-if="log.obj">{{ formatObj(log.obj) }}</pre>
            <span v-else class="text-gray-400 italic">null</span>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { Logger } from "@services/log.service";

interface LogEntry {
  level: number;
  message: string;
  obj: unknown | null;
  timestamp: string;
}

const logs = ref<LogEntry[]>([]);

const logger = Logger.getInstance();

onMounted(() => {
  logs.value = [...logger.getLogs()];
  logs.value.reverse();
});

function levelToString(level: number): string {
  switch (level) {
    case 1:
      return "DEBUG";
    case 2:
      return "INFO";
    case 3:
      return "WARN";
    case 4:
      return "ERROR";
    default:
      return "UNKNOWN";
  }
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0"); // Meses son 0-indexados
  const dd = String(date.getDate()).padStart(2, "0");
  const hh = String(date.getHours()).padStart(2, "0");
  const mi = String(date.getMinutes()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd} ${hh}:${mi}`;
}

function formatObj(obj: unknown): string {
  try {
    return JSON.stringify(obj, null, 2);
  } catch {
    return String(obj);
  }
}
</script>

<style scoped>
table {
  border-collapse: collapse;
}
</style>
