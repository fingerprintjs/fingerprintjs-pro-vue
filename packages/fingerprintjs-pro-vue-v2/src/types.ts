import { FpjsVueMixins } from 'shared/mixins.types';
import { FpjsVueGlobalClient } from 'shared/types';

export interface FpjsVueGlobal extends Partial<FpjsVueMixins> {
  /**
   * Globally accessible fpjs related methods
   */
  $fpjs?: FpjsVueGlobalClient;
}
