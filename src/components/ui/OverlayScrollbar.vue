<template>
  <div
    v-if="hasOverflow"
    class="overlay-scrollbar"
    :class="{ 'overlay-scrollbar--visible': visible }"
    aria-hidden="true"
  >
    <div
      class="overlay-scrollbar__thumb"
      :style="thumbStyle"
      @pointerdown="handlePointerDown"
    ></div>
  </div>
</template>

<script setup lang="ts">
import type { CSSProperties } from "vue";

interface Props {
  hasOverflow: boolean;
  visible: boolean;
  thumbStyle: CSSProperties;
}

defineProps<Props>();

const emit = defineEmits<{
  thumbPointerDown: [event: PointerEvent];
}>();

const handlePointerDown = (event: PointerEvent) => {
  emit("thumbPointerDown", event);
};
</script>

<style scoped lang="scss">
.overlay-scrollbar {
  position: absolute;
  z-index: 2;
  top: 0;
  right: 2px;
  bottom: 0;
  width: 10px;
  opacity: 0;
  pointer-events: none;
  transition: opacity 200ms ease;

  &--visible {
    opacity: 1;
    pointer-events: auto;
  }

  &__thumb {
    position: absolute;
    top: 0;
    right: 1px;
    width: 6px;
    min-height: 32px;
    border-radius: 999px;
    background-color: rgba(80, 80, 80, 0.35);
    cursor: grab;
    touch-action: none;

    &:hover {
      background-color: rgba(80, 80, 80, 0.5);
    }

    &:active {
      cursor: grabbing;
      background-color: rgba(80, 80, 80, 0.6);
    }
  }
}
</style>
