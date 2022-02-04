import babel from "rollup-plugin-babel";
import ts from "rollup-plugin-typescript2";
import replace from "@rollup/plugin-replace";
import pkg from "./package.json";
import commonjs from '@rollup/plugin-commonjs';
import { nodeResolve } from '@rollup/plugin-node-resolve';

const PLUGINS = [
  ts({
    tsconfigOverride: { exclude: ["**/__tests"] },
  }),
  babel({
    extensions: [".ts", ".js", ".tsx", ".jsx"],
    presets: ['@babel/env']
  }),
  nodeResolve({browser: true}),
  commonjs(),
  replace({
    _VERSION: JSON.stringify(pkg.version),
  }),
];

export default [
  {
    input: "src/index.ts",
    output: [
      { file: pkg.main, format: "cjs" },
      { file: pkg.module, format: "es" }
    ],
    plugins: PLUGINS,
  }
];
