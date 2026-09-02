import {
  computed,
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  type Ref,
} from "vue";

const MIN_THUMB_HEIGHT = 32;
const HIDE_DELAY = 1000;

export const useOverlayScrollbar = (
  containerRef: Ref<HTMLElement | null>,
) => {
  const isVisible = ref(false);
  const hasOverflow = ref(false);
  const thumbHeight = ref(0);
  const thumbTop = ref(0);

  let isPointerInside = false;
  let isDragging = false;
  let dragStartY = 0;
  let dragStartScrollTop = 0;

  let hideTimer: ReturnType<typeof setTimeout> | undefined;
  let resizeObserver: ResizeObserver | undefined;
  let mutationObserver: MutationObserver | undefined;
  let animationFrameId: number | undefined;

  const clearHideTimer = () => {
    if (hideTimer) {
      clearTimeout(hideTimer);
      hideTimer = undefined;
    }
  };

  const updateThumb = () => {
    const container = containerRef.value;

    if (!container) {
      return;
    }

    const { clientHeight, scrollHeight, scrollTop } = container;

    hasOverflow.value = scrollHeight > clientHeight;

    if (!hasOverflow.value) {
      isVisible.value = false;
      return;
    }

    const calculatedHeight = (clientHeight / scrollHeight) * clientHeight;

    thumbHeight.value = Math.max(
      calculatedHeight,
      MIN_THUMB_HEIGHT,
    );

    const maxThumbTop = clientHeight - thumbHeight.value;
    const maxScrollTop = scrollHeight - clientHeight;

    thumbTop.value = maxScrollTop
      ? (scrollTop / maxScrollTop) * maxThumbTop
      : 0;
  };

  const requestThumbUpdate = () => {
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
    }

    animationFrameId = requestAnimationFrame(updateThumb);
  };

  const hideScrollbarLater = () => {
    clearHideTimer();

    hideTimer = setTimeout(() => {
      if (!isPointerInside && !isDragging) {
        isVisible.value = false;
      }
    }, HIDE_DELAY);
  };

  const showScrollbar = () => {
    updateThumb();

    if (!hasOverflow.value) {
      return;
    }

    clearHideTimer();
    isVisible.value = true;
  };

  const handleScroll = () => {
    showScrollbar();

    if (!isPointerInside) {
      hideScrollbarLater();
    }
  };

  const handlePointerEnter = () => {
    isPointerInside = true;
    showScrollbar();
  };

  const handlePointerLeave = () => {
    isPointerInside = false;
    hideScrollbarLater();
  };

  const handleThumbPointerDown = (event: PointerEvent) => {
    const container = containerRef.value;

    if (!container) {
      return;
    }

    event.preventDefault();

    isDragging = true;
    dragStartY = event.clientY;
    dragStartScrollTop = container.scrollTop;

    showScrollbar();

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);
  };

  const handlePointerMove = (event: PointerEvent) => {
    const container = containerRef.value;

    if (!container || !isDragging) {
      return;
    }

    const availableThumbSpace =
      container.clientHeight - thumbHeight.value;

    const availableScrollSpace =
      container.scrollHeight - container.clientHeight;

    if (availableThumbSpace <= 0) {
      return;
    }

    const pointerOffset = event.clientY - dragStartY;
    const scrollOffset =
      (pointerOffset / availableThumbSpace) *
      availableScrollSpace;

    container.scrollTop = dragStartScrollTop + scrollOffset;
  };

  const handlePointerUp = () => {
    isDragging = false;

    window.removeEventListener("pointermove", handlePointerMove);
    window.removeEventListener("pointerup", handlePointerUp);

    if (!isPointerInside) {
      hideScrollbarLater();
    }
  };

  const thumbStyle = computed(() => ({
    height: `${thumbHeight.value}px`,
    transform: `translateY(${thumbTop.value}px)`,
  }));

  onMounted(async () => {
    await nextTick();

    const container = containerRef.value;

    if (!container) {
      return;
    }

    resizeObserver = new ResizeObserver(requestThumbUpdate);
    resizeObserver.observe(container);

    mutationObserver = new MutationObserver(requestThumbUpdate);
    mutationObserver.observe(container, {
      childList: true,
      subtree: true,
      characterData: true,
    });

    updateThumb();
  });

  onBeforeUnmount(() => {
    clearHideTimer();

    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
    }

    resizeObserver?.disconnect();
    mutationObserver?.disconnect();

    window.removeEventListener("pointermove", handlePointerMove);
    window.removeEventListener("pointerup", handlePointerUp);
  });

  return {
    isVisible,
    hasOverflow,
    thumbStyle,
    handleScroll,
    handlePointerEnter,
    handlePointerLeave,
    handleThumbPointerDown,
  };
};
