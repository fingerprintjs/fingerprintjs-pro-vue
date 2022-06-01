import { getRollupConfig } from '../../rollup/config';

const { dependencies = {} } = require('./package.json');

export default getRollupConfig({
  dependencies,
  dirname: __dirname,
});
