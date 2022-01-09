<script lang="ts">
import { defineComponent } from 'vue';
import VueTypes from 'vue-types';

export default defineComponent({
  props: {
    renderFn: VueTypes.instanceOf(Function).isRequired,
  },
  setup(props, { attrs }) {
    return () => props.renderFn(attrs);
  },
});
</script>
