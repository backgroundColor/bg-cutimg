import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';
import { uglify } from "rollup-plugin-uglify";
export default {
  input: './cutimg.js',
  output: {
    file: 'lib/cutimg.min.js',
    format: 'iife',
    strict: false
  },
  plugins: [
    resolve(),
    commonjs(),
    uglify(),
    babel({
      exclude: 'node_modules/**'
    })
  ]
}
