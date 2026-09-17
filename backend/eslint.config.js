const js = require("@eslint/js");

module.exports = [
  { ignores: ["public/**", "generated/**"] },
  js.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "commonjs",
      globals: {
        process: "readonly",
        require: "readonly",
        module: "writable",
        __dirname: "readonly",
        console: "readonly",
        fetch: "readonly",
        URL: "readonly",
      },
    },
  },
];
