import { createLocalVue, mount } from '@vue/test-utils';
import { fpjsGetVisitorDataExtendedMixin, fpjsGetVisitorDataMixin, fpjsPlugin, FpjsVueOptions } from '../src';
import { getVisitorData } from 'shared/tests/setup';
import { wait } from 'shared/utils';

const apiKey = 'API_KEY';
const testData = {
  visitorId: '#visitor_id',
};

const pluginConfig = {
  loadOptions: {
    apiKey,
  },
} as FpjsVueOptions;

let localVue: ReturnType<typeof createLocalVue>;

describe('fpjsPlugin - mixins', () => {
  beforeEach(() => {
    localVue = createLocalVue();

    localVue.use(fpjsPlugin, pluginConfig);

    getVisitorData.mockClear();
  });

  it('should provide mixin', async () => {
    getVisitorData.mockImplementation(async () => {
      await wait(400);

      return testData;
    });

    const spy = jest.spyOn(localVue.prototype.$fpjs, 'getVisitorData');

    const { vm } = mount(
      {
        mixins: [fpjsGetVisitorDataMixin],

        template: '<h1>hello world</h1>',
      },
      {
        localVue,
      }
    );

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
    const spy = jest.spyOn(localVue.prototype.$fpjs, 'getVisitorData');

    getVisitorData.mockResolvedValue(testData);

    const { vm } = mount(
      {
        mixins: [fpjsGetVisitorDataExtendedMixin],

        template: '<h1>hello world</h1>',
      },
      {
        localVue,
      }
    );

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
