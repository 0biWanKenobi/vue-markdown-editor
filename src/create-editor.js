import Lang from '@/utils/lang';
import zhCNConfig from '@/lang/zh-CN';
import { reactive } from 'vue';

import { commandWrapper } from '@/utils/command';
import { toolbarWrapper } from '@/utils/toolbar';

// mixins
import commonMixin from '@/modules/common';
import vModelMixin from '@/modules/v-model';
import fullscreenMixin from '@/modules/fullscreen';
import uploadImageMixin from '@/modules/upload-image';
import syncScrollMixin from '@/modules/sync-scroll';
import toolbarMixin from '@/modules/toolbar';
import commandMixin from '@/modules/command';
import tocMixin from '@/modules/toc';
import scrollMixin from '@/modules/scroll';
import hotkeysMixin from '@/modules/hotkeys';
import listMixin from '@/modules/list';
import langMixin from '@/modules/lang';

import Preview from '@/preview';

const lang = new Lang({
  afterUse(lang) {
    Preview.vMdParser.lang.config.lang = lang;
  },
});
lang.config = reactive(lang.config);
lang.add({
  'zh-CN': zhCNConfig,
});

export default function createEditor(component) {
  commandWrapper(component);
  toolbarWrapper(component);

  component.name = 'v-md-editor';
  component.lang = lang;
  component.vMdParser = Preview.vMdParser;
  component.Preview = Preview;
  component.hotkeys = [];
  component.hotkey = function (config) {
    component.hotkeys.push(config);
  };
  component.mixins = [
    commonMixin,
    vModelMixin,
    toolbarMixin(component),
    commandMixin(component),
    hotkeysMixin(component),
    fullscreenMixin,
    uploadImageMixin,
    syncScrollMixin,
    tocMixin,
    scrollMixin,
    listMixin,
    langMixin,
  ];
}
