import useLang from '@/modules/useLang';

export { default as DE } from './de-DE';
export { default as US } from './en-US';
export { default as ES } from './es-ES';
export { default as FR } from './fr-FR';
export { default as KR } from './ko-KR';
export { default as PL } from './pl-PL';
export { default as RU } from './ru-RU';
export { default as CN } from './zh-CN';
export { default as TW } from './zh-TW';

const { add, use, select } = useLang();
// expose ability to add additional languages and set the current language
export { add as addLang, use as useLang, select as selectLang };
