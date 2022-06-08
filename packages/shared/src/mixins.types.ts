import type { GetOptions } from '@fingerprintjs/fingerprintjs-pro-spa';
import type { FpjsVisitorQueryData, FpjsVueGlobalClient, GetDataOptions } from 'shared/types';

export type FpjsGetVisitorDataMethodThis = {
  $root?: {
    $fpjs?: FpjsVueGlobalClient;
  };
  $fpjs?: FpjsVueGlobalClient;
};

export type GetVisitorDataMethodParams = Omit<GetOptions<boolean>, 'extendedResult'> & GetDataOptions;

export type FpjsGetVisitorDataMethod<This = FpjsGetVisitorDataMethodThis> = (
  this: This,
  options?: GetVisitorDataMethodParams
) => Promise<void>;

interface FpjsVueMixin<TExtended extends boolean> extends FpjsVisitorQueryData<TExtended> {
  $getVisitorData?: FpjsGetVisitorDataMethod;
}

export interface FpjsVueMixins {
  $getVisitorData: FpjsGetVisitorDataMethod<any>;
  $getVisitorDataExtended: FpjsGetVisitorDataMethod<any>;

  visitorData: FpjsVueMixin<false>;
  visitorDataExtended: FpjsVueMixin<true>;
}
