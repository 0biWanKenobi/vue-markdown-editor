import parser from './parser';
import { deepAssign } from '@/utils/deep-assign';
import { inBrowser } from '@/utils/util';
import PluginCreatorFn from '@/types/pluginCreatorFn';
import useVMdParser from '@/modules/useVMdParser';
import { Mermaid } from 'mermaid';
import { nextTick, watch } from 'vue';
import useEditor from '@/modules/useEditor';

export default function creator(mermaid: Mermaid) {
  async function handleMdChange() {
    if (!inBrowser) return;

    await nextTick();

    const {
      editor: { previewEl },
    } = useEditor();
    const eles = previewEl.value.querySelectorAll('.v-md-mermaid');

    if (!eles.length) return;

    let parseSuccess = false;
    eles.forEach((ele: any) => {
      try {
        parseSuccess = mermaid.parse(ele.innerText);
      } catch (e) {
        const err = e as any;
        if (!err.str) {
          console.log(e);
        }
      }

      // if (parseSuccess) mermaid.init(null, ele);
      if (parseSuccess) mermaid.init(ele);
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
      install() {
        const vMdParser = useVMdParser();
        vMdParser.use(parser);
        // was on created
        mermaid.initialize(initialize);

        //TODO: investigate how to integrate mermaid plugin into "preview" Vue components
        // const mixin = {
        //   watch: {
        //     html: {
        //       immediate: true,
        //       handler: handleMdChange,
        //     },
        //   },
        // };

        // if (VMdEditor.name === 'v-md-editor') {
        //   VMdEditor.Preview.mixins.push(mixin);
        // } else {
        //   VMdEditor.mixins.push(mixin);
        // }
      },
    };
  };

  return createMermaidPlugin;
}
