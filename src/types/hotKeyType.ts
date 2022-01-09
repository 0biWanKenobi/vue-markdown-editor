export type HotKeyModifier = 'ctrl' | 'shift' | 'ctrlAlt' | 'ctrlShift' | 'keys';

export type HotKey = {
  modifier?: HotKeyModifier;
  key: string;
  preventDefault?: boolean;
  action: any;
};
