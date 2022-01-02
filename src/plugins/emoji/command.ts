import useCommon from '@/modules/useCommon';

export default function commandHandler(emojiType: string) {
  const { insert } = useCommon();
  insert(() => {
    const prefix = ':';
    const suffix = ':';

    return {
      text: `${prefix}${emojiType}${suffix}`,
    };
  });
}
