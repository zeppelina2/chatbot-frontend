<script setup lang="ts">
type DialogueAction = "delete";

withDefaults(
  defineProps<{
    actions?: readonly DialogueAction[];
    contextMenu?: boolean;
    deleteDisabled?: boolean;
  }>(),
  {
    actions: () => ["delete"] as DialogueAction[],
    contextMenu: false,
    deleteDisabled: false,
  },
);

const emit = defineEmits<{
  delete: [];
}>();
</script>

<template>
  <q-menu
    v-if="actions.length"
    :context-menu="contextMenu"
    :touch-position="contextMenu"
    anchor="bottom right"
    self="top right"
    :offset="contextMenu ? [0, 0] : [0, 8]"
  >
    <q-list role="menu" style="min-width: 200px">
      <q-item
        v-if="actions.includes('delete')"
        role="menuitem"
        clickable
        v-close-popup
        class="text-negative"
        :disable="deleteDisabled"
        @click="emit('delete')"
      >
        <q-item-section avatar>
          <q-icon name="delete_outline" />
        </q-item-section>

        <q-item-section>Удалить диалог</q-item-section>
      </q-item>
    </q-list>
  </q-menu>
</template>
