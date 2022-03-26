import parser from './parser';
import { deepAssign } from '@/utils/deep-assign';
import { inBrowser } from '@/utils/util';
import PluginCreatorFn from '@/types/pluginCreatorFn';
import { Mermaid } from 'mermaid';
import { nextTick, watch } from 'vue';
import type State from '@/classes/state';

export default function creator(mermaid: Mermaid | undefined) {
  async function handleMdChange(state: State) {
    if (!inBrowser) return;

    await nextTick();

    const { previewEl } = state.preview;
    const eles = previewEl.value?.querySelectorAll('.v-md-mermaid');

    if (!eles?.length) return;

    let parseSuccess = false;
    eles.forEach((ele: any) => {
      try {
        parseSuccess = mermaid!.parse(ele.innerText);
      } catch (e) {
        const err = e as any;
        if (!err.str) {
          console.log(e);
        }
      }

      // if (parseSuccess) mermaid.init(null, ele);
      if (parseSuccess) mermaid!.init(ele);
    });
  }

  const createMermaidPlugin: PluginCreatorFn = ({ mermaidInitializeOptions = {} } = {}) => {
    const initialize = {
      altFontFamily: 'sans-serif',
      flowchart: {
        htmlLabels: true,
        useMaxWidth: true,
      },
      fontFamily: 'sans-serif',
      gantt: {
        leftPadding: 75,
        rightPadding: 20,
      },
      securityLevel: 'loose',
      sequence: {
        boxMargin: 8,
        diagramMarginX: 8,
        diagramMarginY: 8,
        useMaxWidth: true,
      },
      startOnLoad: false,
    };

    deepAssign(initialize, mermaidInitializeOptions);

    return {
      install(state) {
        state.parser.use(parser);
        // was on created
        mermaid!.initialize(initialize);
        const { html } = state.preview;
        watch(
          () => html.value,
          (_) => handleMdChange(state),
          { immediate: true }
        );
      },
    };
  };

  return createMermaidPlugin;
}
