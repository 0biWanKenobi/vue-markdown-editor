import MarkdownIt from 'markdown-it';

type GetMarksFn = (title: string, level: number, slug: any) => { attr: string; value: string }[];

export default function (
  md: MarkdownIt,
  options: {
    getMarks?: GetMarksFn;
  } = {}
) {
  const { getMarks } = options;

  if (!getMarks) return;

  md.core.ruler.push('anchor', (state) => {
    const slugs: Record<string, any> = {};
    const { tokens } = state;

    tokens
      .filter((token) => token.type === 'heading_open')
      .forEach((token) => {
        // Aggregate the next token children text.
        const heading = tokens[tokens.indexOf(token) + 1];
        const title = heading.content;
        const level = Number(token.tag.substring(1));

        slugs[title] = title in slugs ? Number(slugs[title]) + 1 : '';
        const marks = getMarks(title, level, slugs[title]);

        if (marks) {
          marks.forEach(({ attr, value }) => {
            token.attrPush([attr, value]);
          });
        }
      });
  });
}
