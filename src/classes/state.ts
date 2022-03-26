import IEditor from '@/interfaces/IEditor';
import Preview from './preview';
import { computed, InjectionKey, nextTick, ref, Ref, SetupContext, watch } from 'vue';
import type BaseEditor from './baseEditor';
import { BaseEditorSymbol } from './baseEditor';
import FullScreen from './fullScreen';
import ScrollBar from './scrollBar';
import Hotkeys from '@/utils/hotkeys';
import * as HotkeyList from '@/hotkeys';
import EDITOR_MODE from '@/utils/constants/editor-mode';
import Option from '@/types/OptionType';
import Install from '@/types/installType';
import PluginCreatorParams from '@/types/pluginCreationFnParams';
import { VMdParser } from '@/utils/v-md-parser';
import ToolbarManager from './toolbarManager';
import { ThemeConfigOption } from '@/types/editorConfig';
import SyncScroll from './syncScroll';
import Scroll from './scroll';
import Lifecycle from './lifecycle';
import FileUpload from './fileUpload';
import useCommand from '@/modules/useCommand';
import ImageUpload from './imageUpload';

export const StateSymbol: InjectionKey<Ref<State>> = Symbol('State');

class State {
  text = ref<string | undefined>('');
  readonly parser: VMdParser;
  readonly toolbarManager: ToolbarManager;
  readonly syncScroll: SyncScroll;
  readonly scroll: Scroll;
  private ctx = ref<SetupContext<any>>();

  currentMode = ref(EDITOR_MODE.EDITABLE);
  isPreviewMode = computed(() => this.currentMode.value === EDITOR_MODE.PREVIEW);
  isEditMode = computed(() => this.currentMode.value === EDITOR_MODE.EDIT);
  isEditableMode = computed(() => this.currentMode.value === EDITOR_MODE.EDITABLE);

  tocVisible = ref<boolean>(false);

  fullScreen: FullScreen;
  hotkeysManager = new Hotkeys();

  readonly preview: Preview;
  readonly lifecycle: Lifecycle;
  readonly fileUpload: FileUpload;
  readonly imageUpload: ImageUpload;

  private _editor!: IEditor;

  get editor() {
    return this._editor;
  }

  set editor(e: IEditor) {
    this._editor = e;
    watch(
      () => this.text.value,
      (v) => (this._editor.text.value = v),
      {
        immediate: true,
      }
    );
  }

  private get baseEditor() {
    return this.editor as BaseEditor;
  }

  get textArea() {
    return this.editor.type == BaseEditorSymbol ? this.baseEditor.textArea : undefined;
  }

  private _genericScrollbar!: ScrollBar;

  constructor(ctx: SetupContext<any>) {
    for (const hotKey of Object.values(HotkeyList)) this.hotkeysManager.registerHotkeys(hotKey);
    this.lifecycle = new Lifecycle();
    this.fileUpload = new FileUpload();
    this.imageUpload = new ImageUpload(ctx, this.execCmd);
    this.fullScreen = new FullScreen(ctx, this.lifecycle);
    this.preview = new Preview(this.isPreviewMode);
    this.parser = new VMdParser();
    this.toolbarManager = new ToolbarManager();
    this.syncScroll = new SyncScroll(
      () => this.preview,
      () => this.editor,
      this.getScrollbar.bind(this)
    );
    this.scroll = new Scroll(
      () => this.syncScroll.ignoreSyncScroll.value,
      () => this.isPreviewMode.value,
      () => this.isEditMode.value,
      () => this.editor,
      () => this.preview
    );
    this.ctx.value = ctx;

    this.toolbarManager.addDefaultToolbars();
  }

  emit = (e: string, ...args: any[]) => {
    this.ctx.value?.emit(e, args);
  };

  use(optionsOrInstall: Option | Install, opt?: any) {
    if (typeof optionsOrInstall === 'function') {
      optionsOrInstall(this, opt);
    } else {
      (<Install>optionsOrInstall).install(this, opt);
    }
    return this;
  }

  private execCmd = (cmdName: string, ...params: any[]) => {
    const { execCommand } = useCommand();
    execCommand(cmdName, [this, ...params]);
  };

  installTheme = (configOption: ThemeConfigOption) => {
    configOption.theme.install(this, configOption.config);
  };

  installPlugins = (
    plugins: Array<{
      plugin: Install;
      params?: PluginCreatorParams;
    }>
  ) => {
    for (const pluginConfig of plugins) {
      this.use(pluginConfig.plugin, pluginConfig.params);
    }
  };

  save = () => {
    this.ctx.value?.emit('save', this.text.value, this.preview.html.value);
  };

  toggleToc = (visible = !this.tocVisible.value) => {
    this.tocVisible.value = visible;
  };

  getScrollbar(type: 'editor' | 'preview' | undefined) {
    switch (type) {
      case 'editor':
        return this.baseEditor.scrollBar;

      case 'preview':
        return this.preview.scrollBar;

      default:
        this._genericScrollbar ??= new ScrollBar();
        return this._genericScrollbar;
    }
  }

  insert = (getInsertContent: (v: string | undefined) => { text: string; selected?: string }) => {
    const { getCurrentSelectedStr, replaceSelectionText, changeSelectionTo, focus } = this.editor;

    focus();

    const currentSelectedStr = getCurrentSelectedStr();
    const { selected, text } = getInsertContent(currentSelectedStr);

    replaceSelectionText(text);

    nextTick().then(() => {
      changeSelectionTo(text, selected);
    });
  };

  setFocusEnd = () => {
    this.editor.editorFocusEnd();
    this.editor.editorScrollToTop(9999);
    this.preview.previewScrollTo(9999);
  };
}

export default State;
