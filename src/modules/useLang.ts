import { computed, reactive, ref } from 'vue';
import Lang from '@/utils/lang';
import zhCNConfig from '@/lang/zh-CN';

const lang = ref<Lang>(new Lang());
const add = (val: Record<string, any>) => {
  lang.value.add(val);
};

const use = (name: string, val: Record<string, any>) => {
  lang.value.use(name, val);
};

const langConfig = computed(() => {
  const cfg = lang.value?.config;
  return cfg.langConfig[cfg.lang] ?? cfg.langConfig['zh-CN'];
});

export default () => {
  lang.value = new Lang();
  lang.value.config = reactive(lang.value.config);
  lang.value.add({
    'zh-CN': zhCNConfig,
  });

  return {
    langConfig,
    add,
    use,
  };
};
