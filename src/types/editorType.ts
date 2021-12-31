export const BASE_EDITOR = 'base';
export const CODEMIRROR_EDITOR = 'codemirror';

type EDITOR_TYPE = typeof BASE_EDITOR | typeof CODEMIRROR_EDITOR;

export default EDITOR_TYPE;
