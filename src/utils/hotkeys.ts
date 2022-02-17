import type State from '@/classes/state';
import { HotKey } from '@/types/hotKeyType';
import { keyCodesToName, KeyName, keyNames } from './key-codes';

class Hotkeys {
  hotkeys: { ctrl: any; shift: any; ctrlAlt: any; ctrlShift: any; keys: any };
  constructor() {
    this.hotkeys = {
      ctrl: {},
      shift: {},
      ctrlAlt: {},
      ctrlShift: {},
      keys: {},
    };
  }

  dispatch(e: KeyboardEvent, state: State) {
    const keyName: string = this.getKeyName(e).toString().toLowerCase();
    let opt;

    if (!keyName) return;

    if (this.isKeyEnterExact(e)) {
      opt = this.hotkeys.keys[keyName];
    } else if (this.isCtrlEnterExact(e)) {
      opt = this.hotkeys.ctrl[keyName];
    } else if (this.isShiftEnterExact(e)) {
      opt = this.hotkeys.shift[keyName];
    } else if (this.isCtrlAltEnterExact(e)) {
      opt = this.hotkeys.ctrlAlt[keyName];
    } else if (this.isCtrlShiftEnterExact(e)) {
      opt = this.hotkeys.ctrlShift[keyName];
    }

    if (opt) {
      const { action, preventDefault } = opt;

      if (preventDefault) e.preventDefault();

      action(state);
    }
  }

  isKeyEnterExact(e: KeyboardEvent) {
    return !this.isCtrlEnter(e) && !this.isShiftEnter(e) && !this.isAltEnter(e);
  }

  isCtrlShiftEnterExact(e: KeyboardEvent) {
    return this.isCtrlEnter(e) && this.isShiftEnter(e) && !this.isAltEnter(e);
  }

  isCtrlAltEnterExact(e: KeyboardEvent) {
    return this.isCtrlEnter(e) && this.isAltEnter(e) && !this.isShiftEnter(e);
  }

  isCtrlEnterExact(e: KeyboardEvent) {
    return this.isCtrlEnter(e) && !this.isShiftEnter(e) && !this.isAltEnter(e);
  }

  isShiftEnterExact(e: KeyboardEvent) {
    return this.isShiftEnter(e) && !this.isCtrlEnter(e) && !this.isAltEnter(e);
  }

  isCtrlEnter(e: KeyboardEvent) {
    return e.ctrlKey || e.metaKey;
  }

  isShiftEnter(e: KeyboardEvent) {
    return e.shiftKey;
  }

  isAltEnter(e: KeyboardEvent) {
    return e.altKey;
  }

  registerHotkeys({ modifier, key, preventDefault = true, action }: HotKey) {
    if (modifier) {
      this.hotkeys[modifier][key] = {
        preventDefault,
        action,
      };
    } else {
      this.hotkeys.keys[key] = {
        preventDefault,
        action,
      };
    }
  }

  getKeyName(e: KeyboardEvent) {
    const { key, keyCode } = e;

    if (key !== undefined) {
      const keyName = Object.keys(keyNames).find((keyName) => {
        const validNames = keyNames[keyName as KeyName];

        return typeof validNames === 'string' ? validNames === key : validNames.indexOf(key) !== -1;
      });

      return keyName || key;
    }

    return keyCodesToName[keyCode];
  }
}

export default Hotkeys;
