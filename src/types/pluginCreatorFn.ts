import Install from '@/types/installType';
import PluginCreatorParams from './pluginCreationFnParams';

type PluginCreatorFn = (params?: Partial<PluginCreatorParams>) => Install;
export default PluginCreatorFn;
