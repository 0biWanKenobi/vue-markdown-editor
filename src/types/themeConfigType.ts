import BaseThemeParams from './baseThemeParams';

type ThemeConfig = {
  codeHighlightExtensionMap: Record<string, any>;
  codeBlockClass: (v: string) => string;
  baseConfig: BaseThemeParams;
  Prism: any;
  Hljs: any;
};

export default ThemeConfig;
