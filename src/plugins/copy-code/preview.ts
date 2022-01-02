import useEditor from '@/modules/useEditor';
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

function getPreviewEl(el: Element) {
  const previewElClass = 'v-md-editor-preview';

  return el.classList.contains(previewElClass) ? el : el.querySelector(`.${previewElClass}`);
}

function handleCopyCodeClick({ target }: Event) {
  const targetEl = target ? <Element>target : null;

  if (targetEl && isCopyButton(targetEl)) {
    const codeWrapper = targetEl.parentNode && findCodeWrapperEl(targetEl.parentNode as Element);

    if (codeWrapper) {
      const code = codeWrapper.querySelector('code')?.innerText;

      code && copyToClipboard(code);
      // this.$emit('copy-code-success', code);
    }
  }
}

export default function createCopyCodePreview() {
  return {
    install() {
      const { editor: VMdEditor } = useEditor();

      const stopHandle = watch(
        () => VMdEditor.previewEl,
        (el) => {
          if (installed.value) {
            stopHandle();
            return;
          }
          nextTick(() => {
            if (el.value) {
              installed.value = true;
              el.value.addEventListener('click', handleCopyCodeClick);
            }
          });
        }
      );

      // VMdEditor.mixins.push({
      //   emits: ['copy-code-success'],

      //   beforeUnmount() {
      //     const previewEl = getPreviewEl(this.$el);

      //     previewEl.removeEventListener('click', this.handleCopyCodeClick);
      //   },
      // });
    },
  };
}
