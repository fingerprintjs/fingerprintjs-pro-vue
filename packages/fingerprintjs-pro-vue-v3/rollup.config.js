import typescript from 'rollup-plugin-typescript2';
import jsonPlugin from '@rollup/plugin-json';
import external from 'rollup-plugin-peer-deps-external';
import dtsPlugin from 'rollup-plugin-dts';
import licensePlugin from 'rollup-plugin-license';
import path from 'path';

const { dependencies = {} } = require('./package.json');

const inputFile = path.resolve(__dirname, 'src/index.ts');
const outputDirectory = path.resolve(__dirname, 'dist');
const artifactName = 'plugin';

const commonBanner = licensePlugin({
  banner: {
    content: {
      file: path.resolve(__dirname, '../../', 'resources', 'license_banner.txt'),
    },
  },
});

const commonInput = {
  input: inputFile,
  plugins: [jsonPlugin(), typescript(), external(), commonBanner],
};

const commonOutput = {
  exports: 'named',
};

export default [
  {
    ...commonInput,
    external: Object.keys(dependencies),
    output: [
      // CJS for usage with `require()`
      {
        ...commonOutput,
        file: `${outputDirectory}/${artifactName}.cjs.js`,
        format: 'cjs',
      },

      // ESM for usage with `import`
      {
        ...commonOutput,
        file: `${outputDirectory}/${artifactName}.esm.js`,
        format: 'es',
      },
    ],
  },

  // TypeScript definition
  {
    ...commonInput,
    plugins: [dtsPlugin(), commonBanner],
    output: {
      file: `${outputDirectory}/${artifactName}.d.ts`,
      format: 'es',
    },
  },
];
