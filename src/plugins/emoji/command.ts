import type State from '@/classes/state';

export default function commandHandler(emojiType: string, state: State) {
  state.insert(() => {
    const prefix = ':';
    const suffix = ':';

    return {
      text: `${prefix}${emojiType}${suffix}`,
    };
  });
}
