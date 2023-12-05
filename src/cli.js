#!/usr/bin/env node
const { writeFile } = require("fs/promises");
const { EOL } = require("os");
const { resolve } = require("path");
const codemod = require("./index");

const args = process.argv.slice(2);

console.log(
  "Replace CSS variables that were effected by the breaking changes in v2 of Calcite Components.",
  `${EOL}See the v2 changelog section for the full list of breaking changes:`,
  `${EOL}https://github.com/Esri/calcite-design-system/blob/main/packages/calcite-components/CHANGELOG.md#200-2023-12-02${EOL}`,
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
  const results = await codemod({ globs: args });
  console.log("The code modification was successful! Gathering the results...");

  const { occurrencesModified, filesModified, filesChecked } = resultsSummary({
    results,
  });

  console.log(
    `${EOL}There were a total of ${occurrencesModified} CSS variables replaced in ${filesModified.size} files (out of ${filesChecked.size} files checked)`,
  );

  const outfile = `calcite-codemod-${Date.now()}.json`;
  writeResults({ results, outfile });

  console.log(
    `${EOL}The detailed results of the code modification have been written to '${outfile}'`,
  );
})();

/**
 * Get the total number of occurrences modified, files modified, and files checked
 * @private
 * @param {Object} obj - object containing the results and the filename to write the results to
 * @param {Results} obj.results - The results of the code modification
 */
function resultsSummary({ results }) {
  let occurrencesModified = 0;
  const filesModified = new Set();
  const filesChecked = new Set();

  try {
    for (const [_, value] of Object.entries(results)) {
      value.forEach((file) => {
        filesChecked.add(file.file);
        if (file.hasChanged) {
          filesModified.add(file.file);
          occurrencesModified += file.numReplacements;
        }
      });
    }
  } catch (error) {
    help(
      `An error occurred while calculating the modification results:${EOL}${error}`,
    );
  }

  return { occurrencesModified, filesModified, filesChecked };
}

/**
 * Writes the results of the code modification to a file
 * @private
 * @param {Object} obj object containing the results and the filename to write the results to
 * @param {string} obj.outfile filename to write the results to
 * @param {Results} obj.results The results of the code modification
 */
async function writeResults({ results, outfile }) {
  const output = JSON.stringify(results, null, 2);

  try {
    await writeFile(resolve(".", outfile), output);
  } catch (error) {
    help(
      `An error occurred while writing the detailed results of the code modification to '${outfile}':${EOL}${error}`,
    );
  }
}

/**
 * Prints help message to stderr, as well as any included parameters. Exits with code 1
 * @private
 * @param {...any} messages - info for stderr
 */
function help(...messages) {
  messages && console.error(...messages);
  console.error(
    `${EOL}${EOL}See the project homepage for usage information:${EOL}https://github.com/benelan/calcite-codemod`,
  );
  process.exit(1);
}

/**
 * Result of the find/replace for a specific file. This is directly from the `replace-in-file` package.
 * @see {@link https://www.npmjs.com/package/replace-in-file#counting-matches-and-replacements}
 * @typedef {Object} FileResult
 * @property {string} file - file path
 * @property {boolean} hasChanged - whether the file was modified
 * @property {number} numMatches - number of matches found in the file
 * @property {number} numReplacements - number of replacements made in the file
 */

/**
 * @typedef {Object} Results
 * @property {Object.<string, FileResult[]>} results - The results of the code modification, grouped by the CSS variable that was replaced.
 */
