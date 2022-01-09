<script lang="tsx">
// Modified from https://github.com/ElemeFE/element/tree/dev/packages/scrollbar
import { computed, defineComponent, toRefs, onUnmounted, ref } from 'vue';
import VueTypes, { string } from 'vue-types';
import { renderThumbStyle, BAR_MAP } from './util';

export default defineComponent({
  name: 'Bar',
  props: {
    vertical: Boolean,
    size: string().isRequired,
    move: VueTypes.number.isRequired,
  },
  setup(props) {
    const { vertical, size, move } = toRefs(props);
    const bar = computed(() => BAR_MAP[vertical ? 'vertical' : 'horizontal']);

    const rootEl = ref();
    const thumbEl = ref();

    //  return this.$parent.wrap;
    const wrap = computed(() => rootEl.value?.$parent.wrap);

    const axes: {
      ['X']?: any;
      ['Y']?: any;
    } = {};

    const clickThumbHandler = (e: MouseEvent) => {
      // prevent click event of right button
      if (e.ctrlKey || e.button === 2) {
        return;
      }
      startDrag(e);
      const target = e.currentTarget as HTMLElement | null;
      axes[bar.value.axis] =
        target &&
        target[bar.value.offset] -
          (e[bar.value.client] - target.getBoundingClientRect()[bar.value.direction]);
    };

    const clickTrackHandler = (e: MouseEvent) => {
      const htmlTarget = e.currentTarget as HTMLElement | null;
      const offset =
        htmlTarget &&
        Math.abs(htmlTarget.getBoundingClientRect()[bar.value.direction] - e[bar.value.client]);
      const thumbHalf = thumbEl.value.$el[bar.value.offset] / 2;
      const thumbPositionPercentage =
        offset && ((offset - thumbHalf) * 100) / rootEl.value.$el[bar.value.offset];

      thumbPositionPercentage &&
        (wrap.value[bar.value.scroll] =
          (thumbPositionPercentage * wrap.value[bar.value.scrollSize]) / 100);
    };

    let cursorDown = false;

    const startDrag = (e: MouseEvent) => {
      e.stopImmediatePropagation();
      cursorDown = true;

      document.addEventListener('mousemove', mouseMoveDocumentHandler, false);
      document.addEventListener('mouseup', mouseUpDocumentHandler, false);
      document.onselectstart = () => false;
    };

    const mouseMoveDocumentHandler = (e: MouseEvent) => {
      if (cursorDown === false) return;
      const prevPage = axes[bar.value.axis];

      if (!prevPage) return;

      const offset =
        (rootEl.value.$el.getBoundingClientRect()[bar.value.direction] - e[bar.value.client]) * -1;
      const thumbClickPosition = thumbEl.value.$el[bar.value.offset] - prevPage;
      const thumbPositionPercentage =
        ((offset - thumbClickPosition) * 100) / rootEl.value.$el[bar.value.offset];

      wrap.value[bar.value.scroll] =
        (thumbPositionPercentage * wrap.value[bar.value.scrollSize]) / 100;
    };

    const mouseUpDocumentHandler = () => {
      cursorDown = false;
      axes[bar.value.axis] = 0;
      document.removeEventListener('mousemove', mouseMoveDocumentHandler, false);
      document.onselectstart = null;
    };

    onUnmounted(() => {
      document.removeEventListener('mouseup', mouseUpDocumentHandler, false);
    });

    return () => (
      <div
        class={['scrollbar__bar', 'is-' + bar.value.key]}
        onMousedown={clickTrackHandler}
        onClick={(e) => e.stopPropagation()}
        ref={rootEl}
      >
        <div
          ref={thumbEl}
          class="scrollbar__thumb"
          onMousedown={clickThumbHandler}
          style={renderThumbStyle({ size: size.value, move: move.value, bar: bar.value })}
        ></div>
      </div>
    );
  },
});
</script>
