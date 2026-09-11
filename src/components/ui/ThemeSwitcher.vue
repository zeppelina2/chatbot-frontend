<template>
  <q-toggle
    v-model="isDark"
    color="primary"
    checked-icon="dark_mode"
    unchecked-icon="light_mode"
  />
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { useTheme } from "@/composables/useTheme";

const {
  isDark,
  initializeTheme,
} = useTheme();

onMounted(initializeTheme);
</script>
