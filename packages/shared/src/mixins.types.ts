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

export interface FpjsVueMixins {
  /**
   * Method for fetching visitor data
   * */
  $getVisitorData: FpjsGetVisitorDataMethod<any>;

  /**
   * Method for fetching extended data
   * */
  $getVisitorDataExtended: FpjsGetVisitorDataMethod<any>;

  /**
   * Query state for visitor data
   * */
  visitorData: FpjsVisitorQueryData<false>;

  /**
   * Query state for extended visitor data
   * */
  visitorDataExtended: FpjsVisitorQueryData<true>;
}
