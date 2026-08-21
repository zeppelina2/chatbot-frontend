<template>
  <q-list>
    <div class="chat">
      <div class="chat__messages">
        <div v-for="message in messages" :key="message.message_id" class="chat__message" :class="{
          'chat__message--user': message.role === Role.USER,
          'chat__message--assistant': message.role === Role.ASSISTANT,
        }">
          <MessageItem :message="message" />
        </div>
      </div>
    </div>
  </q-list>
</template>

<script setup lang="ts">
import MessageItem from "@/components/MessageItem.vue";
import Role from "@/types/roles";
import MessageType from "@/types/message";

// сделать так, чтобы чат прокручивался автоматом вниз к самому свежему сообщению

const props = defineProps<{
  messages: MessageType[];
}>();
</script>

<style scoped lang="scss">
.chat {
  display: flex;
  justify-content: center;
  height: 100%;

  &__messages {
    display: flex;
    flex-direction: column;
    width: 100%;
    max-width: 900px;
    gap: 30px;
  }

  &__message {
    display: flex;
    width: 100%;

    &--user {
      width: 100%;
      justify-content: flex-end;
    }

    &--assistant {
      justify-content: flex-start;
    }
  }
}
</style>
