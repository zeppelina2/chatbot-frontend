import { nextTick, ref, type Ref } from "vue";

export const useChatScroll = (externalContainerRef?: Ref<HTMLElement | null>) => {
  const internalContainerRef = ref<HTMLElement | null>(null);
  const containerRef = externalContainerRef ?? internalContainerRef;

  const isNearBottom = ref(true);

  const updateScrollPosition = () => {
    const container = containerRef?.value;
    console.log("containerRef", containerRef)

    if (!container) return;

    const distanceToBottom =
      container.scrollHeight -
      container.scrollTop -
      container.clientHeight;

    isNearBottom.value = distanceToBottom < 150;
  };

  const scrollToBottom = async (
    behavior: ScrollBehavior = "auto",
  ) => {
    await nextTick();

    const container = containerRef.value;

    if (!container) return;

    container.scrollTo({
      top: container.scrollHeight,
      behavior,
    });
  };

  const scrollToMessage = async (
    messageId: string,
  ) => {
    await nextTick();

    const element = document.getElementById(
      `message-${messageId}`,
    );

    element?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return {
    containerRef,
    isNearBottom,
    updateScrollPosition,
    scrollToBottom,
    scrollToMessage,
  };
};

