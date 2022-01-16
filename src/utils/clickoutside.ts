// Modified from https://github.com/ElemeFE/element/blob/dev/src/utils/clickoutside.js
import { DirectiveTransform } from '@vue/compiler-dom';
import { inBrowser } from '@/utils/util';

const nodeList: Array<any> = [];
const ctx = '@@clickoutsideContext';

let startClick: any;
let seed = 0;

if (inBrowser) {
  document.addEventListener('mousedown', (e) => {
    startClick = e;
  });

  document.addEventListener('mouseup', (e) => {
    nodeList.forEach((node) => node[ctx].documentHandler(e, startClick));
  });
}

function createDocumentHandler(el: any, binding: any, vnode: any) {
  return function (mouseup: { target?: any } = {}, mousedown: { target?: any } = {}) {
    if (
      !vnode ||
      !binding ||
      !binding.instance ||
      !mouseup.target ||
      !mousedown.target ||
      el.contains(mouseup.target) ||
      el.contains(mousedown.target) ||
      el === mouseup.target
    ) {
      return;
    }

    if (binding.arg && el[ctx].methodName && binding.instance[el[ctx].methodName]) {
      binding.instance[el[ctx].methodName]();
    } else {
      el[ctx].bindingFn && el[ctx].bindingFn();
    }
  };
}

export const ssrTransformClickoutside: DirectiveTransform = (_dir, _node, _context) => {
  return {
    // do nothing
    props: [],
  };
};

export default {
  beforeMount(el: any, binding: any, vnode: any) {
    nodeList.push(el);
    const id = seed++;
    el[ctx] = {
      id,
      documentHandler: createDocumentHandler(el, binding, vnode),
      methodName: binding.arg,
      bindingFn: binding.value,
    };
  },

  updated(el: any, binding: any, vnode: any) {
    el[ctx].documentHandler = createDocumentHandler(el, binding, vnode);
    el[ctx].methodName = binding.arg;
    el[ctx].bindingFn = binding.value;
  },

  unmounted(el: any) {
    const len = nodeList.length;

    for (let i = 0; i < len; i++) {
      if (nodeList[i][ctx].id === el[ctx].id) {
        nodeList.splice(i, 1);
        break;
      }
    }
    delete el[ctx];
  },
};
