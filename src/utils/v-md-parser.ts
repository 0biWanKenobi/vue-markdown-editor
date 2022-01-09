import Theme from '@/types/themeType';
import Lang from '@/utils/lang';

export class VMdParser {
  lang: Lang;
  themeConfig?: Theme;

  constructor() {
    this.lang = new Lang();
  }

  defaultMarkdownLoader(text: string) {
    return text;
  }

  use(optionsOrInstall: Function | { install: Function }, opt?: Record<string, any>) {
    if (typeof optionsOrInstall === 'function') {
      optionsOrInstall(this, opt);
    } else {
      optionsOrInstall.install(this, opt);
    }

    return this;
  }

  theme(themeConfig: Theme) {
    this.themeConfig = themeConfig;
  }

  extendMarkdown(extender: Function) {
    if (!this.themeConfig) {
      return console.error('Please use theme before using plugins');
    }

    const { markdownParser } = this.themeConfig;

    extender(markdownParser);
  }

  parse(text: string) {
    if (!this.themeConfig) {
      throw new Error('Please use theme before using plugins');
    }

    const { markdownParser } = this.themeConfig;
    const markdownLoader =
      markdownParser?.render?.bind(markdownParser) || this.defaultMarkdownLoader;

    if (typeof markdownLoader !== 'function' || markdownLoader === this.defaultMarkdownLoader) {
      console.error('Please configure your markdown parser');
    }

    return markdownLoader(text);
  }
}
