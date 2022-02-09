import LifecycleStage from '@/types/lifecycleStage';
import { ref, SetupContext, watch } from 'vue';
import useEditor from './useEditor';

const fullscreen = ref(false);

const handleWindowKeyup = (e: KeyboardEvent) => {
  const key = e.key || e.keyCode;
  if ((key === 'Escape' || key === 27) && fullscreen.value) {
    toggleFullScreen(false);
  }
};

const toggleFullScreen = (value = !fullscreen.value) => {
  fullscreen.value = value;
  const { 0: html, 1: body }: Record<number, HTMLElement> = document.querySelectorAll('html, body');
  const overflow = fullscreen.value ? 'hidden' : 'visible';

  body.style.overflow = overflow;
  html.style.overflow = overflow;
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

const areHooksSaved = ref(false);

export default (
  ctx?: SetupContext<string[]> | SetupContext<Record<string, any>>,
  defaults?: { fullscreen: boolean }
) => {
  if (defaults) fullscreen.value = defaults.fullscreen;
  if (!areHooksSaved.value) {
    areHooksSaved.value = true;
    const { setLifeCycleHooks } = useEditor();
    setLifeCycleHooks(LifecycleStage.mounted, onMounted);
    setLifeCycleHooks(LifecycleStage.beforeUnmount, onBeforeUnmount);
  }

  watch(
    () => fullscreen.value,
    () => ctx?.emit('fullscreen-change', fullscreen.value)
  );

  return {
    fullscreen,
    handleWindowKeyup,
    toggleFullScreen,
  };
};
