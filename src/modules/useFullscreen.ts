import LifecycleStage from '@/types/lifecycleStage';
import { ref, SetupContext, watch } from 'vue';
import useEditor from './useEditor';

const fullscreen = ref(false);

const toggleFullScreen = (value = !fullscreen.value) => {
  fullscreen.value = value;
  const { 0: html, 1: body }: Record<number, HTMLElement> = document.querySelectorAll('html, body');
  const overflow = fullscreen.value ? 'hidden' : 'visible';

  body.style.overflow = overflow;
  html.style.overflow = overflow;
};

const _handleWindowKeyup = (e: KeyboardEvent) => {
  const key = e.key || e.keyCode;
  if ((key === 'Escape' || key === 27) && fullscreen.value) {
    toggleFullScreen(false);
  }
};

const _onMounted = () => {
  window.addEventListener('keyup', _handleWindowKeyup, false);

  if (fullscreen.value) {
    toggleFullScreen();
  }
};

const _onBeforeUnmount = () => {
  window.removeEventListener('keyup', _handleWindowKeyup, false);
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
    setLifeCycleHooks(LifecycleStage.mounted, _onMounted);
    setLifeCycleHooks(LifecycleStage.beforeUnmount, _onBeforeUnmount);
  }

  watch(
    () => fullscreen.value,
    () => ctx?.emit('fullscreen-change', fullscreen.value)
  );

  return {
    fullscreen,
  };
};
