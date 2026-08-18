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
    >
      <template #append>
        <div class="chat-input__append">
          <q-btn
            round
            flat
            dense
            icon="send"
            :disable="disabled || !message.trim()"
            @click="sendMessage" />
        </div>
      </template>
    </q-input>
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
  width: 100%;
  max-width: 900px;
  margin: 0 auto;

  &__field {
    max-height: 300px;

    :deep(textarea) {
      max-height: 300px;
      overflow-y: auto;
      padding-right: 8px;
    }

    :deep(.q-field__append) {
      align-self: flex-end;
      height: 100%;
      align-items: flex-end;
      padding-bottom: 9px;
    }
  }

  &__append {
    align-self: flex-end;
    margin-bottom: 2px;
  }
}
</style>
