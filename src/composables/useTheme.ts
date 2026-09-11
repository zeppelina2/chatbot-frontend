import { computed } from "vue";
import {
  LocalStorage,
  setCssVar,
  useQuasar,
} from "quasar";

const THEME_STORAGE_KEY = "magnus-dark-theme";

// изменяет встроенные переменные Quasar: --q-primary, --q-secondary, --q-accent
const setQuasarPalette = (dark: boolean) => {
  setCssVar("primary", dark ? "#dc9554" : "#c87538");
  setCssVar("secondary", dark ? "#2a2739" : "#eeeade");
  setCssVar("accent", dark ? "#c9a7d7" : "#51375f");
};

export const useTheme = () => {
  const $q = useQuasar();

  const isDark = computed({
    get: () => $q.dark.isActive,

    set: (value: boolean) => {
      $q.dark.set(value);
      setQuasarPalette(value);

      LocalStorage.set(THEME_STORAGE_KEY, value);
    },
  });

  const initializeTheme = () => {
    const savedTheme =
      LocalStorage.getItem<boolean>(THEME_STORAGE_KEY);

    const dark =
      savedTheme ??
      window.matchMedia("(prefers-color-scheme: dark)").matches;

    $q.dark.set(dark);
    setQuasarPalette(dark);
  };

  return {
    isDark,
    initializeTheme,
  };
};
