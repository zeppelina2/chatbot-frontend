<template>
  <div class="overflow-tooltip">
    <div
      ref="textRef"
      class="overflow-tooltip__text"
    >
      {{ text }}
    </div>

    <q-tooltip
      v-if="isOverflowing"
      :delay="300"
      max-width="235px"
      class="overflow-tooltip__popup"
    >
      {{ text }}
    </q-tooltip>
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from "vue";

const props = defineProps<{
  text: string;
}>();

const textRef = ref<HTMLElement | null>(null);
const isOverflowing = ref(false);

let resizeObserver: ResizeObserver | null = null;

const checkOverflow = () => {
  const element = textRef.value;

  isOverflowing.value = !!element &&
    element.clientWidth > 0 &&
    element.scrollWidth > element.clientWidth;
};

onMounted(() => {
  resizeObserver = new ResizeObserver(checkOverflow);

  if (textRef.value) {
    resizeObserver.observe(textRef.value);
  }

  checkOverflow();

  // Загруженный шрифт может изменить ширину текста
  void document.fonts.ready.then(checkOverflow);
});

// Название может обновиться без изменения ширины элемента.
// Проверяем после того, как Vue обновит текст в DOM
watch(() => props.text, checkOverflow, { flush: "post" });

onBeforeUnmount(() => {
  resizeObserver?.disconnect();
});
</script>

<style scoped lang="scss">
.overflow-tooltip {
  min-width: 0;
  width: 100%;

  &__text {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &__popup {
    white-space: normal;
    overflow-wrap: anywhere;
  }
}
</style>
