<script setup lang="ts">
import { onMounted, ref } from "vue";
import axios from "axios";

import { useAuthStore } from "@/stores/auth-store";
import { apiLogin, apiRegister } from "@/api/auth";

const auth = useAuthStore();

type SessionStatus = "checking" | "guest" | "authenticated" | "error";

const status = ref<SessionStatus>("checking");
const isRegistering = ref(false);
const username = ref("");
const password = ref("");
const isPasswordVisible = ref(false);
const isSubmitting = ref(false);
const formError = ref("");
const formNotice = ref("");

const showRegistration = (open: boolean) => {
  isRegistering.value = open;
  isPasswordVisible.value = false;
  password.value = "";
  formError.value = "";
  formNotice.value = "";
};

const validateUsername = (value: string) => {
  const name = value.trim();
  if (!name) return "Введи логин";
  if (isRegistering.value && !/^[a-z0-9_]{3,64}$/.test(name)) {
    return "От 3 до 64 символов: строчные латинские буквы, цифры или _";
  }
  return true;
};

const validatePassword = (value: string) => {
  if (!value) return "Введи пароль";
  if (isRegistering.value) {
    const length = Array.from(value).length;
    if (length < 15 || length > 256) return "Пароль должен содержать от 15 до 256 символов";
  }
  return true;
};

const checkSession = async (afterLogin = false) => {
  status.value = "checking";

  try {
    await auth.loadUser();
    status.value = "authenticated";
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      status.value = "guest";
      if (afterLogin) {
        formError.value = "Вход выполнен, но браузер не подтвердил сессию. Проверь, разрешены ли cookie.";
      }
    } else {
      status.value = "error";
    }
  }
};

const submitForm = async () => {
  if (isSubmitting.value || status.value !== "guest") return;

  isSubmitting.value = true;
  isPasswordVisible.value = false;
  formError.value = "";
  formNotice.value = "";

  try {
    const credentials = {
      username: username.value.trim(),
      password: password.value,
    };
    if (isRegistering.value) {
      const { data } = await apiRegister(credentials.username, credentials.password);
      username.value = data.username;
      showRegistration(false);
      formNotice.value = "Аккаунт создан. Введи пароль, чтобы войти.";
      return;
    }

    await apiLogin(credentials.username, credentials.password);
    password.value = "";
    await checkSession(true);
  } catch (error) {
    const code = axios.isAxiosError(error) ? error.response?.status : undefined;
    if (isRegistering.value && code === 409) {
      formError.value = "Этот логин уже занят.";
    } else if (!isRegistering.value && code === 401) {
      formError.value = "Неверный логин или пароль.";
    } else if (code === 422) {
      formError.value = "Проверь логин и пароль.";
    } else {
      formError.value = isRegistering.value
        ? "Не удалось зарегистрироваться. Попробуй ещё раз."
        : "Не удалось войти. Попробуй ещё раз.";
    }
  } finally {
    isSubmitting.value = false;
  }
};

onMounted(() => checkSession());
</script>

<template>
  <slot v-if="status === 'authenticated' && auth.user" />

  <main v-else class="auth-page">
    <div v-if="status === 'checking'" class="row items-center q-gutter-sm" role="status">
      <q-spinner color="primary" aria-hidden="true" />
      <span>Проверяем сессию…</span>
    </div>

    <div v-else-if="status === 'error'" class="auth-card">
      <p role="alert">Не удалось проверить сессию. Проверь соединение и попробуй ещё раз.</p>
      <q-btn no-caps outline color="primary" label="Повторить" @click="checkSession()" />
    </div>

    <section v-else class="auth-card" aria-labelledby="auth-title">
      <img src="/icons/favicon-96x96.png" width="48" height="48" alt="" />
      <h1 id="auth-title" class="auth-title">
        {{ isRegistering ? "Регистрация в Архиве" : "Вход в Архив" }}
      </h1>
      <p v-if="formNotice" role="status">{{ formNotice }}</p>

      <q-form :key="String(isRegistering)" class="column q-gutter-y-md" @submit="submitForm">
        <q-input
          v-model="username"
          outlined
          label="Логин"
          name="username"
          autocomplete="username"
          autocapitalize="none"
          :spellcheck="false"
          maxlength="64"
          :disable="isSubmitting"
          :rules="[validateUsername]"
          hide-bottom-space
          lazy-rules
        />
        <q-input
          v-model="password"
          outlined
          label="Пароль"
          name="password"
          :type="isPasswordVisible ? 'text' : 'password'"
          :autocomplete="isRegistering ? 'new-password' : 'current-password'"
          :hint="isRegistering ? 'От 15 до 256 символов' : undefined"
          :disable="isSubmitting"
          :rules="[validatePassword]"
          hide-bottom-space
          lazy-rules
        >
          <template #append>
            <q-btn
              type="button"
              flat
              round
              dense
              :icon="isPasswordVisible ? 'visibility_off' : 'visibility'"
              :aria-label="isPasswordVisible ? 'Скрыть пароль' : 'Показать пароль'"
              :disable="isSubmitting"
              @mousedown.prevent
              @click="isPasswordVisible = !isPasswordVisible"
            />
          </template>
        </q-input>
        <p v-if="formError" class="text-negative q-mb-none" role="alert">{{ formError }}</p>
        <q-btn
          type="submit" unelevated no-caps color="primary"
          :label="isRegistering ? 'Создать аккаунт' : 'Войти'"
          :loading="isSubmitting"
        />
        <q-btn
          type="button" flat no-caps color="primary"
          :label="isRegistering ? 'Вернуться ко входу' : 'Зарегистрироваться'"
          :disable="isSubmitting"
          @click="showRegistration(!isRegistering)"
        />
      </q-form>
    </section>
  </main>
</template>

<style scoped>
.auth-page {
  display: grid;
  place-items: center;
  min-height: 100vh;
  min-height: 100dvh;
  padding: 20px;
  color: var(--text-primary);
  background: var(--surface-page);
}

.auth-card {
  width: min(100%, 400px);
  padding: clamp(20px, 5vw, 32px);
  border: 1px solid var(--border-divider);
  border-radius: 16px;
  background: var(--surface-sidebar);
}

.auth-title {
  margin: 12px 0 24px;
  font: var(--font-accent-weight) 1.5rem/1.3 var(--font-accent);
}
</style>
