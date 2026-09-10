<template>
  <div class="chat-input">
    <q-input
      v-model="message"
      class="chat-input__field"
      outlined
      rounded
      autogrow
      hide-bottom-space
      color="accent"
      placeholder="Спросите Магнуса об Ойкумене…"
      aria-label="Сообщение для Магнуса"
      :disable="disabled"
      @keydown.enter.exact.prevent="sendMessage"
    >
      <template #append>
      <q-btn
        class="chat-input__send"
        round
        unelevated
        color="primary"
        icon="arrow_upward"
        aria-label="Отправить сообщение"
        :disable="disabled || !message.trim()"
        @click="sendMessage"
      />
    </template>
  </q-input>

    <div class="chat-input__caption">
      Ответы основаны на хрониках Академии
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

interface Props {
  disabled?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
});

const emit = defineEmits<{
  send: [message: string];
}>();

const message = ref("");

const sendMessage = () => {
  const value = message.value.trim();

  if (!value || props.disabled) {
    return;
  }

  emit("send", value);
  message.value = "";
};
</script>

<style scoped lang="scss">
.chat-input {
  width: 100%;
  max-width: 780px;
  margin: 0 auto;

  &__field {
    max-height: 300px;

    :deep(.q-field__control) {
      min-height: 56px;
      padding: 4px 8px 4px 18px;
      border-radius: 16px;
      background-color: var(--surface-input);
      box-shadow: var(--shadow-input);
      transition:
        border-color 0.2s ease,
        box-shadow 0.2s ease;
    }

    :deep(.q-field__control::before) {
      border-color: var(--border-primary);
    }

    :deep(.q-field__control:hover::before) {
      border-color: var(--border-hover);
    }

    :deep(.q-field--focused .q-field__control) {
      box-shadow: var(--shadow-input-focus);
    }

    :deep(.q-field--focused .q-field__control::after) {
      border-width: 1px;
    }

    :deep(.q-field__native) {
      min-height: 46px;
      padding: 12px 8px 10px 0;
      color: var(--text-primary);
      line-height: 1.5;
    }

    :deep(.q-field__native::placeholder) {
      color: var(--text-muted);
      opacity: 1;
    }

    :deep(textarea) {
      max-height: 260px;
      overflow-y: auto;
      resize: none;
    }

    :deep(.q-field__append) {
      align-self: flex-end;
      height: auto;
      padding: 5px 0;
    }

    :deep(.q-field--disabled) {
      opacity: 0.65;
    }
  }

  &__send {
    width: 40px;
    height: 40px;
    min-height: 40px;
    margin-left: 6px;

    :deep(.q-icon) {
      font-size: 20px;
    }
  }

  &__caption {
    margin-top: 7px;
    color: var(--text-muted);
    font-size: 12px;
    text-align: center;
  }
}
</style>
