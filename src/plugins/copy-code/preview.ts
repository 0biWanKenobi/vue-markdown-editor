import useEditor from '@/modules/useEditor';
import usePreview from '@/modules/usePreview';
import LifecycleStage from '@/types/lifecycleStage';
import copyToClipboard from 'copy-to-clipboard';
import { nextTick, ref, watch } from 'vue';

const installed = ref(false);

function isCopyButton(el: Element) {
  return el.classList.contains('v-md-copy-code-btn');
}

function findCodeWrapperEl(el: Element): Element | null {
  if (el.classList.contains('v-md-pre-wrapper')) {
    return el;
  }

  return el.parentNode ? findCodeWrapperEl(el.parentNode as Element) : null;
}

function handleCopyCodeClick({ target }: Event, emit: Function) {
  const targetEl = target ? <Element>target : null;

  if (targetEl && isCopyButton(targetEl)) {
    const codeWrapper = targetEl.parentNode && findCodeWrapperEl(targetEl.parentNode as Element);

    if (codeWrapper) {
      const code = codeWrapper.querySelector('code')?.innerText;

      code && copyToClipboard(code);
      emit('copy-code-success', code);
    }
  }
}

export default function createCopyCodePreview() {
  const { emit, setLifeCycleHooks, installEmits } = useEditor();
  const eventListener = (e: Event) => handleCopyCodeClick(e, emit);
  return {
    install() {
      installEmits('copy-code-success');

      const { previewEl } = usePreview();
      const stopHandle = watch(
        () => previewEl.value,
        (el) => {
          if (installed.value) {
            stopHandle();
            return;
          }
          nextTick(() => {
            if (el) {
              installed.value = true;
              el.addEventListener('click', eventListener);
            }
          });
        }
      );

      const beforeUnmount = () => {
        const { previewEl } = usePreview();
        previewEl.value?.$el.removeEventListener('click', eventListener);
      };

      setLifeCycleHooks(LifecycleStage.beforeUnmount, beforeUnmount);
    },
  };
}
