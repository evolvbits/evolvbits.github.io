// author: William C. Canin
import { build as esbuild } from "esbuild";
import { promises as fs } from "fs";
import { glob } from "glob";
import { minify as htmlMinify } from "html-minifier-terser";
import kleur from "kleur";
import path from "path";
import sharp from "sharp";

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
      // segurança extra: garante que só HTML será processado
      if (path.extname(file) !== ".html") return;

      const content = await fs.readFile(file, "utf8");

      const minifiedContent = await htmlMinify(content, {
        collapseWhitespace: true,
        removeComments: true,

        // IMPORTANTE
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
  const files = await glob(`${buildDir}/assets/images/**/*.{jpg,jpeg,png}`);

  if (!files.length) {
    console.log(kleur.yellow("No images found."));
    return;
  }

  console.log(kleur.cyan(`Found ${files.length} images\n`));

  for (const file of files) {
    const buffer = await fs.readFile(file);
    const image = sharp(buffer);
    const metadata = await image.metadata();

    const dir = path.dirname(file);
    const name = path.basename(file, path.extname(file));

    let optimized;

    if (metadata.format === "jpeg") {
      optimized = await image
        .jpeg({
          quality: 75,
          mozjpeg: true,
        })
        .toBuffer();
    }

    if (metadata.format === "png") {
      optimized = await image
        .png({
          compressionLevel: 9,
          palette: true,
        })
        .toBuffer();
    }

    if (!optimized) continue;

    await fs.writeFile(file, optimized);

    console.log(
      kleur.green("✔"),
      file,
      kleur.gray(`(${kb(buffer.length)} → ${kb(optimized.length)})`)
    );

    // WEBP
    const webp = await sharp(optimized)
      .webp({ quality: 75 })
      .toBuffer();

    const webpPath = `${dir}/${name}.webp`;
    await fs.writeFile(webpPath, webp);

    console.log(
      kleur.blue("  → webp"),
      kleur.gray(`${kb(webp.length)}`)
    );

    // AVIF
    const avif = await sharp(optimized)
      .avif({ quality: 50 })
      .toBuffer();

    const avifPath = `${dir}/${name}.avif`;
    await fs.writeFile(avifPath, avif);

    console.log(
      kleur.magenta("  → avif"),
      kleur.gray(`${kb(avif.length)}`)
    );
  }
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
