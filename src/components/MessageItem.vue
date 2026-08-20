<template>
  <q-item
    v-if="message.role === Role.USER"
    class="chat__user-item"
  >
    <!-- Сообщение пользователя -->
    <div
      class="chat__user-message"
    >
      {{ message.content }}
    </div>
  </q-item>
  <q-item
    v-else-if="message.role === Role.ASSISTANT"
    class="chat__item"
  >
    <!-- Сообщение ассистента -->
    <div
      class="chat__assistant-message markdown-body"
      v-html="renderMarkdown(message.content)"
    >
    </div>
  </q-item>
</template>

<script setup lang="ts">
import MarkdownIt from "markdown-it";

import Role from "@/types/roles";
import Message from "@/types/message";

const props = defineProps<{
  message: Message;
}>();

const markdown = new MarkdownIt({
  html: false,
  breaks: true,
  linkify: true,
});

const renderMarkdown = (content: string) => {
  return markdown.render(content);
};
</script>

<style scoped lang="scss">
.chat {
  &__item {
    padding: 0;
  }
  &__user-item {
    padding: 0;
    justify-content: flex-end;
    max-width: 70%;
  }
  &__user-message {
    padding: 10px 16px;
    border-radius: 18px 18px 4px 18px;
    background: #1976d2;
    color: white;
    white-space: pre-wrap;
    overflow-wrap: anywhere;
  }

  &__assistant-message {
    color: #1f1f1f;
    overflow-wrap: anywhere;
  }
}

.markdown-body {
  :deep(p) {
    margin: 0 0 12px;
  }

  :deep(p:last-child) {
    margin-bottom: 0;
  }

  :deep(h1),
  :deep(h2),
  :deep(h3),
  :deep(h4) {
    margin-top: 20px;
    margin-bottom: 12px;
    line-height: 1.3;
    font-weight: 600;
  }

  :deep(h1) {
    font-size: 24px;
  }

  :deep(h2) {
    font-size: 20px;
  }

  :deep(h3) {
    font-size: 18px;
  }

  :deep(h4) {
    font-size: 16px;
  }

  :deep(h1:first-child),
  :deep(h2:first-child),
  :deep(h3:first-child),
  :deep(h4:first-child) {
    margin-top: 0;
  }

  :deep(ul),
  :deep(ol) {
    margin: 8px 0;
    padding-left: 24px;
  }

  :deep(li) {
    margin-bottom: 4px;
  }

  :deep(blockquote) {
    margin: 12px 0;
    padding-left: 16px;
    border-left: 3px solid #bdbdbd;
    color: #616161;
  }

  :deep(code) {
    padding: 2px 5px;
    border-radius: 4px;
    background: #f1f1f1;
    font-family: monospace;
    font-size: 0.9em;
  }

  :deep(pre) {
    margin: 12px 0;
    padding: 16px;
    border-radius: 8px;
    background: #f5f5f5;
    overflow-x: auto;
  }

  :deep(pre code) {
    padding: 0;
    background: transparent;
  }

  :deep(a) {
    color: #1976d2;
    text-decoration: none;
  }

  :deep(a:hover) {
    text-decoration: underline;
  }

  :deep(hr) {
    margin: 16px 0;
    border: 0;
    border-top: 1px solid #e0e0e0;
  }

  :deep(table) {
    width: 100%;
    margin: 12px 0;
    border-collapse: collapse;
  }

  :deep(th),
  :deep(td) {
    padding: 8px 12px;
    border: 1px solid #ddd;
    text-align: left;
  }

  :deep(th) {
    font-weight: 600;
    background: #f5f5f5;
  }
}
</style>
