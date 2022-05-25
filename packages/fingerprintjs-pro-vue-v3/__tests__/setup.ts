export const init = jest.fn();
export const getVisitorData = jest.fn();
export const clearCache = jest.fn();

jest.mock('@fingerprintjs/fingerprintjs-pro-spa', () => {
  return {
    ...(jest.requireActual('@fingerprintjs/fingerprintjs-pro-spa') as any),
    FpjsClient: jest.fn(() => {
      return {
        init,
        getVisitorData,
        clearCache,
      };
    }),
  };
});
