<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";

import { useAuthStore } from "@/stores/auth-store";

const router = useRouter();
const auth = useAuthStore();
const isLoggingOut = ref(false);
const logoutError = ref("");

const handleLogout = async () => {
  if (isLoggingOut.value) return;
  isLoggingOut.value = true;
  logoutError.value = "";

  try {
    await auth.logout();
  } catch {
    logoutError.value = "Не удалось выйти из аккаунта. Попробуй ещё раз.";
    isLoggingOut.value = false;
    return;
  }

  try {
    await router.replace("/");
  } finally {
    // Новый экземпляр приложения начнёт работу с пустыми сторами чата.
    window.location.reload();
  }
};
</script>

<template>
  <q-page class="settings-page">
    <section class="account-card" aria-labelledby="account-title">
      <h1 id="account-title" class="account-title">Аккаунт</h1>
      <dl class="q-my-lg">
        <dt class="account-label">Логин</dt>
        <dd class="account-name">{{ auth.user?.username }}</dd>
      </dl>
      <p v-if="logoutError" class="text-negative" role="alert">{{ logoutError }}</p>
      <q-btn
        outline no-caps color="primary" icon="logout" label="Выйти из аккаунта"
        :loading="isLoggingOut" @click="handleLogout"
      />
    </section>
  </q-page>
</template>

<style scoped>
.settings-page {
  height: 100%;
  overflow: auto;
  padding: 90px 16px 24px;
  color: var(--text-primary);
}

.account-card {
  max-width: 660px;
  margin: 0 auto;
  padding: clamp(20px, 4vw, 32px);
  border: 1px solid var(--border-divider);
  border-radius: 16px;
  background: var(--surface-sidebar);
}

.account-title {
  margin: 0;
  font: var(--font-accent-weight) 1.5rem/1.3 var(--font-accent);
}

.account-label {
  color: var(--text-muted);
}

.account-name {
  margin: 4px 0 0;
  overflow-wrap: anywhere;
}
</style>
