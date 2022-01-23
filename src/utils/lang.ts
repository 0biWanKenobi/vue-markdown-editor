import LangClassConfig from '@/types/langClassConfig';
import LangConfig from '@/types/langConfig';
import { deepAssign } from '@/utils/deep-assign';

export default class Lang {
  config: LangClassConfig;

  options: {
    afterUse?: (name: string, config: LangConfig) => void;
  };

  constructor(options = {}) {
    this.config = {
      lang: 'zh-CN',
      langConfig: {
        'zh-CN': {},
      },
    };

    this.options = options;
  }

  use(lang: string, config: LangConfig) {
    this.config.lang = lang;
    this.add({ [lang]: config });

    if (this.options.afterUse) this.options.afterUse(lang, config);
  }

  select(lang: string) {
    if (!(lang in this.config.langConfig)) {
      console.error(`The "${lang}" language has not been added yet!`);
      return;
    }
    this.config.lang = lang;
    if (this.options.afterUse) this.options.afterUse(lang, this.config.langConfig);
  }

  add(config: LangConfig = {}) {
    deepAssign(this.config.langConfig, config);
  }
}
