# Calcite Codemod

This is a small (unofficial) package for automatically updating code after breaking changes to Calcite Design System packages.
The major version of this package will always align with the major version of [`@esri/calcite-components`](https://www.npmjs.com/package/@esri/calcite-components) that it targets.
However, this package may not be updated for every major release of [`@esri/calcite-components`](https://www.npmjs.com/package/@esri/calcite-components).

The current iteration of this package renames the CSS variables used to modify the styles of Calcite Components.
Please read the [v2 changelog section of Calcite Components](https://github.com/Esri/calcite-design-system/blob/main/packages/calcite-components/package.json) for a full list of breaking changes.

## Installation

Install [the package](https://www.npmjs.com/package/@ben-elan/calcite-codemod) globally and use it anywhere:

```bash
npm i -g @ben-elan/calcite-codemod@v2
```

Use it in a single application:

```bash
npm i -D @ben-elan/calcite-codemod@v2
```

Or try it out before installing:

```bash
npx @ben-elan/calcite-codemod "styles.css" "index.html" "src/*.js"
```

> **NOTE:** You cannot specify the version of a package when using `npx`, so make sure the current major version of `@ben-elan/calcite-codemod` aligns with your major version of `@esri/calcite-components`. Otherwise, use one of the previous installation methods above.

## Using the CLI

`@ben-elan/calcite-codemod` provides a command line interface (CLI), which renames the CSS Variables in your application.
The CLI requires one or more arguments specifying which files/directories to update. The arguments support glob syntax.
For more information, see this [Glob primer](https://github.com/isaacs/node-glob#glob-primer) by the package used internally for expanding globs.

Here are a couple usage examples:

```sh
# replace occurrences of renamed CSS variables in style.css, index.html, and all js files in src/
calcite-codemod "styles.css" "index.html" "src/*.js"

# replace all js/ts/jsx/tsx/css/scss files in src/ and all of its child directories
calcite-codemod "src/**/*.{js,ts,jsx,tsx,css,scss}"

# same as the previous example, except a lot more confusing
calcite-codemod "src/**/*.{{j,t}s{x,},{s,}css}"
```

## Using the CSS

This package also contains a CSS file that maps all the old variable names to the new ones.
Add this to your application so you can update to Calcite Components v2 before renaming all the CSS Variables.

```html
<script
  type="module"
  src="https://cdn.jsdelivr.net/npm/@esri/calcite-components@v2/dist/calcite/calcite.esm.js"
></script>
<link
  rel="stylesheet"
  type="text/css"
  href="https://cdn.jsdelivr.net/npm/@esri/calcite-components@v2/dist/calcite/calcite.css"
/>

<!-- Make sure to add `legacy-tokens.css` after `calcite.css` -->
<link
  rel="stylesheet"
  type="text/css"
  href="https://cdn.jsdelivr.net/npm/@ben-elan/calcite-codemod@v2/dist/legacy-tokens.css"
/>
```
