import typescript from 'rollup-plugin-typescript2';
import jsonPlugin from '@rollup/plugin-json';
import external from 'rollup-plugin-peer-deps-external';
import dtsPlugin from 'rollup-plugin-dts';
import licensePlugin from 'rollup-plugin-license';
import path from 'path';
import { typescriptPaths } from 'rollup-plugin-typescript-paths';

export function getRollupConfig(dependencies, dirname) {
  const inputFile = path.resolve(dirname, 'src/index.ts');
  const outputDirectory = path.resolve(dirname, 'dist');
  const artifactName = 'plugin';

  const commonBanner = licensePlugin({
    banner: {
      content: {
        file: path.resolve(dirname, '../../', 'resources', 'license_banner.txt'),
      },
    },
  });

  const tsPathsPlugin = typescriptPaths({
    tsConfigPath: path.resolve(dirname, '../../tsconfig.json'),
  });

  const commonInput = {
    input: inputFile,
    plugins: [jsonPlugin(), tsPathsPlugin, typescript(), external(), commonBanner],
  };

  const commonOutput = {
    exports: 'named',
  };

  return [
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
      plugins: [tsPathsPlugin, typescript(), dtsPlugin(), commonBanner],
      output: {
        file: `${outputDirectory}/${artifactName}.d.ts`,
        format: 'es',
      },
    },
  ];
}
