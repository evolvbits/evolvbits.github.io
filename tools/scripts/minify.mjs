// author: William C. Canin
import os from "os";

if (!globalThis.navigator) {
  globalThis.navigator = {
    hardwareConcurrency: os.cpus().length
  };
}

import { Transformer } from "@napi-rs/image";
import { build as esbuild } from "esbuild";
import { promises as fs } from "fs";
import { glob } from "glob";
import { minify as htmlMinify } from "html-minifier-terser";
import kleur from "kleur";
import path from "path";

const buildDir = "_site";

function kb(size) {
  return (size / 1024).toFixed(1) + "kb";
}



// Minifies all JavaScript files in the build directory
async function minifyJavaScript() {
  console.log(kleur.yellow("Minifying JavaScript files..."));

  try {
    const jsFiles = await glob(`${buildDir}/assets/js/**/*.js`);

    if (jsFiles.length === 0) {
      console.log(kleur.gray("No JavaScript files found to minify."));
      return;
    }

    await esbuild({
      entryPoints: jsFiles,
      outdir: `${buildDir}/assets/js`,
      minify: true,
      allowOverwrite: true,
      bundle: false,
    });

    console.log(kleur.green("JavaScript minified successfully!"));
  } catch (error) {
    console.error(kleur.red("Error minifying JavaScript:"), error);
    throw error;
  }
}

// Minifies all HTML files in the build directory
async function minifyHtml() {
  console.log(kleur.yellow("Minifying HTML files..."));

  try {
    const htmlFiles = await glob(`${buildDir}/**/*.html`);

    if (htmlFiles.length === 0) {
      console.log(kleur.gray("No HTML files found to minify."));
      return;
    }

    const minifyPromises = htmlFiles.map(async (file) => {
      // Extra security: ensures that only HTML will be processed.
      if (path.extname(file) !== ".html") return;

      const content = await fs.readFile(file, "utf8");

      const minifiedContent = await htmlMinify(content, {
        collapseWhitespace: true,
        removeComments: true,

        // IMPORTANT
        minifyCSS: false,
        minifyJS: false,
      });

      await fs.writeFile(file, minifiedContent);
    });

    await Promise.all(minifyPromises);

    console.log(kleur.green("HTML minified successfully!"));
  } catch (error) {
    console.error(kleur.red("Error minifying HTML:"), error);
    throw error;
  }
}

// Minifies all image files in the build directory
async function minifyImages() {
  console.log(kleur.yellow("Minifying images..."));

  const files = await glob(`${buildDir}/assets/images/**/*.{jpg,jpeg,png}`);

  if (!files.length) {
    console.log(kleur.gray("No images found."));
    return;
  }

  console.log(kleur.cyan(`Found ${files.length} images\n`));

  let totalBefore = 0;
  let totalAfter = 0;

  await Promise.all(
    files.map(async (file) => {
      const buffer = await fs.readFile(file);
      const before = buffer.length;

      const transformer = new Transformer(buffer);

      const jpeg = await transformer.jpeg(75);
      const webp = await transformer.webp(75);
      const avif = await transformer.avif({
        quality: 50,
        speed: 4 // Optional: balances speed vs compression (1-10)
      });

      const dir = path.dirname(file);
      const name = path.basename(file, path.extname(file));

      await fs.writeFile(file, jpeg);
      await fs.writeFile(path.join(dir, `${name}.webp`), webp);
      await fs.writeFile(path.join(dir, `${name}.avif`), avif);

      totalBefore += before;
      totalAfter += jpeg.length;

      console.log(
        kleur.green("✔"),
        file,
        kleur.gray(`(${kb(before)} → ${kb(jpeg.length)})`)
      );
    })
  );

  const saved = totalBefore - totalAfter;

  console.log(
    kleur.bold().green(
      `\nImages optimized: ${kb(totalBefore)} → ${kb(totalAfter)} (saved ${kb(saved)})\n`
    )
  );
}


// Main function
async function main() {
  console.log(kleur.cyan("Starting minify process..."));

  try {
    await minifyJavaScript();
    await minifyHtml();
    await minifyImages();

    console.log(kleur.bold().bgGreen("\n Minify completed successfully!\n"));
  } catch (error) {
    console.error(
      kleur.bold().bgRed("\n An error occurred during minify.\n"),
      error.shortMessage || error,
    );

    process.exit(1);
  }
}

main();
