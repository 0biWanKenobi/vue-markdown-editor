<script lang="tsx">
// Modified from https://github.com/ElemeFE/element/tree/dev/packages/scrollbar

import { defineComponent, h, nextTick, onBeforeUnmount, onMounted, ref, toRefs, watch } from 'vue';
import { addResizeListener, removeResizeListener } from '@/utils/resize-event';
import scrollbarWidth from '@/utils/scrollbar-width';
import { arraytoObject } from '@/utils/util';
import Bar from './bar.vue';
import VueTypes, { string } from 'vue-types';
import useScrollbar from '@/modules/useScrollbar';

export default defineComponent({
  name: 'scrollbar',

  components: { Bar },

  props: {
    native: Boolean,
    disabled: Boolean,
    wrapStyle: VueTypes.oneOfType([Array, String]),
    wrapClass: null,
    viewClass: null,
    viewStyle: null,
    noresize: Boolean, // 如果 container 尺寸不会发生变化，最好设置它可以优化性能
    tag: VueTypes.string.def('div'),
    type: string<'editor' | 'preview'>(),
  },

  emits: ['scroll'],

  setup(props, { emit, slots }) {
    const { resizeEl, wrapEl } = useScrollbar(props.type);

    const sizeWidth = ref('0');
    const sizeHeight = ref('0');
    const moveX = ref(0);
    const moveY = ref(0);

    const { native, disabled, wrapStyle, wrapClass, viewClass, viewStyle, noresize, tag, type } =
      toRefs(props);

    onMounted(() => {
      if (native.value || disabled.value) return;
      nextTick(update);
    });

    watch(
      () => resizeEl.value,
      (r) => {
        if (!r || !noresize.value) return;
        addResizeListener(r, update);
      }
    );

    onBeforeUnmount(() => {
      if (native.value || disabled.value) return;
      !noresize.value && !!resizeEl.value && removeResizeListener(resizeEl.value, update);
    });

    const handleScroll = () => {
      const el = wrapEl.value;

      moveY.value = (el.scrollTop * 100) / el.clientHeight;
      moveX.value = (el.scrollLeft * 100) / el.clientWidth;

      emit('scroll');
    };

    const update = () => {
      const el = wrapEl.value;
      if (!el) return;

      const heightPercentage = (el.clientHeight * 100) / el.scrollHeight;
      const widthPercentage = (el.clientWidth * 100) / el.scrollWidth;

      sizeHeight.value = heightPercentage < 100 ? heightPercentage + '%' : '';
      sizeWidth.value = widthPercentage < 100 ? widthPercentage + '%' : '';
    };

    return () => {
      if (disabled.value) return slots.default;

      const gutter = scrollbarWidth();
      let style: any = wrapStyle.value;

      if (gutter) {
        const scrollView = resizeEl.value;
        const wrapper = wrapEl.value;
        const scrollViewHeight = scrollView?.scrollHeight;
        const scrollViewWidth = scrollView?.scrollWidth;
        const wrapperHeight = wrapper?.clientHeight;
        const wrapperWidth = wrapper?.clientWidth;

        const gutterWith = `-${gutter}px`;
        const marginBottom = scrollViewWidth > wrapperWidth ? gutterWith : 0;
        const marginRight = scrollViewHeight > wrapperHeight ? gutterWith : 0;

        const gutterStyle = `margin-bottom: ${marginBottom}; margin-right: ${marginRight};`;

        if (Array.isArray(wrapStyle.value)) {
          style = arraytoObject(wrapStyle.value);
          style.marginRight = gutterWith;
          style.marginBottom = gutterWith;
        } else if (typeof wrapStyle.value === 'string') {
          style += gutterStyle;
        } else {
          style = gutterStyle;
        }
      }

      const view = h(
        tag.value,
        {
          class: ['scrollbar__view', viewClass.value],
          style: viewStyle.value,
          ref: resizeEl,
        },
        slots.default && slots.default()
      );

      const wrap = (
        <div
          ref={wrapEl}
          style={style}
          onScroll={handleScroll}
          class={[
            wrapClass.value,
            'scrollbar__wrap',
            gutter ? '' : 'scrollbar__wrap--hidden-default',
          ]}
        >
          {[view]}
        </div>
      );
      let nodes;

      if (!native.value) {
        nodes = [
          wrap,
          <Bar type={type.value} move={moveX.value} size={sizeWidth.value}></Bar>,
          <Bar type={type.value} vertical move={moveY.value} size={sizeHeight.value}></Bar>,
        ];
      } else {
        nodes = [
          <div ref={wrapEl} class={[wrapClass.value, 'scrollbar__wrap']} style={style}>
            {[view]}
          </div>,
        ];
      }
      return h('div', { class: 'scrollbar' }, nodes);
    };
  },
});
</script>

<style lang="scss">
@import '@/styles/var';

.scrollbar {
  height: 100%;
  overflow: hidden;

  &:active,
  &:focus,
  &:hover {
    .scrollbar__bar {
      opacity: 1;
    }
  }

  &__wrap {
    height: 100%;
    overflow-x: hidden;

    &--hidden-default {
      scrollbar-width: none;

      &::-webkit-scrollbar {
        width: 0;
        height: 0;
      }
    }
  }

  &__thumb {
    position: relative;
    display: block;
    width: 0;
    height: 0;
    background-color: $scrollbar-background-color;
    border-radius: inherit;
    cursor: pointer;
    transition: background-color $scrollbar-background-transition;

    &:hover {
      background-color: $scrollbar-active-background-color;
    }
  }

  &__bar {
    position: absolute;
    right: 2px;
    bottom: 2px;
    z-index: 1;
    border-radius: $scrollbar-border-radius;
    cursor: pointer;
    opacity: 0;
    transition: opacity $scrollbar-opacity-transition;

    &.is-vertical {
      top: 2px;
      width: $scrollbar-width;

      & > div {
        width: 100%;
      }
    }

    &.is-horizontal {
      left: 2px;
      height: $scrollbar-width;

      & > div {
        height: 100%;
      }
    }
  }
}
</style>
