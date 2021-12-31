import { ref, watch } from 'vue';

const fullscreen = ref(false);

const handleWindowKeyup = (e: KeyboardEvent) => {
  if ((e.keyCode === 27 || e.key === 'Escape') && fullscreen.value) {
    toggleFullScreen(false);
  }
};

const toggleFullScreen = (value = !fullscreen.value) => {
  fullscreen.value = value;
  const { 0: html, 1: body }: Record<number, HTMLElement> = document.querySelectorAll('html, body');
  const overflow = fullscreen.value ? 'hidden' : null;

  body.style.overflow = overflow;
  html.style.overflow = overflow;
};

const addWatches = (emit: (e: string, ...args: any[]) => void) => {
  watch(
    () => fullscreen.value,
    () => emit('fullscreen-change', fullscreen.value)
  );
};

const onMounted = () => {
  window.addEventListener('keyup', handleWindowKeyup, false);

  if (fullscreen.value) {
    toggleFullScreen();
  }
};

const onBeforeUnmount = () => {
  window.removeEventListener('keyup', handleWindowKeyup, false);
};

export default (defaults?: { fullscreen: boolean }) => {
  if (defaults) fullscreen.value = defaults.fullscreen;
  return {
    fullscreen,
    handleWindowKeyup,
    toggleFullScreen,
    addWatches,
    onMounted,
    onBeforeUnmount,
  };
};
