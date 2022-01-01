import { deepAssign } from '@/utils/deep-assign';

type LangConfig = {
  [x: string]: Record<string, any>;
};

export default class Lang {
  config: {
    lang: string;
    langConfig: LangConfig;
  };

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

  add(config = {}) {
    deepAssign(this.config.langConfig, config);
  }
}
