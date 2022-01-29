import Preview from '@/preview.vue';
import Container from '@/components/container.vue';
import Scrollbar from '@/components/scrollbar/index.vue';
import TocNav from '@/components/toc-nav.vue';

export const editorComponents = () => {
  const PreviewName = Preview.name;
  const ContainerName = Container.name;
  const ScrollbarName = Scrollbar.name;
  const TocNavName = TocNav.name;
  return {
    [PreviewName]: Preview,
    [ContainerName]: Container,
    [ScrollbarName]: Scrollbar,
    [TocNavName]: TocNav,
  };
};
