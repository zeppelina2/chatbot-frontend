<script setup lang="ts">
withDefaults(
  defineProps<{
    deleteDisabled?: boolean
  }>(),
  {
    deleteDisabled: false,
  },
)

const emit = defineEmits<{
  delete: []
}>()
</script>

<template>
  <q-btn
    flat
    round
    dense
    aria-label="Действия с диалогом"
  >
    <img
      src="/icons/dialogue-sparkle-32.svg"
      width="25"
      height="25"
      alt=""
      aria-hidden="true"
    />

    <q-tooltip>Действия с диалогом</q-tooltip>

    <q-menu
      anchor="bottom right"
      self="top right"
      :offset="[0, 8]"
    >
      <q-list style="min-width: 200px">
        <q-item
          clickable
          v-close-popup
          class="text-negative"
          :disable="deleteDisabled"
          @click="emit('delete')"
        >
          <q-item-section avatar>
            <q-icon name="delete_outline" />
          </q-item-section>

          <q-item-section>
            Удалить диалог
          </q-item-section>
        </q-item>
      </q-list>
    </q-menu>
  </q-btn>
</template>
