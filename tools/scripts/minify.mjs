// author: William C. Canin
import { build as esbuild } from 'esbuild';
import { promises as fs } from 'fs';
import { glob } from 'glob';
import { minify as htmlMinify } from 'html-minifier-terser';
import kleur from 'kleur';
import path from 'path';

const buildDir = '_site';

// Minifies all JavaScript files in the build directory
async function minifyJavaScript() {
  console.log(kleur.yellow('Minifying JavaScript files...'));

  try {
    const jsFiles = await glob(`${buildDir}/assets/js/**/*.js`);

    if (jsFiles.length === 0) {
      console.log(kleur.gray('No JavaScript files found to minify.'));
      return;
    }

    await esbuild({
      entryPoints: jsFiles,
      outdir: `${buildDir}/assets/js`,
      minify: true,
      allowOverwrite: true,
      bundle: false
    });

    console.log(kleur.green('JavaScript minified successfully!'));

  } catch (error) {
    console.error(kleur.red('Error minifying JavaScript:'), error);
    throw error;
  }
}

// Minifies all HTML files in the build directory
async function minifyHtml() {
  console.log(kleur.yellow('Minifying HTML files...'));

  try {

    const htmlFiles = await glob(`${buildDir}/**/*.html`);

    if (htmlFiles.length === 0) {
      console.log(kleur.gray('No HTML files found to minify.'));
      return;
    }

    const minifyPromises = htmlFiles.map(async (file) => {

      // segurança extra: garante que só HTML será processado
      if (path.extname(file) !== ".html") return;

      const content = await fs.readFile(file, 'utf8');

      const minifiedContent = await htmlMinify(content, {
        collapseWhitespace: true,
        removeComments: true,

        // IMPORTANTE
        minifyCSS: false,
        minifyJS: false
      });

      await fs.writeFile(file, minifiedContent);

    });

    await Promise.all(minifyPromises);

    console.log(kleur.green('HTML minified successfully!'));

  } catch (error) {
    console.error(kleur.red('Error minifying HTML:'), error);
    throw error;
  }
}

// Main function
async function main() {

  console.log(kleur.cyan('Starting minify process...'));

  try {

    await Promise.all([
      minifyJavaScript(),
      minifyHtml()
    ]);

    console.log(kleur.bold().bgGreen('\n Minify completed successfully!\n'));

  } catch (error) {

    console.error(
      kleur.bold().bgRed('\n An error occurred during minify.\n'),
      error.shortMessage || error
    );

    process.exit(1);

  }
}

main();
