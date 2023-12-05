const { EOL } = require("os");
const replace = require("replace-in-file");
const CSS_VARIABLE_MAP = require("../assets/legacy-tokens");

module.exports = async function ({ globs }) {
  const results = {};

  for (const [oldName, newName] of Object.entries(CSS_VARIABLE_MAP)) {
    const options = {
      files: globs,
      countMatches: true,
      from: new RegExp(oldName, "g"),
      to: newName,
    };

    try {
      const result = await replace(options);
      if (result.length > 0) {
        results[oldName] = result;
      }
    } catch (error) {
      consoole.error(
        `An error occurred while executing the code modification:${EOL}${error}`,
        `${EOL}${EOL}See the project homepage for usage information:${EOL}https://github.com/benelan/calcite-codemod`,
      );
      process.exit(1);
    }
  }

  return results;
};
