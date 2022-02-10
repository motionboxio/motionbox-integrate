import babel from "rollup-plugin-babel";
import ts from "rollup-plugin-typescript2";
import replace from "@rollup/plugin-replace";
import pkg from "./package.json";
import { uglify } from "rollup-plugin-uglify";

const PLUGINS = [
  ts({
    tsconfigOverride: { exclude: ["**/__tests"] },
  }),
  babel({
    extensions: [".ts", ".js", ".tsx", ".jsx"],
    presets: [[
      '@babel/preset-env', {
        targets: {
          node: '14.0.0'
        },
      },
    ]]
  }),
  uglify(),
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
