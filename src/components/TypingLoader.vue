<template>
  <div class="typing-loader" aria-label="Генерация ответа">
    <span class="typing-loader__dot"></span>
    <span class="typing-loader__dot"></span>
    <span class="typing-loader__dot"></span>
  </div>
</template>

<style scoped lang="scss">
.typing-loader {
  display: flex;
  align-items: center;
  gap: 6px;
  height: 24px;

  &__dot {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background-color: currentColor;
    animation: wave 1.2s ease-in-out infinite;

    &:nth-child(2) {
      animation-delay: 0.15s;
    }

    &:nth-child(3) {
      animation-delay: 0.3s;
    }
  }
}

@keyframes wave {
  0%,
  60%,
  100% {
    transform: translateY(0);
  }

  30% {
    transform: translateY(-7px);
  }
}
</style>
