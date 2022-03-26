import LifecycleStage from '@/types/lifecycleStage';
import { ref, SetupContext, watch } from 'vue';
import Lifecycle from './lifecycle';

class FullScreen {
  active = ref(false);

  toggle = (value = !this.active.value) => {
    this.active.value = value;
    const { 0: html, 1: body }: Record<number, HTMLElement> =
      document.querySelectorAll('html, body');
    const overflow = this.active.value ? 'hidden' : 'visible';

    body.style.overflow = overflow;
    html.style.overflow = overflow;
  };

  private _handleWindowKeyup = (e: KeyboardEvent) => {
    const key = e.key || e.keyCode;
    if ((key === 'Escape' || key === 27) && this.active.value) {
      this.toggle(false);
    }
  };

  private _onMounted = () => {
    window.addEventListener('keyup', this._handleWindowKeyup, false);

    if (this.active.value) {
      this.toggle();
    }
  };

  _onBeforeUnmount = () => {
    window.removeEventListener('keyup', this._handleWindowKeyup, false);
  };

  constructor(ctx: SetupContext<any>, lifeCycle: Lifecycle) {
    lifeCycle.setLifeCycleHooks(LifecycleStage.mounted, this._onMounted);
    lifeCycle.setLifeCycleHooks(LifecycleStage.beforeMount, this._onBeforeUnmount);

    watch(
      () => this.active.value,
      () => ctx?.emit('fullscreen-change', this.active.value)
    );
  }
}

export default FullScreen;
