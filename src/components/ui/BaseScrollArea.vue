<template>
  <div
    class="scroll-area"
    @pointerenter="handlePointerEnter"
    @pointerleave="handlePointerLeave"
  >
    <div
      ref="containerRef"
      class="scroll-area__container"
      tabindex="0"
      @scroll="handleScroll"
    >
      <slot></slot>
    </div>

    <OverlayScrollbar
      :has-overflow="hasOverflow"
      :visible="isVisible"
      :thumb-style="thumbStyle"
      @thumb-pointer-down="handleThumbPointerDown"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

import OverlayScrollbar from "@/components/ui/OverlayScrollbar.vue";
import { useOverlayScrollbar } from "@/composables/useOverlayScrollbar";

const emit = defineEmits<{
  scroll: [event: Event];
}>();

const containerRef = ref<HTMLElement | null>(null);

const {
  isVisible,
  hasOverflow,
  thumbStyle,
  handleScroll: updateOverlayScrollbar,
  handlePointerEnter,
  handlePointerLeave,
  handleThumbPointerDown,
} = useOverlayScrollbar(containerRef);

const handleScroll = (event: Event) => {
  updateOverlayScrollbar();
  emit("scroll", event);
};

const getContainer = () => containerRef.value;

defineExpose({
  getContainer,
});
</script>

<style scoped lang="scss">
.scroll-area {
  position: relative;
  min-height: 0;

  &__container {
    width: 100%;
    height: 100%;
    overflow-y: auto;
    scrollbar-width: none;
    -ms-overflow-style: none;

    &::-webkit-scrollbar {
      display: none;
    }

    &:focus {
      outline: none;
    }
  }
}
</style>
