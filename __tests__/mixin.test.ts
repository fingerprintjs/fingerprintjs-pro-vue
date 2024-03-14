import { config, mount } from '@vue/test-utils';
import { fpjsGetVisitorDataExtendedMixin, fpjsGetVisitorDataMixin, fpjsPlugin, FpjsVueOptions } from '../src';
import { getVisitorData } from '../src/tests/setup';
import { wait } from '../src/utils';

const apiKey = 'API_KEY';
const testData = {
  visitorId: '#visitor_id',
};

const pluginConfig = {
  loadOptions: {
    apiKey,
  },
} as FpjsVueOptions;

describe('fpjsPlugin - mixins', () => {
  beforeAll(() => {
    config.global.plugins.push([fpjsPlugin, pluginConfig]);
  });

  beforeEach(() => {
    getVisitorData.mockClear();
  });

  it('should provide mixin', async () => {
    getVisitorData.mockImplementation(async () => {
      await wait(400);

      return testData;
    });

    const { vm } = mount({
      mixins: [fpjsGetVisitorDataMixin],

      template: '<h1>hello world</h1>',
    });

    const spy = jest.spyOn(vm.$fpjs, 'getVisitorData');

    expect(vm.$getVisitorData).toBeDefined();
    expect(vm.visitorData).toBeDefined();
    expect(vm.visitorData).toMatchInlineSnapshot(`
Object {
  "data": undefined,
  "error": undefined,
  "isLoading": false,
}
`);

    vm.$getVisitorData?.();

    expect(vm.visitorData?.isLoading).toBe(true);

    await wait(450);

    expect(vm.visitorData).toMatchInlineSnapshot(`
Object {
  "data": Object {
    "visitorId": "#visitor_id",
  },
  "error": undefined,
  "isLoading": false,
}
`);

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith({ extendedResult: false }, undefined);
  });

  it('should provide mixin with extended data', async () => {
    getVisitorData.mockResolvedValue(testData);

    const { vm } = mount({
      mixins: [fpjsGetVisitorDataExtendedMixin],

      template: '<h1>hello world</h1>',
    });

    const spy = jest.spyOn(vm.$fpjs, 'getVisitorData');

    expect(vm.$getVisitorDataExtended).toBeDefined();
    expect(vm.visitorDataExtended).toBeDefined();
    expect(vm.visitorDataExtended).toMatchInlineSnapshot(`
Object {
  "data": undefined,
  "error": undefined,
  "isLoading": false,
}
`);

    await vm.$getVisitorDataExtended?.();

    expect(vm.visitorDataExtended).toMatchInlineSnapshot(`
Object {
  "data": Object {
    "visitorId": "#visitor_id",
  },
  "error": undefined,
  "isLoading": false,
}
`);

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith({ extendedResult: true }, undefined);
  });
});
