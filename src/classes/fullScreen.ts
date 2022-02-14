import { ref } from 'vue';

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
}

export default FullScreen;
