#!/usr/bin/env node
const { writeFile } = require("fs/promises");
const { EOL } = require("os");
const { resolve } = require("path");
const replace = require("replace-in-file");
const CSS_VARIABLE_MAP = require("../assets/legacy-tokens");

const allResults = {};
const args = process.argv.slice(2);

console.log(
  "Replace CSS variables that were effected by the breaking changes in v2 of Calcite Components.",
  `${EOL}See the v2 changelog section for the full list of breaking changes:`,
  `${EOL}https://github.com/Esri/calcite-design-system/blob/main/packages/calcite-components/CHANGELOG.md#200-2023-12-02`,
);

if (args.length === 0) {
  help(
    `Missing required argument(s): glob specifying which files/directories to update. Example usage:`,
    `${EOL}$ calcite-codemod "src/**/*.{tsx,css}" "docs/**/*.md{x,}"`,
  );
  process.exit(1);
}

console.log("Replacing occurrences now, this may take a while...");

(async () => {
  for (const [oldName, newName] of Object.entries(CSS_VARIABLE_MAP)) {
    const options = {
      files: args,
      countMatches: true,
      from: new RegExp(oldName, "g"),
      to: newName,
    };

    try {
      const results = await replace(options);
      if (results.length > 0) {
        allResults[oldName] = results;
      }
    } catch (error) {
      help(
        `An error occurred while executing the code modification:${EOL}${error}`,
      );
      process.exit(1);
    }
  }

  console.log("The code modification was successful! Gathering the results...");

  let modifiedOccurrences = 0;
  const filesModified = new Set();
  const allFiles = new Set();

  try {
    for (const [_, value] of Object.entries(allResults)) {
      value.forEach((file) => {
        allFiles.add(file.file);
        if (file.hasChanged) {
          filesModified.add(file.file);
          modifiedOccurrences += file.numReplacements;
        }
      });
    }
  } catch (error) {
    help(
      `An error occurred while calculating the modification results:${EOL}${error}`,
    );
  }

  console.log(
    `${EOL}There were a total of ${modifiedOccurrences} CSS variables replaced in ${filesModified.size} files (out of ${allFiles.size} files checked.)`,
  );

  const output = JSON.stringify(allResults, null, 2);
  const outfile = `calcite-codemod-results-${Date.now()}.json`;

  try {
    await writeFile(resolve(".", outfile), output);

    console.log(
      `${EOL}The detailed results of the code modification have been written to '${outfile}'`,
    );
  } catch (error) {
    help(
      `An error occurred while writing the detailed results of the code modification to '${outfile}':${EOL}${error}`,
    );
  }
})();

/**
 * Prints help message to stderr, as well as any included parameters. Exits with code 1
 * @private
 * @since v3.0.0
 * @param  {...any} messages - info for stderr
 */
function help(...messages) {
  messages && console.error(EOL, ...messages);
  console.error(
    `${EOL}${EOL}See the project homepage for usage information:${EOL}https://github.com/benelan/calcite-codemod`,
  );
  process.exit(1);
}
