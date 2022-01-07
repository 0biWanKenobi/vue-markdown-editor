type ThemeConfig = {
  codeHighlightExtensionMap: Record<string, any>;
  codeBlockClass?: (v: string) => string;
  baseConfig: any;
  Prism?: any;
  Hljs?: any;
};

export default ThemeConfig;
