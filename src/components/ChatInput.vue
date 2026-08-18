<template>
  <div class="chat-input">
    <q-input
      v-model="message"
      class="chat-input__field"
      outlined
      autogrow
      placeholder="Напишите сообщение..."
      :disable="disabled"
      @keydown.enter.exact.prevent="sendMessage"
    />

    <q-btn
      class="chat-input__send"
      round
      unelevated
      icon="send"
      :disable="disabled || !message.trim()"
      @click="sendMessage"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

interface Props {
  disabled?: boolean;
}

withDefaults(defineProps<Props>(), {
  disabled: false,
});

const emit = defineEmits<{
  send: [message: string];
}>();

const message = ref("");

const sendMessage = () => {
  const value = message.value.trim();

  if (!value) {
    return;
  }

  emit("send", value);

  message.value = "";
};
</script>

<style scoped lang="scss">
.chat-input {
  display: flex;
  align-items: flex-end;
  gap: 8px;
  width: 100%;
  max-width: 900px;
  margin: 0 auto;

  &__field {
    flex: 1;
    max-height: 300px;

    :deep(textarea) {
      max-height: 300px;
      overflow-y: auto;
    }
  }

  &__send {
    flex-shrink: 0;
    margin-bottom: 8px;
  }
}
</style>
