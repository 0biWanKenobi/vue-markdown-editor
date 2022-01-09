import { Install } from '@/interfaces/IEditor';
import PluginCreatorParams from './pluginCreationFnParams';

type PluginCreatorFn = (params?: Partial<PluginCreatorParams>) => Install;
export default PluginCreatorFn;
