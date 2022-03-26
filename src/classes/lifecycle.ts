import LifecycleStage from '@/types/lifecycleStage';

class Lifecycle {
  private lifeCycleHooks: Record<string, (() => void)[]> = {
    [LifecycleStage.mounted]: [],
    [LifecycleStage.unmounted]: [],
    [LifecycleStage.beforeMount]: [],
    [LifecycleStage.beforeUnmount]: [],
  };

  setLifeCycleHooks = (stage: LifecycleStage, ...hooks: (() => void)[]) => {
    this.lifeCycleHooks[stage].push(...hooks);
  };

  callLifeCycleHooks = (stage: LifecycleStage) => {
    for (const hook of this.lifeCycleHooks[stage]) {
      hook();
    }
  };
}

export default Lifecycle;
