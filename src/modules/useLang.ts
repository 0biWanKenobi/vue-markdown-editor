import { computed, reactive, ref } from 'vue';
import Lang from '@/utils/lang';
import zhCNConfig from '@/lang/zh-CN';

const lang = ref<Lang>(new Lang());
const configured = ref(false);

/**
 * Adds a new language, without using it for the UI
 * @param val the language configuration
 */
const add = (val: Record<string, any>) => {
  lang.value.add(val);
};

/**
 * Sets a language active by its name. The language has to be already installed.
 * @param name the language name
 */
const select = (name: string) => {
  lang.value.select(name);
};

/**
 * Adds a new language and uses it for the UI
 * @param name the language name
 * @param val the language configuration
 */
const use = (name: string, val: Record<string, any>) => {
  lang.value.use(name, val);
};

const langConfig = computed(() => {
  const cfg = lang.value?.config;
  return cfg.langConfig[cfg.lang] ?? cfg.langConfig['zh-CN'];
});

export default () => {
  if (!configured.value) lang.value.config = reactive(lang.value.config);
  if (!lang.value) {
    lang.value = new Lang();
    lang.value.add({
      'zh-CN': zhCNConfig,
    });
  }

  return {
    langConfig,
    add,
    select,
    use,
  };
};
