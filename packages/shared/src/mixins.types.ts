import type { GetOptions } from '@fingerprintjs/fingerprintjs-pro-spa';
import type { FpjsVisitorQueryData, FpjsVueGlobalClient, GetDataOptions } from 'shared/types';

export type FpjsGetVisitorDataMethodThis = {
  $root: {
    $fpjs?: FpjsVueGlobalClient;
  };
  $fpjs?: FpjsVueGlobalClient;
} & Partial<FpjsVisitorQueryData<boolean>>;

export type FpjsGetVisitorDataMethod = (
  this: FpjsGetVisitorDataMethodThis,
  options: Omit<GetOptions<boolean>, 'extendedResult'> & GetDataOptions
) => Promise<void>;

interface FpjsVueMixin<TExtended extends boolean> extends FpjsVisitorQueryData<TExtended> {
  $getVisitorData?: FpjsGetVisitorDataMethod;
}

export interface FpjsVueMixins {
  $getVisitorData: FpjsGetVisitorDataMethod;
  $getVisitorDataExtended: FpjsGetVisitorDataMethod;

  $visitorData: FpjsVueMixin<false>;
  $visitorDataExtended: FpjsVueMixin<true>;
}
