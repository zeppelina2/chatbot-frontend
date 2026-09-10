<template>
  <!-- Сообщение пользователя -->
  <q-item v-if="message.role === Role.USER" class="message-item message-item--user">
    <q-item-section class="message-item__content message-item__content--user">
      <div class="message-item__user-message">
        {{ message.content }}
      </div>
    </q-item-section>
  </q-item>

  <!-- Сообщение Магнуса -->
  <q-item v-else-if="message.role === Role.ASSISTANT" class="message-item message-item--assistant">
    <q-item-section class="message-item__content">
      <q-item-section avatar top class="message-item__avatar-section-wr">
        <div class="message-item__avatar-section">
          <q-avatar class="message-item__avatar" aria-hidden="true">
            <img src="/icons/dialogue-sparkle-32_white.svg" width="25" height="25" alt="magnus-star-avatar"
              aria-hidden="true" />
          </q-avatar>
        </div>

        <div class="message-item__author">
          Магнус Фортий Ирриматис
        </div>
      </q-item-section>

      <q-item-section class="message-item__assistant-message markdown-body"
        v-html="renderMarkdown(message.content)"></q-item-section>
    </q-item-section>
  </q-item>
</template>

<script setup lang="ts">
import MarkdownIt from "markdown-it";

import Role from "@/types/roles";
import type MessageType from "@/types/message";

defineProps<{
  message: MessageType;
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
.message-item {
  width: 100%;
  min-height: auto;
  padding: 0;

  &--user {
    justify-content: flex-end;
  }

  &__content {
    min-width: 0;

    &--user {
      align-items: flex-end;
    }
  }

  &__user-message {
    max-width: 70%;
    padding: 10px 16px;
    border-radius: 18px 18px 4px 18px;
    color: var(--message-user-text);
    background-color: var(--message-user-background);
    line-height: 1.5;
    white-space: pre-wrap;
    overflow-wrap: anywhere;
  }

  &__avatar-section-wr {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 10px;
    padding-right: 12px;
    margin-bottom: 10px;
  }

  &__avatar {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 32px;
    height: 32px;
    color: var(--avatar-text);
    background-color: var(--avatar-background);
    box-shadow: var(--avatar-shadow);

    :deep(.q-icon) {
      font-size: 17px;
    }

    :deep(.q-avatar__content) {
      display: block;
      width: 25px;
      height: 25px;
    }
  }

  &__author {
    font-family: var(--font-accent);
    color: var(--text-accent);
    font-size: 16px;
    font-weight: var(--font-accent-weight);
  }

  &__assistant-message {
    color: var(--text-primary);
    line-height: 1.65;
    overflow-wrap: anywhere;
  }
}

// Markdown-разметка ответа Магнуса
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
    color: var(--text-primary);
    font-family: var(--font-accent);
    font-weight: var(--font-bold-weight);
    line-height: 1.3;
  }

  :deep(h1:first-child),
  :deep(h2:first-child),
  :deep(h3:first-child),
  :deep(h4:first-child) {
    margin-top: 0;
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

  :deep(ul),
  :deep(ol) {
    margin: 10px 0;
    padding-left: 24px;
  }

  :deep(li) {
    margin-bottom: 5px;
  }

  :deep(li:last-child) {
    margin-bottom: 0;
  }

  :deep(blockquote) {
    margin: 14px 0;
    padding: 10px 14px;
    border-left: 3px solid var(--q-primary);
    color: var(--text-secondary);
    background-color: var(--markdown-quote-background);
  }

  :deep(code) {
    padding: 2px 5px;
    border-radius: 4px;
    color: var(--text-primary);
    background-color: var(--markdown-code-background);
    font-family: monospace;
    font-size: 0.9em;
  }

  :deep(pre) {
    margin: 14px 0;
    padding: 16px;
    border-radius: 10px;
    background-color: var(--markdown-pre-background);
    overflow-x: auto;
  }

  :deep(pre code) {
    padding: 0;
    background-color: transparent;
  }

  :deep(a) {
    color: var(--q-primary);
    font-weight: 500;
    text-decoration: none;
  }

  :deep(a:hover) {
    text-decoration: underline;
  }

  :deep(hr) {
    margin: 20px 0;
    border: 0;
    border-top: 1px solid var(--border-divider);
  }

  :deep(table) {
    display: block;
    width: 100%;
    margin: 14px 0;
    border-collapse: collapse;
    overflow-x: auto;
  }

  :deep(th),
  :deep(td) {
    padding: 8px 12px;
    border: 1px solid var(--markdown-table-border);
    text-align: left;
  }

  :deep(th) {
    color: var(--text-primary);
    background-color: var(--markdown-table-header);
    font-weight: var(--font-bold-weight);
  }

  @media (max-width: 600px) {
    :deep(h1) {
      font-size: 21px;
    }

    :deep(h2) {
      font-size: 19px;
    }

    :deep(pre) {
      padding: 12px;
    }
  }
}

@media (max-width: 600px) {
  .message-item {
    &__user-message {
      max-width: 85%;
    }

    &__avatar-section_wr {
      padding-right: 9px;
    }
  }
}
</style>
