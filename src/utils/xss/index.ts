import { getDefaultWhiteList, escapeAttrValue, FilterXSS, IFilterXSSOptions } from 'xss';
import svgTagWhiteList from './svg';
import kaTexWhiteList from './KaTex';
import { attrWhiteList, prefixAttrWhiteList, tags } from './common';

const tagWhiteList = { ...tags, ...kaTexWhiteList, ...svgTagWhiteList };

const options: IFilterXSSOptions = {
  whiteList: {
    ...getDefaultWhiteList(),
    ...tagWhiteList,
  },
  onIgnoreTagAttr(tag: string, name: string, value: string) {
    if (
      svgTagWhiteList[tag] ||
      kaTexWhiteList[tag] ||
      attrWhiteList.find((attr) => attr === name) ||
      prefixAttrWhiteList.find((prefix) => name.startsWith(prefix))
    ) {
      return `${name}="${escapeAttrValue(value)}"`;
    }
  },
};

type FilterXSSExt = FilterXSS & {
  extend: (options: any) => void;
  options: IFilterXSSOptions;
};
const xssFilterInstance = new FilterXSS(options) as FilterXSSExt;

type FilterXSSOptName = keyof IFilterXSSOptions;

xssFilterInstance.extend = function (extendOptions: IFilterXSSOptions) {
  const instanceOptions = xssFilterInstance.options;

  Object.keys(extendOptions).forEach((optionName) => {
    // extend whiteList
    if (optionName === 'whiteList' && extendOptions.whiteList) {
      Object.keys(extendOptions.whiteList).forEach((tagName) => {
        const tagAttrWhiteList = extendOptions.whiteList![tagName];
        const instanceWhiteList = instanceOptions.whiteList;

        if (instanceWhiteList![tagName]) {
          instanceWhiteList![tagName] = [...instanceWhiteList![tagName]!, ...tagAttrWhiteList!];
        } else if (instanceWhiteList) {
          instanceWhiteList[tagName] = tagAttrWhiteList;
        }
      });
    } else if (optionName === 'onIgnoreTagAttr') {
      const oldHandler = instanceOptions.onIgnoreTagAttr;
      instanceOptions.onIgnoreTagAttr = function (...arg) {
        const oldReturnVal = oldHandler?.call(this, ...arg);
        const newReturnVal = extendOptions.onIgnoreTagAttr?.call(this, ...arg);

        return oldReturnVal || newReturnVal;
      };
    } else {
      const optName = optionName as FilterXSSOptName;
      (<Record<string, any>>instanceOptions)[optionName] = extendOptions[optName];
    }
  });
};

export default xssFilterInstance;
